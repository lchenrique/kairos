import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { requirePermission } from '../../lib/authorization.js'
import { cloudinary, isCloudinaryConfigured } from '../../lib/cloudinary.js'
import { requireCurrentChurch } from '../../lib/tenant.js'
import { errorResponseSchema } from '../../schemas/shared.js'

export const remove: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/:publicId',
    {
      preHandler: [requirePermission('UPLOADS_MANAGE')],
      schema: {
        tags: ['uploads'],
        description: 'Remove uma imagem pertencente à unidade selecionada',
        params: z.object({ publicId: z.string().min(1).max(300) }),
        response: {
          204: z.null(),
          400: errorResponseSchema,
          503: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const { publicId } = request.params
      const churchId = requireCurrentChurch(request, reply)
      if (!churchId) return
      const expectedPrefix = `kairos/${request.tenant.organizationId}/${churchId}/members/`

      if (!publicId.startsWith(expectedPrefix) || !/^kairos\/[A-Za-z0-9_/-]+$/.test(publicId)) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          code: 'INVALID_IMAGE_ID',
          message: 'A imagem não pertence à unidade selecionada.',
        })
      }
      if (!isCloudinaryConfigured()) {
        return reply.status(503).send({
          statusCode: 503,
          error: 'Service Unavailable',
          code: 'IMAGE_STORAGE_UNAVAILABLE',
          message: 'O armazenamento de imagens não está configurado.',
        })
      }

      await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true })
      return reply.status(204).send()
    },
  )
}
