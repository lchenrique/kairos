import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { requirePermission } from '../../lib/authorization.js'
import { prisma } from '../../lib/prisma.js'
import {
  ParticipantStatusEnum,
  eventParticipantSchema,
  participantSchema,
} from '../../schemas/events.js'
import { errorResponseSchema, noContentResponseSchema } from '../../schemas/shared.js'

export const participants: FastifyPluginAsyncZod = async (app) => {
  // Atualizar status do participante
  app.patch(
    '/:eventId/participants/:memberId/status',
    {
      preHandler: [requirePermission('EVENTS_MANAGE')],
      schema: {
        tags: ['events'],
        description: 'Atualiza o status de um participante no evento',
        params: z
          .object({
            eventId: z.string().describe('ID do evento'),
            memberId: z.string().describe('ID do membro'),
          })
          .describe('Parâmetros da rota'),
        body: z
          .object({
            status: ParticipantStatusEnum,
          })
          .describe('Dados para atualização de status'),
        response: {
          200: eventParticipantSchema,
          400: errorResponseSchema,
          404: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const { eventId, memberId } = request.params
      const { status } = request.body

      const participantExists = await prisma.eventParticipant.findFirst({
        where: {
          eventId,
          memberId,
          event: { churchId: { in: request.tenant.churchIds } },
          member: { churchId: { in: request.tenant.churchIds } },
        },
      })
      if (!participantExists) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'PARTICIPANT_NOT_FOUND',
          message: 'Participante não encontrado neste evento.',
        })
      }

      const participant = await prisma.eventParticipant.update({
        where: {
          eventId_memberId: {
            eventId,
            memberId,
          },
        },
        data: { status },
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
      })

      await prisma.attendanceHistory.create({
        data: { eventId, memberId, status },
      })

      return eventParticipantSchema.parse(participant)
    },
  )

  // Adicionar participante ao evento
  app.post(
    '/:eventId/participants',
    {
      preHandler: [requirePermission('EVENTS_MANAGE')],
      schema: {
        tags: ['events'],
        description: 'Adiciona um participante ao evento',
        params: z
          .object({
            eventId: z.string().describe('ID do evento'),
          })
          .describe('Parâmetros da rota'),
        body: participantSchema.describe('Dados do participante'),
        response: {
          201: eventParticipantSchema,
          400: errorResponseSchema,
          404: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const { eventId } = request.params
      const { memberId, status = ParticipantStatusEnum.enum.CONFIRMED } = request.body

      const event = await prisma.event.findFirst({
        where: { id: eventId, churchId: { in: request.tenant.churchIds } },
        select: { churchId: true },
      })
      const member = event
        ? await prisma.member.findFirst({
            where: { id: memberId, churchId: event.churchId },
            select: { id: true },
          })
        : null
      if (!event || !member) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'EVENT_OR_MEMBER_NOT_FOUND',
          message: 'Evento ou membro não encontrado na unidade selecionada.',
        })
      }

      const participant = await prisma.eventParticipant.create({
        data: {
          eventId,
          memberId,
          status,
        },
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
      })

      await prisma.attendanceHistory.create({
        data: { eventId, memberId, status },
      })

      return reply.status(201).send(eventParticipantSchema.parse(participant))
    },
  )

  // Remover participante do evento
  app.delete(
    '/:eventId/participants/:memberId',
    {
      preHandler: [requirePermission('EVENTS_MANAGE')],
      schema: {
        tags: ['events'],
        description: 'Remove um participante do evento',
        params: z
          .object({
            eventId: z.string().describe('ID do evento'),
            memberId: z.string().describe('ID do membro'),
          })
          .describe('Parâmetros da rota'),
        response: {
          204: noContentResponseSchema,
          400: errorResponseSchema,
          404: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const { eventId, memberId } = request.params

      const participant = await prisma.eventParticipant.findFirst({
        where: {
          eventId,
          memberId,
          event: { churchId: { in: request.tenant.churchIds } },
          member: { churchId: { in: request.tenant.churchIds } },
        },
      })
      if (!participant) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'PARTICIPANT_NOT_FOUND',
          message: 'Participante não encontrado neste evento.',
        })
      }

      await prisma.eventParticipant.delete({
        where: {
          eventId_memberId: {
            eventId,
            memberId,
          },
        },
      })

      return reply.status(204).send()
    },
  )
}
