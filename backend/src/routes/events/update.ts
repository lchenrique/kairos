import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { type UpdateEventInput, updateEventSchema, eventSchema } from '../../schemas/events'
import { z } from 'zod'

export const update: FastifyPluginAsyncZod = async (app) => {
  app.put('/:id', {
    schema: {
      tags: ['events'],
      description: 'Atualiza um evento',
      params: z.object({
        id: z.string()
      }),
      body: updateEventSchema,
      response: {
        200: eventSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request) => {
    const { id } = request.params
    const { participants, ...eventData } = request.body as UpdateEventInput

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        participants: participants ? {
          deleteMany: {},
          create: participants.map(memberId => ({
            memberId,
            status: 'CONFIRMED'
          }))
        } : undefined
      },
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
