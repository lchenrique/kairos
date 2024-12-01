import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { getGroupParamsSchema } from '../../schemas'
import { z } from 'zod'

export const remove: FastifyPluginAsyncZod = async (app) => {
  app.delete<{
    Params: { id: string }
  }>('/:id', {
    schema: {
      tags: ['groups'],
      description: 'Remove um grupo',
      params: getGroupParamsSchema,
      response: {
        204: z.object({}).describe('Grupo removido com sucesso')
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const { id } = request.params

    await prisma.group.delete({
      where: { id }
    })

    return reply.status(204).send()
  })
}
