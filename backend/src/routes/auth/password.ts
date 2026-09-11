import type { FastifyReply } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { errorResponseSchema } from '../../schemas/auth.js'

const resetRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
})

const resetSchema = z.object({
  token: z.string().min(32).max(128),
  password: z.string().min(8),
})

function clerkRequired(reply: FastifyReply) {
  return reply.status(410).send({
    statusCode: 410,
    error: 'Gone',
    code: 'CLERK_REQUIRED',
    message: 'Gerencie senhas no Clerk.',
  })
}

export const password: FastifyPluginAsyncZod = async (app) => {
  app.put(
    '/change',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['auth'],
        description: 'Altera a senha do usuário autenticado',
        body: z.object({
          currentPassword: z.string().min(6),
          newPassword: z.string().min(8),
        }),
        response: { 204: z.null(), 401: errorResponseSchema },
        security: [{ bearerAuth: [] }],
      },
    },
    async (_request, reply) => clerkRequired(reply),
  )

  app.post(
    '/reset-request',
    {
      schema: {
        tags: ['auth'],
        description: 'Solicita uma redefinição de senha sem revelar se a conta existe',
        body: resetRequestSchema,
        response: { 204: z.null() },
      },
    },
    async (_request, reply) => clerkRequired(reply),
  )

  app.post(
    '/reset',
    {
      schema: {
        tags: ['auth'],
        description: 'Redefine a senha com um token de uso único e expirável',
        body: resetSchema,
        response: { 204: z.null(), 400: errorResponseSchema },
      },
    },
    async (_request, reply) => clerkRequired(reply),
  )
}
