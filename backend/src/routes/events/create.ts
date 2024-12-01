import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { type CreateEventInput, createEventSchema, eventSchema, EVENT_STATUS } from '../../schemas/events'

export const create: FastifyPluginAsyncZod = async (app) => {
  app.post('/', {
    schema: {
      tags: ['events'],
      description: 'Cria um novo evento',
      body: createEventSchema,
      response: {
        201: eventSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const { participants, ...eventData } = request.body as CreateEventInput

    const event = await prisma.event.create({
      data: {
        ...eventData,
        status: EVENT_STATUS.SCHEDULED,
        participants: participants ? {
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

    return reply.status(201).send(event)
  })
}
