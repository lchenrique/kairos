import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { upload } from './upload'
import { remove } from './delete'

export const uploadRoutes: FastifyPluginAsyncZod = async (app) => {
  // Adiciona autenticação em todas as rotas
  app.addHook('onRequest', app.authenticate)

  await app.register(upload)
  await app.register(remove)
}
