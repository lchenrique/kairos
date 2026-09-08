import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { requirePermission } from '../../lib/authorization.js'
import { prisma } from '../../lib/prisma.js'
import { getMemberParamsSchema } from '../../schemas/members.js'
import { errorResponseSchema, noContentResponseSchema } from '../../schemas/shared.js'

export const remove: FastifyPluginAsyncZod = async (app) => {
  app.delete<{
    Params: { id: string }
  }>(
    '/:id',
    {
      onRequest: [app.authenticate],
      preHandler: [requirePermission('MEMBERS_MANAGE')],
      schema: {
        tags: ['members'],
        description: 'Remove um membro',
        params: getMemberParamsSchema,
        response: {
          204: noContentResponseSchema,
          401: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const { id } = request.params

      try {
        // Verifica se o membro existe
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

        // Remove o membro
        await prisma.member.delete({
          where: { id },
        })

        return reply.status(204).send()
      } catch (error) {
        app.log.error({ error }, 'Erro ao deletar membro')

        if (error instanceof Error) {
          return reply.status(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: error.message || 'Erro ao remover membro',
          })
        }

        return reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Erro ao remover membro',
        })
      }
    },
  )
}
