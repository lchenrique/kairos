import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { Prisma } from '@prisma/client'
import {
  BILLING_PLANS,
  getOrganizationSubscription,
  hasActiveSubscription,
  isBillingPlanId,
} from '../../lib/billing.js'
import {
  AsaasConfigurationError,
  AsaasRequestError,
  createAsaasSubscriptionCheckout,
} from '../../lib/payments/asaas.js'
import { prisma } from '../../lib/prisma.js'
import { errorResponseSchema } from '../../schemas/auth.js'

const planSchema = z.enum(['ESSENTIAL', 'COMMUNITY'])

const publicPlanSchema = z.object({
  id: planSchema,
  name: z.string(),
  priceCents: z.number(),
  churchLimit: z.number().nullable(),
  description: z.string(),
  features: z.array(z.string()),
})

const accountStateSchema = z.object({
  stage: z.enum(['ACCOUNT_READY', 'CHECKOUT_PENDING', 'CREATE_CHURCH', 'ACTIVE']),
  organization: z.object({ id: z.string(), name: z.string() }).nullable(),
  subscription: z
    .object({
      plan: planSchema,
      status: z.enum(['PENDING', 'ACTIVE', 'PAST_DUE', 'CANCELED']),
      currentPeriodEnd: z.date().nullable(),
    })
    .nullable(),
  latestIntent: z
    .object({
      id: z.string(),
      plan: planSchema,
      status: z.string(),
      workspaceName: z.string().nullable(),
      checkoutUrl: z.string().url().nullable(),
      createdAt: z.date(),
    })
    .nullable(),
  plans: z.array(publicPlanSchema),
})

const checkoutIntentSchema = z.object({
  plan: planSchema,
  workspaceName: z.string().trim().min(3).max(120).optional(),
})

const firstChurchSchema = z.object({
  name: z.string().trim().min(3).max(120),
})

