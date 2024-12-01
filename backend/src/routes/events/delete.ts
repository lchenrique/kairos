import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'

export const remove: FastifyPluginAsyncZod = async (app) => {
  app.delete('/:id', {
    schema: {
      tags: ['events'],
      description: 'Remove um evento',
      params: z.object({
        id: z.string()
      }),
      response: {
        204: z.object({}).describe('Evento removido com sucesso')
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const { id } = request.params

    await prisma.event.delete({
      where: { id }
    })

    return reply.status(204).send()
  })
}
