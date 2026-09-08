import { readFileSync } from 'node:fs'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { requirePermission } from '../../lib/authorization.js'

const packageJson = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../../package.json', import.meta.url)), 'utf8'),
) as { version: string }

export const info: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/',
    {
      preHandler: [requirePermission('SYSTEM_INFO_VIEW')],
      schema: {
        tags: ['system'],
        description: 'Obtém informações do sistema',
        response: {
          200: z.object({
            version: z.string(),
            uptime: z.number(),
            memory: z.object({
              total: z.number(),
              free: z.number(),
              used: z.number(),
            }),
            cpu: z.object({
              model: z.string(),
              cores: z.number(),
              speed: z.number(),
            }),
            os: z.object({
              platform: z.string(),
              release: z.string(),
              arch: z.string(),
            }),
          }),
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async () => {
      const totalMemory = os.totalmem()
      const freeMemory = os.freemem()
      const usedMemory = totalMemory - freeMemory

      return {
        version: packageJson.version,
        uptime: process.uptime(),
        memory: {
          total: totalMemory,
          free: freeMemory,
          used: usedMemory,
        },
        cpu: {
          model: os.cpus()[0].model,
          cores: os.cpus().length,
          speed: os.cpus()[0].speed,
        },
        os: {
          platform: os.platform(),
          release: os.release(),
          arch: os.arch(),
        },
      }
    },
  )
}
