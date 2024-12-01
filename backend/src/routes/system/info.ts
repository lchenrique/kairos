import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import os from 'node:os'
import pkg from '../../../package.json'

export const info: FastifyPluginAsyncZod = async (app) => {
  app.get('/', {
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
            used: z.number()
          }),
          cpu: z.object({
            model: z.string(),
            cores: z.number(),
            speed: z.number()
          }),
          os: z.object({
            platform: z.string(),
            release: z.string(),
            arch: z.string()
          })
        })
      },
      security: [{ bearerAuth: [] }]
    }
  }, async () => {
    const totalMemory = os.totalmem()
    const freeMemory = os.freemem()
    const usedMemory = totalMemory - freeMemory

    return {
      version: pkg.version,
      uptime: process.uptime(),
      memory: {
        total: totalMemory,
        free: freeMemory,
        used: usedMemory
      },
      cpu: {
        model: os.cpus()[0].model,
        cores: os.cpus().length,
        speed: os.cpus()[0].speed
      },
      os: {
        platform: os.platform(),
        release: os.release(),
        arch: os.arch()
      }
    }
  })
}
