import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { info } from './info'
import { church } from './church'

export const systemRoutes: FastifyPluginAsyncZod = async (app) => {
  // Adiciona autenticação em todas as rotas
  app.addHook('onRequest', app.authenticate)

  await app.register(info, { prefix: '/info' })
  await app.register(church, { prefix: '/church' })
}
