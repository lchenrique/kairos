import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { requirePermission } from '../../lib/authorization.js'
import { prisma } from '../../lib/prisma.js'
import { type UpdateMemberInput, memberSchema, updateMemberSchema } from '../../schemas/members.js'

export const update: FastifyPluginAsyncZod = async (app) => {
  app.put<{
    Params: { id: string }
    Body: UpdateMemberInput
  }>(
    '/:id',
    {
      onRequest: [app.authenticate],
      preHandler: [requirePermission('MEMBERS_MANAGE')],
      schema: {
        tags: ['members'],
        description: 'Atualiza um membro',
        params: z.object({
          id: z.string(),
        }),
        body: updateMemberSchema,
        response: {
          200: memberSchema,
          404: z.object({
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
      const { id } = request.params
      const { groups, ...memberData } = request.body

      const member = await prisma.member.findFirst({
        where: { id, churchId: { in: request.tenant.churchIds } },
      })

      if (!member) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Membro não encontrado',
        })
      }

      if (groups?.length) {
        const validGroups = await prisma.group.count({
          where: { id: { in: groups.map((group) => group.id) }, churchId: member.churchId },
        })
        if (validGroups !== new Set(groups.map((group) => group.id)).size) {
          return reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Um ou mais grupos não pertencem à unidade do membro.',
          })
        }
      }

      const updatedMember = await prisma.member.update({
        where: { id },
        data: {
          ...memberData,
          groups: groups
            ? {
                deleteMany: {},
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

      return updatedMember
    },
  )
}
