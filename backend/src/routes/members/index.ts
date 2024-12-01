import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { list } from './list'
import { get } from './get'
import { create } from './create'
import { update } from './update'
import { remove } from './delete'

export const memberRoutes: FastifyPluginAsyncZod = async (app) => {
  // Adiciona autenticação em todas as rotas
  app.addHook('onRequest', app.authenticate)

  // Registra todas as rotas
  await app.register(list)
  await app.register(get)
  await app.register(create)
  await app.register(update)
  await app.register(remove)
}