import type { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from './prisma.js'

export const BILLING_PLANS = {
  ESSENTIAL: {
    id: 'ESSENTIAL',
    name: 'Essencial',
    priceCents: 4900,
    churchLimit: 1,
    description: 'Para uma igreja que quer organizar a rotina com clareza.',
    features: ['1 igreja', 'Membros, grupos e eventos', 'Presença e calendário', 'Equipe com permissões'],
  },
  COMMUNITY: {
    id: 'COMMUNITY',
    name: 'Comunidade',
    priceCents: 9900,
    churchLimit: null,
    description: 'Para redes, sedes e congregações que crescem juntas.',
    features: ['Igrejas e unidades ilimitadas', 'Visão consolidada da rede', 'Relatórios e financeiro', 'Equipe e permissões por unidade'],
  },
} as const

export type BillingPlanId = keyof typeof BILLING_PLANS

export const SUBSCRIPTION_STATUSES = ['PENDING', 'ACTIVE', 'PAST_DUE', 'CANCELED'] as const
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number]

export function isBillingPlanId(value: string): value is BillingPlanId {
  return value in BILLING_PLANS
}

export function hasActiveSubscription(status: string | null | undefined) {
  return status === 'ACTIVE'
}

export async function getOrganizationSubscription(organizationId: string) {
  return prisma.subscription.findUnique({ where: { organizationId } })
}

export async function requireActiveSubscription(request: FastifyRequest, reply: FastifyReply) {
  const organizationId = request.user.organizationId
  if (!organizationId) {
    reply.status(403).send({
      statusCode: 403,
      error: 'Forbidden',
      code: 'ORGANIZATION_REQUIRED',
      message: 'Crie ou selecione uma organização antes de continuar.',
    })
    return null
  }

  const subscription = await getOrganizationSubscription(organizationId)
  if (!hasActiveSubscription(subscription?.status)) {
    reply.status(402).send({
      statusCode: 402,
      error: 'Payment Required',
      code: 'SUBSCRIPTION_REQUIRED',
      message: 'Uma assinatura ativa é necessária para usar esta ação.',
    })
    return null
  }

  return subscription
}

export async function requireActiveSubscriptionForMutation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) return
  const subscription = await requireActiveSubscription(request, reply)
  if (!subscription) return reply
}
