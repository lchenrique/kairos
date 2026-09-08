import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

const healthSchema = z.object({
  status: z.literal('ok'),
  database: z.literal('ok'),
  timestamp: z.coerce.date(),
  uptimeSeconds: z.number(),
})

export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/',
    {
      schema: {
        tags: ['system'],
        description: 'Verifica a disponibilidade da API e do banco',
        response: {
          200: healthSchema,
          503: z.object({
            status: z.literal('degraded'),
            database: z.literal('error'),
            timestamp: z.coerce.date(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        await prisma.$queryRaw`SELECT 1`
        return {
          status: 'ok' as const,
          database: 'ok' as const,
          timestamp: new Date(),
          uptimeSeconds: Math.round(process.uptime()),
        }
      } catch (error) {
        request.log.error({ error }, 'Health check do banco falhou')
        return reply
          .status(503)
          .send({ status: 'degraded' as const, database: 'error' as const, timestamp: new Date() })
      }
    },
  )
}
