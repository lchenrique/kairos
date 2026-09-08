import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { UserRoleEnum, errorResponseSchema, userResponseSchema } from '../../schemas/auth.js'

export const profile: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['auth'],
        description: 'Obtém o perfil do usuário autenticado',
        response: {
          200: userResponseSchema,
          401: errorResponseSchema,
          500: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request) => {
      const { sub: userId } = request.user

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return { ...user, role: UserRoleEnum.parse(request.user.role) }
    },
  )
}
