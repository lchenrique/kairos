import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'
import { ParticipantStatusEnum, eventParticipantSchema, participantSchema } from '../../schemas/events'
import { errorResponseSchema, idSchema, noContentResponseSchema } from '../../schemas/shared'

export const participants: FastifyPluginAsyncZod = async (app) => {
  // Atualizar status do participante
  app.patch('/:eventId/participants/:memberId/status', {
    schema: {
      tags: ['events'],
      description: 'Atualiza o status de um participante no evento',
      params: z.object({
        ...idSchema.shape,
        eventId: z.string().describe('ID do evento'),
        memberId: z.string().describe('ID do membro')
      }).describe('Parâmetros da rota'),
      body: z.object({
        status: ParticipantStatusEnum
      }).describe('Dados para atualização de status'),
      response: {
        200: eventParticipantSchema,
        400: errorResponseSchema,
        404: errorResponseSchema
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
        eventId: z.string().describe('ID do evento')
      }).describe('Parâmetros da rota'),
      body: participantSchema.describe('Dados do participante'),
      response: {
        201: eventParticipantSchema,
        400: errorResponseSchema,
        404: errorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const { eventId } = request.params
    const { memberId, status = ParticipantStatusEnum.enum.CONFIRMED } = request.body

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
        eventId: z.string().describe('ID do evento'),
        memberId: z.string().describe('ID do membro')
      }).describe('Parâmetros da rota'),
      response: {
        204: noContentResponseSchema,
        400: errorResponseSchema,
        404: errorResponseSchema
      },
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
