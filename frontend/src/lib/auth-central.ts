const baseUrl = process.env.NEXT_PUBLIC_AUTH_CENTRAL_URL || 'https://auth-central.codebycarlos.dev'
const productId = process.env.NEXT_PUBLIC_AUTH_CENTRAL_PRODUCT_ID || 'kairos'
const authUrl = `${baseUrl}/v1/products/${productId}/auth`

type AuthResponse = { token?: string; accessToken?: string; jwt?: string }
let sessionToken: string | null = null
let jwt: string | null = null

async function readError(response: Response) {
  const body = await response.json().catch(() => ({})) as { message?: string; code?: string }
  return new Error(body.message || body.code || `AUTH_CENTRAL_${response.status}`)
}

export function getAccessToken() { return jwt }

export async function signInWithEmail(email: string, password: string) {
  const response = await fetch(`${authUrl}/sign-in/email`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
  if (!response.ok) throw await readError(response)
  sessionToken = response.headers.get('set-auth-token')
  if (!sessionToken) throw new Error('AUTH_CENTRAL_SESSION_TOKEN_MISSING')
  const tokenResponse = await fetch(`${authUrl}/token`, { headers: { Authorization: `Bearer ${sessionToken}` } })
  if (!tokenResponse.ok) throw await readError(tokenResponse)
  const token = await tokenResponse.json() as AuthResponse
  jwt = token.token || token.accessToken || token.jwt || null
  if (!jwt) throw new Error('AUTH_CENTRAL_JWT_MISSING')
  return jwt
}

export async function signUpWithEmail(name: string, email: string, password: string) {
  const response = await fetch(`${authUrl}/sign-up/email`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
  if (!response.ok) throw await readError(response)
  return response.json()
}

export async function signOutFromAuthCentral() {
  try {
    if (sessionToken) await fetch(`${authUrl}/sign-out`, { method: 'POST', headers: { Authorization: `Bearer ${sessionToken}` } })
  } finally { sessionToken = null; jwt = null }
}
