import { Prisma } from '@prisma/client'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { requirePermission } from '../../lib/authorization.js'
import { prisma } from '../../lib/prisma.js'
import { requireCurrentChurch } from '../../lib/tenant.js'
import { type CreateGroupInput, createGroupSchema, groupSchema } from '../../schemas/groups.js'

export const create: FastifyPluginAsyncZod = async (app) => {
  app.post<{
    Body: CreateGroupInput
  }>(
    '/',
    {
      onRequest: [app.authenticate],
      preHandler: [requirePermission('GROUPS_MANAGE')],
      schema: {
        tags: ['groups'],
        description: 'Cria um novo grupo',
        body: createGroupSchema,
        response: {
          201: groupSchema,
          400: z.object({
            statusCode: z.number(),
            error: z.string(),
            message: z.string(),
          }),
          500: z.object({
            statusCode: z.number(),
            error: z.string(),
            message: z.string(),
          }),
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      try {
        const { members, ...groupData } = request.body
        const churchId = requireCurrentChurch(request, reply)
        if (!churchId) return

        if (members?.length) {
          const memberIds = Array.from(new Set(members.map((member) => member.memberId)))
          const validMembers = await prisma.member.count({
            where: { id: { in: memberIds }, churchId },
          })
          if (validMembers !== memberIds.length) {
            return reply.status(400).send({
              statusCode: 400,
              error: 'Bad Request',
              message: 'Um ou mais membros não pertencem à unidade selecionada.',
            })
          }
        }

        // Verificar se existe sobreposição de horário
        const existingGroup = await prisma.group.findFirst({
          where: {
            AND: [
              { churchId },
              { meetingDay: groupData.meetingDay },
              { location: groupData.location },
              {
                OR: [
                  // Novo grupo começa durante outro grupo
                  {
                    AND: [
                      { startTime: { lte: groupData.startTime } },
                      { endTime: { gt: groupData.startTime } },
                    ],
                  },
                  // Novo grupo termina durante outro grupo
                  {
                    AND: [
                      { startTime: { lt: groupData.endTime } },
                      { endTime: { gte: groupData.endTime } },
                    ],
                  },
                  // Novo grupo engloba outro grupo
                  {
                    AND: [
                      { startTime: { gte: groupData.startTime } },
                      { endTime: { lte: groupData.endTime } },
                    ],
                  },
                ],
              },
            ],
          },
        })

        if (existingGroup) {
          return reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: `Já existe um grupo agendado na ${groupData.location} das ${existingGroup.startTime} às ${existingGroup.endTime}`,
          })
        }

        const group = await prisma.group.create({
          data: {
            ...groupData,
            churchId,
            members: {
              create: members?.map(({ memberId }) => ({
                memberId,
              })),
            },
          },
          include: {
            members: {
              include: {
                member: true,
              },
            },
          },
        })

        return reply.status(201).send(group)
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            return reply.status(400).send({
              statusCode: 400,
              error: 'Bad Request',
              message: 'Já existe um grupo agendado neste horário e local',
            })
          }
          if (err.code === 'P2003') {
            return reply.status(400).send({
              statusCode: 400,
              error: 'Bad Request',
              message: 'Um ou mais membros informados não existem',
            })
          }
          return reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Erro ao criar grupo',
          })
        }
        throw err
      }
    },
  )
}
