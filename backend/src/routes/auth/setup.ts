import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { errorResponseSchema, initialSetupSchema, setupStatusSchema } from '../../schemas/auth.js'

// This endpoint used to create a network and headquarters during sign-up.
// Identity now belongs exclusively to Clerk and tenant creation only
// happens after a paid activation, so the old flow remains deliberately closed.
export const setup: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/status',
    {
      schema: {
        tags: ['auth'],
        description: 'Informa que o cadastro de tenant foi substituído pela ativação no painel.',
        response: { 200: setupStatusSchema },
      },
    },
    async () => ({ available: false }),
  )

  app.post(
    '/',
    {
      schema: {
        tags: ['auth'],
        description: 'Desativado: a conta é criada no Clerk e a igreja é criada após a assinatura.',
        body: initialSetupSchema,
        response: { 410: errorResponseSchema },
      },
    },
    async (_request, reply) =>
      reply.status(410).send({
        statusCode: 410,
        error: 'Gone',
        code: 'TENANT_SETUP_REPLACED',
        message: 'Crie sua conta pelo Clerk e escolha um plano dentro do Kairos para adicionar uma igreja.',
      }),
  )
}
