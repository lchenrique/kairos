import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { requirePermission } from '../../lib/authorization.js'
import { prisma } from '../../lib/prisma.js'
import { getGroupParamsSchema } from '../../schemas/groups.js'

export const remove: FastifyPluginAsyncZod = async (app) => {
  app.delete<{
    Params: { id: string }
  }>(
    '/:id',
    {
      preHandler: [requirePermission('GROUPS_MANAGE')],
      schema: {
        tags: ['groups'],
        description: 'Remove um grupo',
        params: getGroupParamsSchema,
        response: {
          204: z.object({}).describe('Grupo removido com sucesso'),
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const group = await prisma.group.findFirst({
        where: { id, churchId: { in: request.tenant.churchIds } },
        select: { id: true },
      })
      if (!group) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'GROUP_NOT_FOUND',
          message: 'Grupo não encontrado',
        })
      }

      await prisma.group.delete({
        where: { id },
      })

      return reply.status(204).send()
    },
  )
}
