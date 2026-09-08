import { Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma.js'
import { setSessionCookie } from '../../lib/session-cookie.js'
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

async function setupIsAvailable() {
  const [organizations, users] = await prisma.$transaction([
    prisma.organization.count(),
    prisma.user.count(),
  ])

  return organizations === 0 && users === 0
}

export const setup: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/status',
    {
      schema: {
        tags: ['auth'],
        description: 'Informa se a configuração inicial está disponível',
        response: { 200: setupStatusSchema },
      },
    },
    async () => ({ available: await setupIsAvailable() }),
  )

  app.post(
    '/',
    {
      schema: {
        tags: ['auth'],
        description: 'Cria a primeira Rede, igreja sede e conta administradora',
        body: initialSetupSchema,
        response: {
          201: authResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const input = request.body as InitialSetupInput

      if (!(await setupIsAvailable())) {
        return reply.status(409).send({
          statusCode: 409,
          error: 'Conflict',
          code: 'SETUP_ALREADY_COMPLETED',
          message: 'A configuração inicial já foi concluída. Entre com uma conta existente.',
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

      const hashedPassword = await bcrypt.hash(input.password, 10)

      try {
        const created = await prisma.$transaction(async (tx) => {
          const existingOrganization = await tx.organization.count()
          const existingUser = await tx.user.count()
          if (existingOrganization > 0 || existingUser > 0) {
            throw new Error('SETUP_ALREADY_COMPLETED')
          }

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
              name: input.adminName,
              email: input.email,
              password: hashedPassword,
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

        const token = await app.jwt.sign({
          sub: created.user.id,
          name: created.user.name,
          email: created.user.email,
          role: 'ADMIN',
          organizationId: created.organization.id,
          sessionVersion: created.user.sessionVersion,
        })
        setSessionCookie(reply, token)

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
          (error instanceof Error && error.message === 'SETUP_ALREADY_COMPLETED') ||
          (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
        ) {
          return reply.status(409).send({
            statusCode: 409,
            error: 'Conflict',
            code: 'SETUP_ALREADY_COMPLETED',
            message: 'A configuração inicial já foi concluída. Entre com uma conta existente.',
          })
        }
        throw error
      }
    },
  )
}
