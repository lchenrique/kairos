import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { errorResponseSchema, userResponseSchema } from '../../schemas/auth'
import { z } from 'zod'

export const profile: FastifyPluginAsyncZod = async (app) => {
  app.get('/', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['auth'],
      description: 'Obtém o perfil do usuário autenticado',
      response: {
        200: userResponseSchema,
        401: errorResponseSchema,
        500: errorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request) => {
    const { sub: userId } = request.user

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return user
  })
}
