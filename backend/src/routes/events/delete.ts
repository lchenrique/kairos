import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { errorResponseSchema, idSchema, noContentResponseSchema } from '../../schemas/shared'
import { z } from 'zod'

export const remove: FastifyPluginAsyncZod = async (app) => {
  app.delete('/:id', {
    schema: {
      tags: ['events'],
      description: 'Remove um evento',
      params: idSchema,
      response: {
        204: noContentResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema
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
