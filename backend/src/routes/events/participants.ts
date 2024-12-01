import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'
import { PARTICIPANT_STATUS, eventParticipantSchema } from '../../schemas/events'

export const participants: FastifyPluginAsyncZod = async (app) => {
  // Atualizar status do participante
  app.patch('/:eventId/participants/:memberId/status', {
    schema: {
      tags: ['events'],
      description: 'Atualiza o status de um participante no evento',
      params: z.object({
        eventId: z.string(),
        memberId: z.string()
      }),
      body: z.object({
        status: z.enum([PARTICIPANT_STATUS.CONFIRMED, PARTICIPANT_STATUS.PENDING, PARTICIPANT_STATUS.CANCELLED])
      }),
      response: {
        200: eventParticipantSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request) => {
    const { eventId, memberId } = request.params
    const { status } = request.body

    const participant = await prisma.eventParticipant.update({
      where: {
        eventId_memberId: {
          eventId,
          memberId
        }
      },
      data: { status },
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
    })

    return participant
  })

  // Adicionar participante ao evento
  app.post('/:eventId/participants', {
    schema: {
      tags: ['events'],
      description: 'Adiciona um participante ao evento',
      params: z.object({
        eventId: z.string()
      }),
      body: z.object({
        memberId: z.string(),
        status: z.enum([PARTICIPANT_STATUS.CONFIRMED, PARTICIPANT_STATUS.PENDING, PARTICIPANT_STATUS.CANCELLED]).default(PARTICIPANT_STATUS.CONFIRMED)
      }),
      response: {
        201: eventParticipantSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const { eventId } = request.params
    const { memberId, status } = request.body

    const participant = await prisma.eventParticipant.create({
      data: {
        eventId,
        memberId,
        status
      },
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
    })

    return reply.status(201).send(participant)
  })

  // Remover participante do evento
  app.delete('/:eventId/participants/:memberId', {
    schema: {
      tags: ['events'],
      description: 'Remove um participante do evento',
      params: z.object({
        eventId: z.string(),
        memberId: z.string()
      }),
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const { eventId, memberId } = request.params

    await prisma.eventParticipant.delete({
      where: {
        eventId_memberId: {
          eventId,
          memberId
        }
      }
    })

    return reply.status(204).send()
  })
}
