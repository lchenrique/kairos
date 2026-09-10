import { createClerkClient, verifyToken } from '@clerk/backend'
import { env } from '../config/env.js'

export type ClerkClaims = {
  sub: string
  email?: string
  email_address?: string
  first_name?: string
  last_name?: string
  name?: string
}

export async function verifyClerkJwt(token: string): Promise<ClerkClaims> {
  if (!env.CLERK_SECRET_KEY && !env.CLERK_JWT_KEY) {
    throw new Error('CLERK_SERVER_KEY_MISSING')
  }

  const claims = await verifyToken(token, {
    secretKey: env.CLERK_SECRET_KEY,
    jwtKey: env.CLERK_JWT_KEY,
    authorizedParties: [env.FRONTEND_URL],
  })

  if (!claims.sub) throw new Error('CLERK_SUBJECT_MISSING')
  return claims as ClerkClaims
}

export async function resolveClerkIdentity(claims: ClerkClaims) {
  const email = claims.email || claims.email_address
  const name = claims.name || [claims.first_name, claims.last_name].filter(Boolean).join(' ')
  if (email) return { email, name }

  if (!env.CLERK_SECRET_KEY) throw new Error('CLERK_EMAIL_MISSING')
  const client = createClerkClient({ secretKey: env.CLERK_SECRET_KEY })
  const user = await client.users.getUser(claims.sub)
  return {
    email: user.primaryEmailAddress?.emailAddress || '',
    name: [user.firstName, user.lastName].filter(Boolean).join(' '),
  }
}
