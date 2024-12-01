import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { eventSchema } from '../../schemas/events'
import { z } from 'zod'

export const get: FastifyPluginAsyncZod = async (app) => {
  app.get('/:id', {
    schema: {
      tags: ['events'],
      description: 'Obtém um evento por ID',
      params: z.object({
        id: z.string()
      }),
      response: {
        200: eventSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request) => {
    const { id } = request.params

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
  })
}
