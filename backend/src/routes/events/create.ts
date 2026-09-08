import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { requirePermission } from '../../lib/authorization.js'
import { prisma } from '../../lib/prisma.js'
import { requireCurrentChurch } from '../../lib/tenant.js'
import {
  type CreateEventInput,
  EVENT_STATUS,
  ParticipantStatusEnum,
  createEventSchema,
  eventSchema,
  parseEventResponse,
  serializeRecurrenceExceptions,
} from '../../schemas/events.js'
import { errorResponseSchema } from '../../schemas/shared.js'

export const create: FastifyPluginAsyncZod = async (app) => {
  app.post<{
    Body: CreateEventInput
  }>(
    '/',
    {
      onRequest: [app.authenticate],
      preHandler: [requirePermission('EVENTS_MANAGE')],
      schema: {
        tags: ['events'],
        description: 'Cria um novo evento',
        body: createEventSchema,
        response: {
          201: eventSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const { participants, recurrenceExceptions, ...eventData } = request.body
      const churchId = requireCurrentChurch(request, reply)
      if (!churchId) return

      if (participants?.length) {
        const memberIds = Array.from(new Set(participants))
        const validMembers = await prisma.member.count({
          where: { id: { in: memberIds }, churchId },
        })
        if (validMembers !== memberIds.length) {
          return reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            code: 'MEMBER_OUTSIDE_CHURCH',
            message: 'Um ou mais participantes não pertencem à unidade selecionada.',
          })
        }
      }

      const event = await prisma.event.create({
        data: {
          ...eventData,
          recurrenceEndDate: eventData.recurrenceRule ? eventData.recurrenceEndDate : null,
          recurrenceExceptions: eventData.recurrenceRule
            ? serializeRecurrenceExceptions(recurrenceExceptions)
            : '[]',
          churchId,
          status: EVENT_STATUS.SCHEDULED,
          participants: participants
            ? {
                create: participants.map((memberId) => ({
                  memberId,
                  status: ParticipantStatusEnum.enum.CONFIRMED,
                })),
              }
            : undefined,
          attendanceHistory: participants
            ? {
                create: participants.map((memberId) => ({
                  memberId,
                  status: ParticipantStatusEnum.enum.CONFIRMED,
                })),
              }
            : undefined,
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
                  image: true,
                },
              },
            },
          },
        },
      })

      return reply.status(201).send(parseEventResponse(event))
    },
  )
}
