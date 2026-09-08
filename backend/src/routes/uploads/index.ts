import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { remove } from './delete.js'
import { upload } from './upload.js'

export const uploadRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', app.authenticate)
  app.addHook('preHandler', app.loadTenant)

  await app.register(upload)
  await app.register(remove)
}
