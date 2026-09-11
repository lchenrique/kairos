import { env } from '../../config/env.js'
import { BILLING_PLANS, type BillingPlanId } from '../billing.js'

const ASAAS_PROVIDER = 'asaas'

type AsaasCheckoutResponse = {
  id?: string
  errors?: Array<{ description?: string }>
}

export type AsaasPayment = {
  id: string
  externalReference?: string | null
  subscription?: string | null
  customer?: string | null
  status?: string | null
}

type AsaasSubscription = {
  id: string
  customer?: string | null
  externalReference?: string | null
  dateCreated?: string | null
}

type AsaasListResponse<T> = {
  data?: T[]
}

export class AsaasConfigurationError extends Error {
  constructor() {
    super('A cobrança ainda não foi configurada.')
  }
}

export class AsaasRequestError extends Error {}

function asaasUrl(pathname: string) {
  return `${env.ASAAS_API_URL.replace(/\/$/, '')}${pathname}`
}

function assertConfigured() {
  if (!env.ASAAS_API_KEY) throw new AsaasConfigurationError()
}

async function asaasRequest<T>(pathname: string, init: RequestInit): Promise<T> {
  assertConfigured()

  const response = await fetch(asaasUrl(pathname), {
    ...init,
    headers: {
      access_token: env.ASAAS_API_KEY as string,
      'content-type': 'application/json',
      ...init.headers,
    },
  })
  const body = (await response.json().catch(() => null)) as T | AsaasCheckoutResponse | null

  if (!response.ok) {
    const details = body as AsaasCheckoutResponse | null
    const message =
      details?.errors?.[0]?.description || 'Não foi possível iniciar a cobrança no Asaas.'
    throw new AsaasRequestError(message)
  }

  return body as T
}

function nextDueDate() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${byType.year}-${byType.month}-${byType.day}`
}

export function isAsaasWebhookToken(token: string | undefined) {
  return Boolean(env.ASAAS_WEBHOOK_TOKEN && token === env.ASAAS_WEBHOOK_TOKEN)
}

export async function createAsaasSubscriptionCheckout(input: {
  intentId: string
  plan: BillingPlanId
  user: { name: string; email: string }
}) {
  const plan = BILLING_PLANS[input.plan]
  const response = await asaasRequest<AsaasCheckoutResponse>('/checkouts', {
    method: 'POST',
    body: JSON.stringify({
      billingTypes: ['CREDIT_CARD'],
      chargeTypes: ['RECURRENT'],
      minutesToExpire: 1440,
      externalReference: input.intentId,
      callback: {
        successUrl: `${env.FRONTEND_URL}/onboarding?payment=processing`,
        cancelUrl: `${env.FRONTEND_URL}/onboarding?payment=cancelled`,
        expiredUrl: `${env.FRONTEND_URL}/onboarding?payment=expired`,
      },
      items: [
        {
          name: `Kairos ${plan.name}`,
          description: `${plan.name} — assinatura mensal do Kairos`,
          quantity: 1,
          value: plan.priceCents / 100,
        },
      ],
      customerData: {
        name: input.user.name,
        email: input.user.email,
      },
      subscription: {
        cycle: 'MONTHLY',
        nextDueDate: nextDueDate(),
      },
    }),
  })
  if (!response.id) {
    throw new AsaasRequestError('O Asaas não retornou um checkout válido.')
  }

  // The Checkout API returns an id. The customer-facing URL is the stable
  // hosted URL prescribed by Asaas, not an API response field.
  const checkoutUrl = `https://asaas.com/checkoutSession/show?id=${encodeURIComponent(response.id)}`

  return { provider: ASAAS_PROVIDER, checkoutId: response.id, checkoutUrl }
}

export async function getAsaasPayment(paymentId: string) {
  return asaasRequest<AsaasPayment>(`/payments/${encodeURIComponent(paymentId)}`, { method: 'GET' })
}

export async function cancelAsaasSubscription(subscriptionId: string): Promise<void> {
  try {
    await asaasRequest<{ deleted?: boolean; id?: string }>(
      `/subscriptions/${encodeURIComponent(subscriptionId)}`,
      { method: 'DELETE' },
    )
  } catch (error) {
    // Remoção idempotente: 404 significa que a recorrência já não existe no Asaas.
    if (error instanceof AsaasRequestError && /not found|não encontrado|404/i.test(error.message)) {
      return
    }
    throw error
  }
}

export async function getLatestAsaasSubscriptionForCustomer(customerId: string) {
  const response = await asaasRequest<AsaasListResponse<AsaasSubscription>>(
    `/subscriptions?customer=${encodeURIComponent(customerId)}`,
    { method: 'GET' },
  )
  return response.data?.[0] || null
}

export { ASAAS_PROVIDER }
