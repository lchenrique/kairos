import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { requirePermission } from '../../lib/authorization.js'
import { prisma } from '../../lib/prisma.js'
import { errorResponseSchema, idSchema, noContentResponseSchema } from '../../schemas/shared.js'

export const remove: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/:id',
    {
      preHandler: [requirePermission('EVENTS_MANAGE')],
      schema: {
        tags: ['events'],
        description: 'Remove um evento',
        params: idSchema,
        response: {
          204: noContentResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const event = await prisma.event.findFirst({
        where: { id, churchId: { in: request.tenant.churchIds } },
        select: { id: true },
      })
      if (!event) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'EVENT_NOT_FOUND',
          message: 'Evento não encontrado',
        })
      }

      await prisma.event.delete({
        where: { id },
      })

      return reply.status(204).send()
    },
  )
}
