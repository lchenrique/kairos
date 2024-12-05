import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { getMemberParamsSchema } from '../../schemas/members'
import { errorResponseSchema, noContentResponseSchema } from '../../schemas/shared'

export const remove: FastifyPluginAsyncZod = async (app) => {
  app.delete<{
    Params: { id: string }
  }>('/:id', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['members'],
      description: 'Remove um membro',
      params: getMemberParamsSchema,
      response: {
        204: noContentResponseSchema,
        401: errorResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const { id } = request.params

    try {
      // Verifica se o membro existe
      const member = await prisma.member.findUnique({
        where: { id }
      })

      if (!member) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Membro não encontrado'
        })
      }

      // Remove o membro
      await prisma.member.delete({
        where: { id }
      })

      return reply.status(204).send()
    } catch (error) {
      console.error('Erro ao deletar membro:', error) // Log para debug
      
      if (error instanceof Error) {
        return reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: error.message || 'Erro ao remover membro'
        })
      }

      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Erro ao remover membro'
      })
    }
  })
}
