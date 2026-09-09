import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { church } from './church.js'
import { churches } from './churches.js'
import { info } from './info.js'
import { requireActiveSubscriptionForMutation } from '../../lib/billing.js'

export const systemRoutes: FastifyPluginAsyncZod = async (app) => {
  // Adiciona autenticação em todas as rotas
  app.addHook('onRequest', app.authenticate)
  app.addHook('preHandler', app.loadTenant)
  app.addHook('preHandler', requireActiveSubscriptionForMutation)

  await app.register(info, { prefix: '/info' })
  await app.register(church, { prefix: '/church' })
  await app.register(churches)
}
