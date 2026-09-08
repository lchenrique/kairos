import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { hasPermission } from '../../lib/authorization.js'
import { prisma } from '../../lib/prisma.js'
import { getGroupParamsSchema, groupSchema } from '../../schemas/groups.js'
import { errorResponseSchema } from '../../schemas/shared.js'

export const get: FastifyPluginAsyncZod = async (app) => {
  app.get<{
    Params: { id: string }
  }>(
    '/:id',
    {
      schema: {
        tags: ['groups'],
        description: 'Obtém um grupo por ID',
        params: getGroupParamsSchema,
        response: {
          200: groupSchema,
          404: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const canViewMembers = hasPermission(request.user.role, 'MEMBERS_VIEW')
      const { id } = request.params

      const group = await prisma.group.findFirst({
        where: { id, churchId: { in: request.tenant.churchIds } },
        include: {
          members: {
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

      if (!group) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'GROUP_NOT_FOUND',
          message: 'Grupo não encontrado',
        })
      }

      return {
        ...group,
        members: canViewMembers
          ? group.members.map((groupMember) => ({
              ...groupMember,
              member: {
                id: groupMember.member.id,
                name: groupMember.member.name,
                email: groupMember.member.email || '',
                phone: groupMember.member.phone,
                avatar: groupMember.member.image,
              },
            }))
          : [],
      }
    },
  )
}
