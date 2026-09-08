import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { requirePermission } from '../../lib/authorization.js'
import { cloudinary, isCloudinaryConfigured } from '../../lib/cloudinary.js'
import { requireCurrentChurch } from '../../lib/tenant.js'
import { errorResponseSchema } from '../../schemas/shared.js'

export const upload: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      preHandler: [requirePermission('UPLOADS_MANAGE')],
      schema: {
        tags: ['uploads'],
        description: 'Faz upload de uma imagem JPG, PNG ou WebP de até 5 MB',
        consumes: ['multipart/form-data'],
        response: {
          200: z.object({ url: z.string().url(), publicId: z.string() }),
          400: errorResponseSchema,
          413: errorResponseSchema,
          503: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const data = await request.file()
      if (!data) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          code: 'IMAGE_REQUIRED',
          message: 'Nenhum arquivo enviado.',
        })
      }

      const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
      if (!allowedMimeTypes.has(data.mimetype)) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          code: 'INVALID_IMAGE_TYPE',
          message: 'Formato inválido. Envie uma imagem JPG, PNG ou WebP.',
        })
      }

      let buffer: Buffer
      try {
        buffer = await data.toBuffer()
      } catch (error) {
        if ((error as { code?: string }).code === 'FST_REQ_FILE_TOO_LARGE') {
          return reply.status(413).send({
            statusCode: 413,
            error: 'Payload Too Large',
            code: 'IMAGE_TOO_LARGE',
            message: 'A imagem deve ter no máximo 5 MB.',
          })
        }
        throw error
      }

      if (!isCloudinaryConfigured()) {
        return reply.status(503).send({
          statusCode: 503,
          error: 'Service Unavailable',
          code: 'IMAGE_STORAGE_UNAVAILABLE',
          message: 'O armazenamento de imagens não está configurado.',
        })
      }

      const churchId = requireCurrentChurch(request, reply)
      if (!churchId) return
      const dataURI = `data:${data.mimetype};base64,${buffer.toString('base64')}`
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: `kairos/${request.tenant.organizationId}/${churchId}/members`,
        resource_type: 'image',
      })

      return { url: result.secure_url, publicId: result.public_id }
    },
  )
}
