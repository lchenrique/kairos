import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { register } from './register'
import { login } from './login'
import { profile } from './profile'
import { password } from './password'

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  await app.register(register, { prefix: '/register' })
  await app.register(login, { prefix: '/login' })
  await app.register(profile, { prefix: '/profile' })
  await app.register(password, { prefix: '/password' })
}
