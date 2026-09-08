import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { requirePermission } from '../../lib/authorization.js'
import { prisma } from '../../lib/prisma.js'
import { requireCurrentChurch } from '../../lib/tenant.js'
import { errorResponseSchema } from '../../schemas/shared.js'

const churchSchema = z.object({
  name: z.string().min(3),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  logo: z.string().url().optional(),
  theme: z.enum(['light', 'dark']).default('light'),
  timezone: z.string().default('America/Sao_Paulo'),
  dateFormat: z.string().default('DD/MM/YYYY'),
  timeFormat: z.string().default('HH:mm'),
})

type ChurchResponse = z.infer<typeof churchSchema>

export const church: FastifyPluginAsyncZod = async (app) => {
  // Get church info
  app.get(
    '/',
    {
      preHandler: [requirePermission('CHURCH_SETTINGS_VIEW')],
      schema: {
        tags: ['system'],
        description: 'Obtém as configurações da igreja',
        response: { 200: churchSchema, 400: errorResponseSchema, 404: errorResponseSchema },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const churchId = requireCurrentChurch(request, reply)
      if (!churchId) return
      const church = await prisma.church.findFirst({
        where: { id: churchId, organizationId: request.tenant.organizationId },
      })

      if (!church) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'CHURCH_NOT_FOUND',
          message: 'Igreja ou unidade não encontrada.',
        })
      }

      const response: ChurchResponse = {
        name: church.name,
        address: church.address ?? undefined,
        phone: church.phone ?? undefined,
        email: church.email ?? undefined,
        logo: church.logo ?? undefined,
        theme: (church.theme as 'light' | 'dark') ?? 'light',
        timezone: church.timezone ?? 'America/Sao_Paulo',
        dateFormat: church.dateFormat ?? 'DD/MM/YYYY',
        timeFormat: church.timeFormat ?? 'HH:mm',
      }

      return response
    },
  )

  // Update church info
  app.put(
    '/',
    {
      preHandler: [requirePermission('CHURCH_SETTINGS_MANAGE')],
      schema: {
        tags: ['system'],
        description: 'Atualiza as configurações da igreja',
        body: churchSchema.partial(),
        response: { 200: churchSchema, 400: errorResponseSchema, 404: errorResponseSchema },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const data = request.body
      const churchId = requireCurrentChurch(request, reply)
      if (!churchId) return

      const church = await prisma.church.update({
        where: { id: churchId },
        data,
      })

      const response: ChurchResponse = {
        name: church.name,
        address: church.address ?? undefined,
        phone: church.phone ?? undefined,
        email: church.email ?? undefined,
        logo: church.logo ?? undefined,
        theme: (church.theme as 'light' | 'dark') ?? 'light',
        timezone: church.timezone ?? 'America/Sao_Paulo',
        dateFormat: church.dateFormat ?? 'DD/MM/YYYY',
        timeFormat: church.timeFormat ?? 'HH:mm',
      }

      return response
    },
  )
}
