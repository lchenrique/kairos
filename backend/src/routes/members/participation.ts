import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { memberParticipationSchema } from '../../schemas/members.js'
import { errorResponseSchema } from '../../schemas/shared.js'

export const participation: FastifyPluginAsyncZod = async (app) => {
  app.get<{ Params: { id: string } }>(
    '/:id/participation',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['members'],
        description: 'Histórico de participação do membro em eventos',
        params: z.object({ id: z.string() }),
        response: { 200: z.array(memberParticipationSchema), 404: errorResponseSchema },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const member = await prisma.member.findFirst({
        where: { id: request.params.id, churchId: { in: request.tenant.churchIds } },
        select: { id: true },
      })
      if (!member)
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'MEMBER_NOT_FOUND',
          message: 'Membro não encontrado',
        })
      const participants = await prisma.eventParticipant.findMany({
        where: {
          memberId: member.id,
          event: { churchId: { in: request.tenant.churchIds } },
        },
        include: { event: { select: { id: true, title: true, startDate: true, endDate: true } } },
        orderBy: { event: { startDate: 'desc' } },
        take: 100,
      })
      return Promise.all(
        participants.map(async (participant) => {
          const [latest, changes] = await Promise.all([
            prisma.attendanceHistory.findFirst({
              where: { eventId: participant.eventId, memberId: member.id },
              orderBy: { recordedAt: 'desc' },
            }),
            prisma.attendanceHistory.count({
              where: { eventId: participant.eventId, memberId: member.id },
            }),
          ])
          return {
            eventId: participant.event.id,
            title: participant.event.title,
            startDate: participant.event.startDate,
            endDate: participant.event.endDate,
            status: participant.status,
            lastUpdatedAt: latest?.recordedAt ?? null,
            changes,
          }
        }),
      )
    },
  )
}
