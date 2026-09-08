import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { memberSchema } from '../../schemas/members.js'

export const get: FastifyPluginAsyncZod = async (app) => {
  app.get<{
    Params: { id: string }
  }>(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['members'],
        description: 'Busca um membro pelo ID',
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: memberSchema,
          404: z.object({
            statusCode: z.number(),
            error: z.string(),
            message: z.string(),
          }),
          500: z.object({
            statusCode: z.number(),
            error: z.string(),
            message: z.string(),
          }),
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const member = await prisma.member.findFirst({
        where: { id, churchId: { in: request.tenant.churchIds } },
        include: {
          groups: {
            include: {
              group: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })

      if (!member) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Membro não encontrado',
        })
      }

      return member
    },
  )
}
