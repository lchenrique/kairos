import { createPublicKey, verify, type JsonWebKey } from 'node:crypto'

const baseUrl = process.env.AUTH_CENTRAL_URL || 'https://auth-central.codebycarlos.dev'
const productId = process.env.AUTH_CENTRAL_PRODUCT_ID || 'kairos'
const issuer = `${baseUrl}/v1/products/${productId}/auth`
const audience = process.env.AUTH_CENTRAL_AUDIENCE || productId

type Claims = { sub: string; email: string; name?: string; iss: string; aud: string | string[]; exp: number }
type Jwk = JsonWebKey & { kid?: string; alg?: string; use?: string }
let cachedKeys: { expiresAt: number; keys: Jwk[] } | undefined

function decodePart(value: string) {
  return Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64url')
}

async function getKeys() {
  if (cachedKeys && cachedKeys.expiresAt > Date.now()) return cachedKeys.keys
  const response = await fetch(`${issuer}/jwks`)
  if (!response.ok) throw new Error('AUTH_CENTRAL_JWKS_UNAVAILABLE')
  const body = (await response.json()) as { keys?: Jwk[] }
  if (!body.keys?.length) throw new Error('AUTH_CENTRAL_JWKS_INVALID')
  cachedKeys = { keys: body.keys, expiresAt: Date.now() + 5 * 60_000 }
  return body.keys
}

export async function verifyAuthCentralJwt(token: string): Promise<Claims> {
  const [encodedHeader, encodedPayload, encodedSignature, ...extra] = token.split('.')
  if (!encodedHeader || !encodedPayload || !encodedSignature || extra.length) throw new Error('INVALID_TOKEN')
  const header = JSON.parse(decodePart(encodedHeader).toString('utf8')) as { alg?: string; kid?: string }
  const claims = JSON.parse(decodePart(encodedPayload).toString('utf8')) as Claims
  if (header.alg !== 'RS256' || !header.kid) throw new Error('INVALID_TOKEN_ALGORITHM')
  if (claims.iss !== issuer || !(Array.isArray(claims.aud) ? claims.aud : [claims.aud]).includes(audience)) throw new Error('INVALID_TOKEN_CLAIMS')
  if (!Number.isFinite(claims.exp) || claims.exp <= Math.floor(Date.now() / 1000) || !claims.sub || !claims.email) throw new Error('EXPIRED_OR_INVALID_TOKEN')
  const jwk = (await getKeys()).find((key) => key.kid === header.kid && key.kty === 'RSA')
  if (!jwk || !verify('RSA-SHA256', Buffer.from(`${encodedHeader}.${encodedPayload}`), createPublicKey({ key: jwk, format: 'jwk' }), decodePart(encodedSignature))) throw new Error('INVALID_TOKEN_SIGNATURE')
  return claims
}
