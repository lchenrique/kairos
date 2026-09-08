import { createHash, randomBytes } from 'node:crypto'
import bcrypt from 'bcrypt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { requirePermission } from '../../lib/authorization.js'
import { sendTeamInvitationEmail } from '../../lib/mailer.js'
import { prisma } from '../../lib/prisma.js'
import { requireCurrentChurch } from '../../lib/tenant.js'
import { UserRoleEnum } from '../../schemas/auth.js'
import { errorResponseSchema } from '../../schemas/shared.js'

const createInviteSchema = z.object({
  name: z.string().trim().min(3).max(120),
  email: z.string().trim().toLowerCase().email(),
  role: UserRoleEnum.default('USER'),
})

const acceptInviteSchema = z.object({
  token: z.string().min(32).max(128),
  password: z.string().min(8),
})

const invitationStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'])
const inviteSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: UserRoleEnum,
  status: invitationStatusSchema,
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  church: z.object({ id: z.string(), name: z.string() }),
  invitedBy: z.object({ id: z.string(), name: z.string() }),
})

const acceptedUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: UserRoleEnum,
  status: z.literal('ACTIVE'),
  createdAt: z.coerce.date(),
})

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function createInviteToken(email: string) {
  if (process.env.NODE_ENV === 'test' && process.env.TEST_INVITE_TOKENS === 'deterministic') {
    return createHash('sha256').update(`kairos-invite:${email}`).digest('hex')
  }
  return randomBytes(32).toString('hex')
}

function invitationStatus(invite: {
  acceptedAt: Date | null
  revokedAt: Date | null
  expiresAt: Date
}) {
  if (invite.acceptedAt) return 'ACCEPTED' as const
  if (invite.revokedAt) return 'REVOKED' as const
  if (invite.expiresAt <= new Date()) return 'EXPIRED' as const
  return 'PENDING' as const
}

export const invites: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/',
    {
      onRequest: [app.authenticate],
      preHandler: [app.loadTenant, requirePermission('TEAM_MANAGE')],
      schema: {
        tags: ['auth'],
        description: 'Lista o histórico de convites da Rede',
        response: {
          200: z.array(inviteSummarySchema),
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request) => {
      const invitations = await prisma.userInvite.findMany({
        where: { organizationId: request.tenant.organizationId },
        include: {
          church: { select: { id: true, name: true } },
          invitedBy: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
      return invitations.map((invite) => ({
        ...invite,
        role: UserRoleEnum.parse(invite.role),
        status: invitationStatus(invite),
      }))
    },
  )

  app.post(
    '/',
    {
      onRequest: [app.authenticate],
      preHandler: [app.loadTenant, requirePermission('TEAM_MANAGE')],
      schema: {
        tags: ['auth'],
        description: 'Convida uma pessoa para definir a própria senha e entrar na equipe',
        body: createInviteSchema,
        response: {
          201: inviteSummarySchema,
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          503: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const churchId = requireCurrentChurch(request, reply)
      if (!churchId) return

      const existingUser = await prisma.user.findUnique({ where: { email: request.body.email } })
      if (existingUser) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          code: 'USER_EXISTS',
          message: 'Este e-mail já pertence a uma conta.',
        })
      }

      const pendingInvite = await prisma.userInvite.findFirst({
        where: {
          organizationId: request.tenant.organizationId,
          email: request.body.email,
          acceptedAt: null,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
      })
      if (pendingInvite) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          code: 'INVITE_PENDING',
          message: 'Já existe um convite válido para este e-mail.',
        })
      }

      const rawToken = createInviteToken(request.body.email)
      const invite = await prisma.userInvite.create({
        data: {
          organizationId: request.tenant.organizationId,
          churchId,
          invitedById: request.user.sub,
          name: request.body.name,
          email: request.body.email,
          role: request.body.role,
          tokenHash: hashToken(rawToken),
          expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
        },
        include: {
          church: { select: { id: true, name: true } },
          invitedBy: { select: { id: true, name: true } },
        },
      })

      try {
        await sendTeamInvitationEmail({
          name: invite.name,
          email: invite.email,
          organizationName: request.tenant.organizationName,
          invitedByName: invite.invitedBy.name,
          token: rawToken,
        })
      } catch (error) {
        await prisma.userInvite.update({
          where: { id: invite.id },
          data: { revokedAt: new Date() },
        })
        request.log.error({ error, inviteId: invite.id }, 'Falha ao enviar convite da equipe')
        return reply.status(503).send({
          statusCode: 503,
          error: 'Service Unavailable',
          code: 'EMAIL_DELIVERY_FAILED',
          message: 'Não foi possível enviar o convite. Tente novamente mais tarde.',
        })
      }

      return reply.status(201).send({
        ...invite,
        role: UserRoleEnum.parse(invite.role),
        status: 'PENDING',
      })
    },
  )

  app.post(
    '/accept',
    {
      schema: {
        tags: ['auth'],
        description: 'Aceita um convite válido e define a senha da nova conta',
        body: acceptInviteSchema,
        response: {
          201: acceptedUserSchema,
          400: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const tokenHash = hashToken(request.body.token)
      const invite = await prisma.userInvite.findFirst({
        where: {
          tokenHash,
          acceptedAt: null,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
      })
      if (!invite) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          code: 'INVALID_INVITE',
          message: 'Convite inválido, expirado ou já utilizado.',
        })
      }

      const user = await prisma.$transaction(async (tx) => {
        const stillAvailable = await tx.userInvite.updateMany({
          where: { id: invite.id, acceptedAt: null, revokedAt: null },
          data: { acceptedAt: new Date() },
        })
        if (stillAvailable.count !== 1) throw new Error('INVITE_ALREADY_USED')

        const created = await tx.user.create({
          data: {
            name: invite.name,
            email: invite.email,
            password: await bcrypt.hash(request.body.password, 10),
            role: invite.role,
          },
        })
        await tx.organizationUser.create({
          data: {
            organizationId: invite.organizationId,
            userId: created.id,
            role: invite.role,
            defaultChurchId: invite.churchId,
          },
        })
        await tx.churchUser.create({
          data: { churchId: invite.churchId, userId: created.id, role: invite.role },
        })
        return created
      })

      return reply.status(201).send({
        id: user.id,
        name: user.name,
        email: user.email,
        role: UserRoleEnum.parse(user.role),
        status: 'ACTIVE',
        createdAt: user.createdAt,
      })
    },
  )

  app.delete(
    '/:id',
    {
      onRequest: [app.authenticate],
      preHandler: [app.loadTenant, requirePermission('TEAM_MANAGE')],
      schema: {
        tags: ['auth'],
        description: 'Revoga um convite pendente',
        params: z.object({ id: z.string() }),
        response: {
          204: z.null(),
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const result = await prisma.userInvite.updateMany({
        where: {
          id: request.params.id,
          organizationId: request.tenant.organizationId,
          acceptedAt: null,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      })
      if (result.count !== 1) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'INVITE_NOT_FOUND',
          message: 'Convite pendente não encontrado.',
        })
      }
      return reply.status(204).send()
    },
  )
}