const billingIntentSchema = z.object({
  id: z.string(),
  plan: planSchema,
  status: z.string(),
  workspaceName: z.string().nullable(),
  checkoutUrl: z.string().url().nullable(),
  createdAt: z.date(),
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

function billingPlans(): z.infer<typeof publicPlanSchema>[] {
  return Object.values(BILLING_PLANS).map((plan) => ({
    ...plan,
    features: [...plan.features],
  }))
}

export const billingRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', app.authenticate)

  app.get(
    '/account-state',
    {
      schema: {
        tags: ['billing'],
        description: 'Retorna o estado de ativação da conta e os planos disponíveis.',
        response: { 200: accountStateSchema, 401: errorResponseSchema },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request) => {
      const organizationId = request.user.organizationId
      const [organization, latestIntent] = await Promise.all([
        organizationId
          ? prisma.organization.findUnique({
              where: { id: organizationId },
              select: {
                id: true,
                name: true,
                subscription: {
                  select: { plan: true, status: true, currentPeriodEnd: true },
                },
                _count: { select: { churches: true } },
              },
            })
          : null,
        prisma.billingIntent.findFirst({
          where: { userId: request.user.sub },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            plan: true,
            status: true,
            workspaceName: true,
            checkoutUrl: true,
            createdAt: true,
          },
        }),
      ])

      const subscription = organization?.subscription
      const activeSubscription = hasActiveSubscription(subscription?.status)
      const normalizedLatestIntent = latestIntent && isBillingPlanId(latestIntent.plan)
        ? { ...latestIntent, plan: latestIntent.plan }
        : null
      const stage: z.infer<typeof accountStateSchema>["stage"] = organization
        ? activeSubscription && organization._count.churches === 0
          ? 'CREATE_CHURCH'
          : 'ACTIVE'
        : normalizedLatestIntent?.status === 'PENDING'
          ? 'CHECKOUT_PENDING'
          : 'ACCOUNT_READY'

      return {
        stage,
        organization: organization ? { id: organization.id, name: organization.name } : null,
        subscription: subscription && isBillingPlanId(subscription.plan)
          ? {
              plan: subscription.plan,
              status: subscription.status as 'PENDING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED',
              currentPeriodEnd: subscription.currentPeriodEnd,
            }
          : null,
        latestIntent: normalizedLatestIntent,
        plans: billingPlans(),
      }
    },
  )

  app.post<{ Body: z.infer<typeof checkoutIntentSchema> }>(
    '/checkout-intents',
    {
      schema: {
        tags: ['billing'],
        description: 'Cria ou retoma o checkout hospedado da assinatura.',
        body: checkoutIntentSchema,
        response: {
          200: billingIntentSchema,
          201: billingIntentSchema,
          401: errorResponseSchema,
          409: errorResponseSchema,
          503: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      if (request.user.organizationId) {
        return reply.status(409).send({
          statusCode: 409,
          error: 'Conflict',
          code: 'ACCOUNT_ALREADY_ACTIVATED',
          message: 'Esta conta já possui uma organização em ativação ou ativa.',
        })
      }

      const openIntent = await prisma.billingIntent.findFirst({
        where: {
          userId: request.user.sub,
          status: 'PENDING',
          provider: 'asaas',
          checkoutUrl: { not: null },
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          plan: true,
          status: true,
          workspaceName: true,
          checkoutUrl: true,
          createdAt: true,
        },
      })
      const checkoutStillOpen = openIntent && Date.now() - openIntent.createdAt.getTime() < 24 * 60 * 60 * 1000
      if (openIntent && checkoutStillOpen && isBillingPlanId(openIntent.plan)) {
        return reply.status(200).send({ ...openIntent, plan: openIntent.plan })
      }
      if (openIntent) {
        await prisma.billingIntent.update({
          where: { id: openIntent.id },
          data: { status: 'CHECKOUT_EXPIRED' },
        })
      }

      const intent = await prisma.billingIntent.create({
        data: {
          userId: request.user.sub,
          plan: request.body.plan,
          workspaceName: request.body.workspaceName,
          status: 'CREATING_CHECKOUT',
        },
        select: { id: true, plan: true, status: true, workspaceName: true, createdAt: true },
      })

      try {
        const checkout = await createAsaasSubscriptionCheckout({
          intentId: intent.id,
          plan: request.body.plan,
          user: { name: request.user.name, email: request.user.email },
        })
        const createdIntent = await prisma.billingIntent.update({
          where: { id: intent.id },
          data: {
            status: 'PENDING',
            provider: checkout.provider,
            checkoutId: checkout.checkoutId,
            checkoutUrl: checkout.checkoutUrl,
          },
          select: {
            id: true,
            plan: true,
            status: true,
            workspaceName: true,
            checkoutUrl: true,
            createdAt: true,
          },
        })
        return reply.status(201).send(createdIntent)
      } catch (error) {
        await prisma.billingIntent.update({
          where: { id: intent.id },
          data: { status: 'CHECKOUT_FAILED', provider: 'asaas' },
        })
        request.log.error({ error, intentId: intent.id }, 'Não foi possível criar checkout Asaas')

        if (error instanceof AsaasConfigurationError) {
          return reply.status(503).send({
            statusCode: 503,
            error: 'Service Unavailable',
            code: 'BILLING_NOT_CONFIGURED',
            message: 'A cobrança ainda está sendo configurada. Tente novamente em breve.',
          })
        }

        return reply.status(503).send({
          statusCode: 503,
          error: 'Service Unavailable',
          code: 'CHECKOUT_UNAVAILABLE',
          message:
            error instanceof AsaasRequestError
              ? 'Não foi possível abrir o checkout agora. Tente novamente em instantes.'
              : 'Não foi possível abrir o checkout agora. Tente novamente em instantes.',
        })
      }
    },
  )

  app.post<{ Body: z.infer<typeof firstChurchSchema> }>(
    '/first-church',
    {
      schema: {
        tags: ['billing'],
        description: 'Cria a primeira igreja após a confirmação de uma assinatura ativa.',
        body: firstChurchSchema,
        response: {
          201: z.object({ id: z.string(), name: z.string(), slug: z.string() }),
          401: errorResponseSchema,
          402: errorResponseSchema,
          403: errorResponseSchema,
          409: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const organizationId = request.user.organizationId
      if (!organizationId || request.user.role !== 'ADMIN') {
        return reply.status(403).send({
          statusCode: 403,
          error: 'Forbidden',
          code: 'FIRST_CHURCH_ACCESS_DENIED',
          message: 'Somente a pessoa responsável pela organização pode criar a primeira igreja.',
        })
      }

      const subscription = await getOrganizationSubscription(organizationId)
      if (!hasActiveSubscription(subscription?.status)) {
        return reply.status(402).send({
          statusCode: 402,
          error: 'Payment Required',
          code: 'SUBSCRIPTION_REQUIRED',
          message: 'Confirme uma assinatura ativa antes de criar a primeira igreja.',
        })
      }

      const slug = slugify(request.body.name)
      if (!slug) {
        return reply.status(409).send({
          statusCode: 409,
          error: 'Conflict',
          code: 'INVALID_CHURCH_NAME',
          message: 'Informe um nome válido para a igreja.',
        })
      }

      try {
        const church = await prisma.$transaction(async (tx) => {
          const churchCount = await tx.church.count({ where: { organizationId } })
          if (churchCount > 0) throw new Error('FIRST_CHURCH_ALREADY_EXISTS')

          const created = await tx.church.create({
            data: {
              organizationId,
              name: request.body.name,
              slug,
              isHeadquarters: true,
            },
            select: { id: true, name: true, slug: true },
          })
          await tx.churchUser.create({
            data: { churchId: created.id, userId: request.user.sub, role: 'ADMIN' },
          })
          await tx.organizationUser.update({
            where: { organizationId_userId: { organizationId, userId: request.user.sub } },
            data: { defaultChurchId: created.id },
          })
          return created
        })
        return reply.status(201).send(church)
      } catch (error) {
        if (
          error instanceof Error && error.message === 'FIRST_CHURCH_ALREADY_EXISTS'
        ) {
          return reply.status(409).send({
            statusCode: 409,
            error: 'Conflict',
            code: 'FIRST_CHURCH_ALREADY_EXISTS',
            message: 'Esta organização já possui uma igreja cadastrada.',
          })
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          return reply.status(409).send({
            statusCode: 409,
            error: 'Conflict',
            code: 'CHURCH_SLUG_EXISTS',
            message: 'Já existe uma igreja com este nome na organização.',
          })
        }
        throw error
      }
    },
  )
}
