import { Prisma } from '@prisma/client'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { requirePermission } from '../../lib/authorization.js'
import {
  BILLING_PLANS,
  getOrganizationSubscription,
  hasActiveSubscription,
} from '../../lib/billing.js'
import { prisma } from '../../lib/prisma.js'
import { errorResponseSchema } from '../../schemas/shared.js'

const churchSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  isHeadquarters: z.boolean(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  address: z.string().nullable(),
  timezone: z.string().nullable(),
})

const createChurchSchema = z.object({
  name: z.string().trim().min(3).max(120),
  slug: z.string().trim().min(2).max(80).optional(),
  address: z.string().trim().max(240).optional(),
  phone: z.string().trim().max(30).optional(),
  email: z.string().email().optional(),
  timezone: z.string().trim().min(3).default('America/Sao_Paulo'),
})

const tenantContextSchema = z.object({
  organization: z.object({ id: z.string(), name: z.string() }),
  churches: z.array(churchSummarySchema),
  selectedChurchId: z.string().nullable(),
  allChurches: z.boolean(),
})

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const churches: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/context',
    {
      schema: {
        tags: ['system'],
        description: 'Retorna a Rede, as unidades acessíveis e a seleção ativa',
        response: { 200: tenantContextSchema, 401: errorResponseSchema, 403: errorResponseSchema },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request) => {
      const churches = await prisma.church.findMany({
        where: { id: { in: request.tenant.accessibleChurchIds } },
        select: {
          id: true,
          name: true,
          slug: true,
          isHeadquarters: true,
          status: true,
          address: true,
          timezone: true,
        },
        orderBy: [{ isHeadquarters: 'desc' }, { name: 'asc' }],
      })
      return {
        organization: {
          id: request.tenant.organizationId,
          name: request.tenant.organizationName,
        },
        churches: churches.map((church) => ({
          ...church,
          status: church.status === 'INACTIVE' ? ('INACTIVE' as const) : ('ACTIVE' as const),
        })),
        selectedChurchId: request.tenant.churchId,
        allChurches: request.tenant.allChurches,
      }
    },
  )

  app.post<{ Body: z.infer<typeof createChurchSchema> }>(
    '/churches',
    {
      preHandler: [requirePermission('NETWORK_MANAGE')],
      schema: {
        tags: ['system'],
        description: 'Adiciona uma igreja ou unidade à Rede atual',
        body: createChurchSchema,
        response: {
          201: churchSummarySchema,
          400: errorResponseSchema,
          401: errorResponseSchema,
          402: errorResponseSchema,
          403: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const subscription = await getOrganizationSubscription(request.tenant.organizationId)
      if (!hasActiveSubscription(subscription?.status, subscription?.trialEndsAt)) {
        return reply.status(402).send({
          statusCode: 402,
          error: 'Payment Required',
          code: 'SUBSCRIPTION_REQUIRED',
          message:
            'Inicie um teste ou ative uma assinatura para adicionar uma nova igreja ou unidade.',
        })
      }

      const plan =
        subscription && subscription.plan in BILLING_PLANS
          ? BILLING_PLANS[subscription.plan as keyof typeof BILLING_PLANS]
          : null
      if (plan?.churchLimit) {
        const churchCount = await prisma.church.count({
          where: { organizationId: request.tenant.organizationId },
        })
        if (churchCount >= plan.churchLimit) {
          return reply.status(402).send({
            statusCode: 402,
            error: 'Payment Required',
            code: 'PLAN_CHURCH_LIMIT_REACHED',
            message:
              'O plano Essencial inclui uma igreja. Assine o Comunidade para adicionar unidades.',
          })
        }
      }

      const baseSlug = slugify(request.body.slug || request.body.name)
      if (!baseSlug) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          code: 'INVALID_CHURCH_SLUG',
          message: 'Informe um nome válido para a unidade.',
        })
      }

      try {
        const church = await prisma.church.create({
          data: {
            organizationId: request.tenant.organizationId,
            name: request.body.name,
            slug: baseSlug,
            address: request.body.address,
            phone: request.body.phone,
            email: request.body.email,
            timezone: request.body.timezone,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            isHeadquarters: true,
            status: true,
            address: true,
            timezone: true,
          },
        })
        return reply.status(201).send({ ...church, status: 'ACTIVE' })
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          return reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            code: 'CHURCH_SLUG_EXISTS',
            message: 'Já existe uma unidade com esse identificador nesta Rede.',
          })
        }
        throw error
      }
    },
  )
}
