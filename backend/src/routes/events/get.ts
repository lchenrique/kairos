import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { hasPermission } from '../../lib/authorization.js'
import { prisma } from '../../lib/prisma.js'
import { eventSchema, parseEventResponse } from '../../schemas/events.js'
import { errorResponseSchema, idSchema } from '../../schemas/shared.js'

export const get: FastifyPluginAsyncZod = async (app) => {
  app.get<{
    Params: { id: string }
  }>(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['events'],
        description: 'Obtém um evento por ID',
        params: idSchema,
        response: {
          200: eventSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const canViewParticipants = hasPermission(request.user.role, 'MEMBERS_VIEW')
      const { id } = request.params

      const event = await prisma.event.findFirst({
        where: { id, churchId: { in: request.tenant.churchIds } },
        include: {
          participants: {
            include: {
              member: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  image: true,
                },
              },
            },
          },
        },
      })

      if (!event) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'EVENT_NOT_FOUND',
          message: 'Evento não encontrado',
        })
      }

      return parseEventResponse({
        ...event,
        participants: canViewParticipants ? event.participants : [],
      })
    },
  )
}
