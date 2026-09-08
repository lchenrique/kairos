import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { requirePermission } from '../../lib/authorization.js'
import { prisma } from '../../lib/prisma.js'
import {
  ParticipantStatusEnum,
  type UpdateEventInput,
  eventSchema,
  parseEventResponse,
  serializeRecurrenceExceptions,
  updateEventSchema,
} from '../../schemas/events.js'
import { errorResponseSchema, idSchema } from '../../schemas/shared.js'

export const update: FastifyPluginAsyncZod = async (app) => {
  app.put(
    '/:id',
    {
      preHandler: [requirePermission('EVENTS_MANAGE')],
      schema: {
        tags: ['events'],
        description: 'Atualiza um evento',
        params: idSchema,
        body: updateEventSchema,
        response: {
          200: eventSchema,
          400: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const { participants, recurrenceExceptions, ...eventData } = request.body as UpdateEventInput

      const existingEvent = await prisma.event.findFirst({
        where: { id, churchId: { in: request.tenant.churchIds } },
        select: { id: true, churchId: true },
      })
      if (!existingEvent) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'EVENT_NOT_FOUND',
          message: 'Evento não encontrado',
        })
      }

      if (participants?.length) {
        const memberIds = Array.from(new Set(participants))
        const validMembers = await prisma.member.count({
          where: { id: { in: memberIds }, churchId: existingEvent.churchId },
        })
        if (validMembers !== memberIds.length) {
          return reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            code: 'MEMBER_OUTSIDE_CHURCH',
            message: 'Um ou mais participantes não pertencem à unidade do evento.',
          })
        }
      }

      const event = await prisma.event.update({
        where: { id },
        data: {
          ...eventData,
          recurrenceEndDate: eventData.recurrenceRule === null ? null : eventData.recurrenceEndDate,
          recurrenceExceptions:
            eventData.recurrenceRule === null
              ? '[]'
              : recurrenceExceptions
                ? serializeRecurrenceExceptions(recurrenceExceptions)
                : undefined,
          participants: participants
            ? {
                deleteMany: {},
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

      return parseEventResponse(event)
    },
  )
}
