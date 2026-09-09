import type { FastifyReply } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { requirePermission } from '../../lib/authorization.js'
import { requireActiveSubscriptionForMutation } from '../../lib/billing.js'
import { prisma } from '../../lib/prisma.js'
import { UserRoleEnum } from '../../schemas/auth.js'
import { errorResponseSchema } from '../../schemas/shared.js'

const MembershipStatusEnum = z.enum(['ACTIVE', 'SUSPENDED'])
const userSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: UserRoleEnum,
  status: MembershipStatusEnum,
  createdAt: z.coerce.date(),
})

async function isLastActiveAdmin(organizationId: string, userId: string) {
  const membership = await prisma.organizationUser.findUnique({
    where: { organizationId_userId: { organizationId, userId } },
    select: { role: true, status: true },
  })
  if (!membership || membership.role !== 'ADMIN' || membership.status !== 'ACTIVE') return false

  const activeAdmins = await prisma.organizationUser.count({
    where: { organizationId, role: 'ADMIN', status: 'ACTIVE' },
  })
  return activeAdmins <= 1
}

function lastAdminError(reply: FastifyReply) {
  return reply.status(400).send({
    statusCode: 400,
    error: 'Bad Request',
    code: 'LAST_ACTIVE_ADMIN',
    message: 'A Rede precisa manter pelo menos um administrador ativo.',
  })
}

export const users: FastifyPluginAsyncZod = async (app) => {
  app.addHook('preHandler', app.loadTenant)
  app.addHook('preHandler', requireActiveSubscriptionForMutation)

  app.get(
    '/',
    {
      onRequest: [app.authenticate],
      preHandler: [requirePermission('TEAM_MANAGE')],
      schema: {
        tags: ['auth'],
        description: 'Lista usuários da equipe',
        response: {
          200: z.array(userSummarySchema),
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request) => {
      const memberships = await prisma.organizationUser.findMany({
        where: { organizationId: request.tenant.organizationId },
        select: {
          role: true,
          status: true,
          user: { select: { id: true, name: true, email: true, createdAt: true } },
        },
        orderBy: { user: { name: 'asc' } },
      })
      return memberships.map(({ user, role, status }) => ({
        ...user,
        role: UserRoleEnum.parse(role),
        status: MembershipStatusEnum.parse(status),
      }))
    },
  )

  app.patch(
    '/:id/role',
    {
      onRequest: [app.authenticate],
      preHandler: [requirePermission('TEAM_MANAGE')],
      schema: {
        tags: ['auth'],
        description: 'Atualiza o perfil de acesso de um usuário',
        params: z.object({ id: z.string() }),
        body: z.object({ role: UserRoleEnum }),
        response: {
          200: userSummarySchema,
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const membership = await prisma.organizationUser.findUnique({
        where: {
          organizationId_userId: {
            organizationId: request.tenant.organizationId,
            userId: request.params.id,
          },
        },
      })
      if (!membership) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado nesta Rede.',
        })
      }
      if (
        request.body.role !== 'ADMIN' &&
        (await isLastActiveAdmin(request.tenant.organizationId, request.params.id))
      ) {
        return lastAdminError(reply)
      }

      const [organizationUser, user] = await prisma.$transaction([
        prisma.organizationUser.update({
          where: { id: membership.id },
          data: { role: request.body.role },
        }),
        prisma.user.update({
          where: { id: request.params.id },
          data: { role: request.body.role },
          select: { id: true, name: true, email: true, createdAt: true },
        }),
        prisma.churchUser.updateMany({
          where: {
            userId: request.params.id,
            church: { organizationId: request.tenant.organizationId },
          },
          data: { role: request.body.role },
        }),
      ])
      return {
        ...user,
        role: UserRoleEnum.parse(organizationUser.role),
        status: MembershipStatusEnum.parse(organizationUser.status),
      }
    },
  )

  app.patch(
    '/:id/status',
    {
      onRequest: [app.authenticate],
      preHandler: [requirePermission('TEAM_MANAGE')],
      schema: {
        tags: ['auth'],
        description: 'Suspende ou reativa o acesso de uma pessoa à Rede',
        params: z.object({ id: z.string() }),
        body: z.object({ status: MembershipStatusEnum }),
        response: {
          200: userSummarySchema,
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const membership = await prisma.organizationUser.findUnique({
        where: {
          organizationId_userId: {
            organizationId: request.tenant.organizationId,
            userId: request.params.id,
          },
        },
        include: { user: { select: { id: true, name: true, email: true, createdAt: true } } },
      })
      if (!membership) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado nesta Rede.',
        })
      }
      if (
        request.body.status === 'SUSPENDED' &&
        (await isLastActiveAdmin(request.tenant.organizationId, request.params.id))
      ) {
        return lastAdminError(reply)
      }

      const updated = await prisma.organizationUser.update({
        where: { id: membership.id },
        data: {
          status: request.body.status,
          suspendedAt: request.body.status === 'SUSPENDED' ? new Date() : null,
          suspendedById: request.body.status === 'SUSPENDED' ? request.user.sub : null,
        },
      })
      return {
        ...membership.user,
        role: UserRoleEnum.parse(updated.role),
        status: MembershipStatusEnum.parse(updated.status),
      }
    },
  )

  app.delete(
    '/:id',
    {
      onRequest: [app.authenticate],
      preHandler: [requirePermission('TEAM_MANAGE')],
      schema: {
        tags: ['auth'],
        description: 'Revoga permanentemente o acesso de uma pessoa à Rede',
        params: z.object({ id: z.string() }),
        response: {
          204: z.null(),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const membership = await prisma.organizationUser.findUnique({
        where: {
          organizationId_userId: {
            organizationId: request.tenant.organizationId,
            userId: request.params.id,
          },
        },
      })
      if (!membership) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado nesta Rede.',
        })
      }
      if (await isLastActiveAdmin(request.tenant.organizationId, request.params.id)) {
        return lastAdminError(reply)
      }

      await prisma.$transaction([
        prisma.churchUser.deleteMany({
          where: {
            userId: request.params.id,
            church: { organizationId: request.tenant.organizationId },
          },
        }),
        prisma.organizationUser.delete({ where: { id: membership.id } }),
        prisma.user.update({
          where: { id: request.params.id },
          data: { sessionVersion: { increment: 1 } },
        }),
      ])
      return reply.status(204).send()
    },
  )
}
