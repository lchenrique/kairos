import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { errorResponseSchema, loginSchema } from '../../schemas/auth.js'

export const login: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      schema: {
        tags: ['auth'],
        description: 'Desativado: a autenticação é feita pelo Clerk.',
        body: loginSchema,
        response: { 410: errorResponseSchema },
      },
    },
    async (_request, reply) =>
      reply.status(410).send({
        statusCode: 410,
        error: 'Gone',
        code: 'CLERK_REQUIRED',
        message: 'Use o Clerk para entrar.',
      }),
  )
}
