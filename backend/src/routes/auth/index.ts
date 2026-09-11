import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { invites } from './invites.js'
import { login } from './login.js'
import { logout } from './logout.js'
import { organization } from './organization.js'
import { password } from './password.js'
import { profile } from './profile.js'
import { setup } from './setup.js'
import { users } from './users.js'

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  await app.register(setup, { prefix: '/setup' })
  await app.register(invites, { prefix: '/invites' })
  await app.register(login, { prefix: '/login' })
  await app.register(logout, { prefix: '/logout' })
  await app.register(organization, { prefix: '/organization' })
  await app.register(profile, { prefix: '/profile' })
  await app.register(password, { prefix: '/password' })
  await app.register(users, { prefix: '/users' })
}
