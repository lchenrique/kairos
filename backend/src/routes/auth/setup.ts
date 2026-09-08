import { Prisma } from '@prisma/client'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { verifyAuthCentralJwt } from '../../lib/auth-central.js'
import { prisma } from '../../lib/prisma.js'
import {
  type InitialSetupInput,
  UserRoleEnum,
  authResponseSchema,
  errorResponseSchema,
  initialSetupSchema,
  setupStatusSchema,
} from '../../schemas/auth.js'

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const setup: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/status',
    {
      schema: {
        tags: ['auth'],
        description: 'Informa se o cadastro de uma nova Rede está disponível',
        response: { 200: setupStatusSchema },
      },
    },
    async () => ({ available: true }),
  )

  app.post(
    '/',
    {
      schema: {
        tags: ['auth'],
        description: 'Cria uma Rede, igreja sede e conta administradora',
        body: initialSetupSchema,
        response: {
          201: authResponseSchema,
          401: errorResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const input = request.body as InitialSetupInput

      const authorization = request.headers.authorization
      const bearerToken = authorization?.startsWith('Bearer ')
        ? authorization.slice('Bearer '.length).trim()
        : ''
      let claims: Awaited<ReturnType<typeof verifyAuthCentralJwt>>
      try {
        if (!bearerToken) throw new Error('MISSING_BEARER_TOKEN')
        claims = await verifyAuthCentralJwt(bearerToken)
      } catch (_error) {
        return reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          code: 'AUTH_CENTRAL_SESSION_REQUIRED',
          message: 'Crie ou acesse sua conta pelo Auth Central antes de configurar o Kairos.',
        })
      }

      const adminEmail = claims.email.trim().toLowerCase()
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { authCentralSubject: claims.sub },
            { email: adminEmail },
          ],
        },
        select: { id: true },
      })
      if (existingUser) {
        return reply.status(409).send({
          statusCode: 409,
          error: 'Conflict',
          code: 'ACCOUNT_ALREADY_REGISTERED',
          message: 'Esta conta já possui um cadastro no Kairos. Entre com sua conta existente.',
        })
      }

      const organizationSlug = slugify(input.organizationName)
      const churchSlug = slugify(input.churchName)
      if (!organizationSlug || !churchSlug) {
        return reply.status(409).send({
          statusCode: 409,
          error: 'Conflict',
          code: 'INVALID_SETUP_NAME',
          message: 'Informe nomes válidos para a Rede e a igreja sede.',
        })
      }

      try {
        const created = await prisma.$transaction(async (tx) => {
          const organization = await tx.organization.create({
            data: { name: input.organizationName, slug: organizationSlug },
          })
          const church = await tx.church.create({
            data: {
              organizationId: organization.id,
              name: input.churchName,
              slug: churchSlug,
              isHeadquarters: true,
              address: input.address,
              phone: input.phone,
              timezone: input.timezone,
            },
          })
          const user = await tx.user.create({
            data: {
              authCentralSubject: claims.sub,
              name: claims.name?.trim() || input.adminName,
              email: adminEmail,
              // The password is owned by Auth Central. This legacy column is
              // intentionally unusable for local authentication.
              password: 'AUTH_CENTRAL_MANAGED',
              role: 'ADMIN',
            },
          })
          await tx.organizationUser.create({
            data: {
              organizationId: organization.id,
              userId: user.id,
              role: 'ADMIN',
              defaultChurchId: church.id,
            },
          })
          await tx.churchUser.create({
            data: { churchId: church.id, userId: user.id, role: 'ADMIN' },
          })

          return { organization, user }
        })

        return reply.status(201).send({
          user: {
            id: created.user.id,
            name: created.user.name,
            email: created.user.email,
            role: UserRoleEnum.parse(created.user.role),
            createdAt: created.user.createdAt,
            updatedAt: created.user.updatedAt,
          },
        })
      } catch (error) {
        if (
          (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
        ) {
          return reply.status(409).send({
            statusCode: 409,
            error: 'Conflict',
            code: 'ACCOUNT_ALREADY_REGISTERED',
            message: 'Esta conta já possui um cadastro no Kairos. Entre com sua conta existente.',
          })
        }
        throw error
      }
    },
  )
}
