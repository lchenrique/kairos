import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { errorResponseSchema } from '../../schemas/auth.js'

export const logout: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['auth'],
        description: 'Confirma logout local; a sessão do Clerk é encerrada pelo cliente',
        response: { 204: z.null(), 401: errorResponseSchema },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      return reply.status(204).send()
    },
  )
}
