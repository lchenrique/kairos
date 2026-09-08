import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { requirePermission } from '../../lib/authorization.js'
import { prisma } from '../../lib/prisma.js'
import { requireCurrentChurch } from '../../lib/tenant.js'
import { type CreateMemberInput, createMemberSchema, memberSchema } from '../../schemas/members.js'

export const create: FastifyPluginAsyncZod = async (app) => {
  app.post<{
    Body: CreateMemberInput
  }>(
    '/',
    {
      onRequest: [app.authenticate],
      preHandler: [requirePermission('MEMBERS_MANAGE')],
      schema: {
        tags: ['members'],
        description: 'Cria um novo membro',
        body: createMemberSchema,
        response: {
          201: memberSchema,
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
      const { groups, ...memberData } = request.body
      const churchId = requireCurrentChurch(request, reply)
      if (!churchId) return

      if (groups?.length) {
        const validGroups = await prisma.group.count({
          where: { id: { in: groups.map((group) => group.id) }, churchId },
        })
        if (validGroups !== new Set(groups.map((group) => group.id)).size) {
          return reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Um ou mais grupos não pertencem à unidade selecionada.',
          })
        }
      }

      const member = await prisma.member.create({
        data: {
          ...memberData,
          churchId,
          groups: groups
            ? {
                create: groups.map(({ id }) => ({
                  groupId: id,
                })),
              }
            : undefined,
        },
        include: {
          groups: {
            include: {
              group: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })

      return reply.status(201).send(member)
    },
  )
}
