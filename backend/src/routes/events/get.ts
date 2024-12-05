import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { eventSchema } from '../../schemas/events'
import { errorResponseSchema, idSchema } from '../../schemas/shared'

export const get: FastifyPluginAsyncZod = async (app) => {
  app.get<{
    Params: { id: string }
  }>('/:id', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['events'],
      description: 'Obtém um evento por ID',
      params: idSchema,
      response: {
        200: eventSchema,
        404: errorResponseSchema,
        500: errorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const { id } = request.params

    try {
      const event = await prisma.event.findUniqueOrThrow({
        where: { id },
        include: {
          participants: {
            include: {
              member: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  image: true
                }
              }
            }
          }
        }
      })

      return event
    } catch (error) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Evento não encontrado'
      })
    }
  })
}
