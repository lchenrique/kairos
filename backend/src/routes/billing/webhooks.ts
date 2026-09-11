import { Prisma } from '@prisma/client'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { isBillingPlanId } from '../../lib/billing.js'
import {
  ASAAS_PROVIDER,
  getAsaasPayment,
  getLatestAsaasSubscriptionForCustomer,
  isAsaasWebhookToken,
} from '../../lib/payments/asaas.js'
import { prisma } from '../../lib/prisma.js'
import { errorResponseSchema } from '../../schemas/auth.js'

const asaasEntitySchema = z
  .object({
    id: z.string(),
    externalReference: z.string().nullable().optional(),
    subscription: z.string().nullable().optional(),
    customer: z.string().nullable().optional(),
  })
  .passthrough()

const asaasWebhookSchema = z
  .object({
    id: z.string().min(1),
    event: z.string().min(1),
    payment: asaasEntitySchema.optional(),
    subscription: asaasEntitySchema.optional(),
    checkout: asaasEntitySchema.optional(),
  })
  .passthrough()

const webhookResponseSchema = z.object({ received: z.literal(true) })

const paidEvents = new Set(['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED'])
const pastDueEvents = new Set([
  'PAYMENT_OVERDUE',
  'PAYMENT_CREDIT_CARD_CAPTURE_REFUSED',
  'PAYMENT_REFUNDED',
  'PAYMENT_CHARGEBACK_REQUESTED',
])
const canceledEvents = new Set(['SUBSCRIPTION_INACTIVATED', 'SUBSCRIPTION_DELETED'])

function organizationSlug(name: string, intentId: string) {
  const readable = name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${readable || 'comunidade'}-${intentId.slice(-7).toLowerCase()}`
}

async function enrichWebhook(payload: z.infer<typeof asaasWebhookSchema>) {
  const payment = payload.payment
  const subscription = payload.subscription
  const checkout = payload.checkout
  let externalReference =
    subscription?.externalReference || payment?.externalReference || checkout?.externalReference || null
  let providerSubscriptionId = subscription?.id || payment?.subscription || null
  let providerCustomerId = subscription?.customer || payment?.customer || checkout?.customer || null

  if (!externalReference && payment?.id) {
    const remotePayment = await getAsaasPayment(payment.id)
    externalReference = remotePayment.externalReference || null
    providerSubscriptionId ||= remotePayment.subscription || null
    providerCustomerId ||= remotePayment.customer || null
  }

  if (!providerSubscriptionId && payload.event === 'CHECKOUT_PAID' && providerCustomerId) {
    const remoteSubscription = await getLatestAsaasSubscriptionForCustomer(providerCustomerId)
    providerSubscriptionId = remoteSubscription?.id || null
    externalReference ||= remoteSubscription?.externalReference || null
  }

  return {
    checkoutId: checkout?.id || null,
    externalReference,
    providerSubscriptionId,
    providerCustomerId,
  }
}

export const billingWebhookRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post<{ Body: z.infer<typeof asaasWebhookSchema> }>(
    '/webhooks/asaas',
    {
      schema: {
        tags: ['billing'],
        description: 'Recebe eventos de cobrança enviados pelo Asaas.',
        body: asaasWebhookSchema,
        response: { 200: webhookResponseSchema, 400: errorResponseSchema, 401: errorResponseSchema },
      },
    },
    async (request, reply) => {
      const webhookToken = request.headers['asaas-access-token']
      if (typeof webhookToken !== 'string' || !isAsaasWebhookToken(webhookToken)) {
        return reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          code: 'INVALID_WEBHOOK_TOKEN',
          message: 'Webhook não autorizado.',
        })
      }

      const parsed = asaasWebhookSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          code: 'INVALID_WEBHOOK_PAYLOAD',
          message: 'Evento de cobrança inválido.',
        })
      }

      let providerData: Awaited<ReturnType<typeof enrichWebhook>>
      try {
        providerData = await enrichWebhook(parsed.data)
      } catch (error) {
        request.log.error({ error, eventId: parsed.data.id }, 'Não foi possível reconciliar evento Asaas')
        throw error
      }

      try {
        await prisma.$transaction(async (tx) => {
          const intent = providerData.externalReference
            ? await tx.billingIntent.findUnique({ where: { id: providerData.externalReference } })
            : providerData.providerSubscriptionId
              ? await tx.billingIntent.findUnique({
                  where: { providerSubscriptionId: providerData.providerSubscriptionId },
                })
              : providerData.checkoutId
                ? await tx.billingIntent.findUnique({ where: { checkoutId: providerData.checkoutId } })
                : null

          await tx.paymentWebhookEvent.create({
            data: {
              provider: ASAAS_PROVIDER,
              providerEventId: parsed.data.id,
              event: parsed.data.event,
              payload: JSON.stringify(parsed.data),
              userId: intent?.userId,
            },
          })

          if (intent && providerData.providerSubscriptionId && !intent.providerSubscriptionId) {
            await tx.billingIntent.update({
              where: { id: intent.id },
              data: { providerSubscriptionId: providerData.providerSubscriptionId },
            })
          }

          if (paidEvents.has(parsed.data.event) && intent && isBillingPlanId(intent.plan)) {
            const membership = await tx.organizationUser.findFirst({
              where: { userId: intent.userId, status: 'ACTIVE' },
              orderBy: { createdAt: 'asc' },
              select: { organizationId: true },
            })
            const organizationId = membership?.organizationId || (
              await tx.organization.create({
                data: {
                  name: intent.workspaceName || 'Minha comunidade',
                  slug: organizationSlug(intent.workspaceName || 'Minha comunidade', intent.id),
                  users: { create: { userId: intent.userId, role: 'ADMIN', status: 'ACTIVE' } },
                },
                select: { id: true },
              })
            ).id

            await tx.subscription.upsert({
              where: { organizationId },
              create: {
                organizationId,
                plan: intent.plan,
                status: 'ACTIVE',
                provider: ASAAS_PROVIDER,
                providerCustomerId: providerData.providerCustomerId,
                providerSubscriptionId: providerData.providerSubscriptionId,
                trialEndsAt: null,
              },
              update: {
                plan: intent.plan,
                status: 'ACTIVE',
                provider: ASAAS_PROVIDER,
                providerCustomerId: providerData.providerCustomerId,
                providerSubscriptionId: providerData.providerSubscriptionId,
                trialEndsAt: null,
              },
            })
            await tx.billingIntent.update({ where: { id: intent.id }, data: { status: 'PAID' } })
            return
          }

          const providerSubscriptionId = providerData.providerSubscriptionId
          if (!providerSubscriptionId) return

          if (canceledEvents.has(parsed.data.event)) {
            await tx.subscription.updateMany({
              where: { provider: ASAAS_PROVIDER, providerSubscriptionId },
              data: { status: 'CANCELED' },
            })
          } else if (pastDueEvents.has(parsed.data.event)) {
            await tx.subscription.updateMany({
              where: { provider: ASAAS_PROVIDER, providerSubscriptionId },
              data: { status: 'PAST_DUE' },
            })
          }
        })
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          return { received: true as const }
        }
        throw error
      }

      return { received: true as const }
    },
  )
}
