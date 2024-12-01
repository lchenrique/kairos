import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { cloudinary } from '../../lib/cloudinary'
import { z } from 'zod'

export const upload: FastifyPluginAsyncZod = async (app) => {
  app.post('/', {
    schema: {
      tags: ['uploads'],
      description: 'Faz upload de uma imagem',
      consumes: ['multipart/form-data'],
      body: z.object({
        file: z.any()
      }),
      response: {
        200: z.object({
          url: z.string().url(),
          publicId: z.string()
        })
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const data = await request.file()

    if (!data) {
      return reply.status(400).send({
        code: 'FILE_REQUIRED',
        message: 'Nenhum arquivo enviado'
      })
    }

    const buffer = await data.toBuffer()
    const base64 = buffer.toString('base64')
    const dataURI = `data:${data.mimetype};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'kairos'
    })

    return {
      url: result.secure_url,
      publicId: result.public_id
    }
  })
}
