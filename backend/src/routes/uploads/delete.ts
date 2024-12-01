import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { cloudinary } from '../../lib/cloudinary'
import { z } from 'zod'

export const remove: FastifyPluginAsyncZod = async (app) => {
  app.delete('/:publicId', {
    schema: {
      tags: ['uploads'],
      description: 'Remove uma imagem do Cloudinary',
      params: z.object({
        publicId: z.string()
      }),
      response: {
        204: z.null()
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const { publicId } = request.params

    await cloudinary.uploader.destroy(publicId)

    return reply.status(204).send()
  })
}
