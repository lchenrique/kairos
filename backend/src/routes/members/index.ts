import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { requirePermission } from '../../lib/authorization.js'
import { requireActiveSubscriptionForMutation } from '../../lib/billing.js'
import { create } from './create.js'
import { remove } from './delete.js'
import { get } from './get.js'
import { list } from './list.js'
import { participation } from './participation.js'
import { update } from './update.js'

export const memberRoutes: FastifyPluginAsyncZod = async (app) => {
  // Adiciona autenticação em todas as rotas
  app.addHook('onRequest', app.authenticate)
  app.addHook('preHandler', app.loadTenant)
  app.addHook('preHandler', requirePermission('MEMBERS_VIEW'))
  app.addHook('preHandler', requireActiveSubscriptionForMutation)

  // Registra todas as rotas
  await app.register(list)
  await app.register(get)
  await app.register(create)
  await app.register(update)
  await app.register(participation)
  await app.register(remove)
}
