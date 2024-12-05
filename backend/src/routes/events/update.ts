import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { type UpdateEventInput, updateEventSchema, eventSchema, ParticipantStatusEnum } from '../../schemas/events'
import { errorResponseSchema, idSchema } from '../../schemas/shared'

export const update: FastifyPluginAsyncZod = async (app) => {
  app.put('/:id', {
    schema: {
      tags: ['events'],
      description: 'Atualiza um evento',
      params: idSchema,
      body: updateEventSchema,
      response: {
        200: eventSchema,
        400: errorResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema
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
            status: ParticipantStatusEnum.enum.CONFIRMED
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
