import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'

const churchSchema = z.object({
  name: z.string().min(3),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  logo: z.string().url().optional(),
  theme: z.enum(['light', 'dark']).default('light'),
  timezone: z.string().default('America/Sao_Paulo'),
  dateFormat: z.string().default('DD/MM/YYYY'),
  timeFormat: z.string().default('HH:mm')
})

type ChurchResponse = z.infer<typeof churchSchema>

export const church: FastifyPluginAsyncZod = async (app) => {
  // Get church info
  app.get('/', {
    schema: {
      tags: ['system'],
      description: 'Obtém as configurações da igreja',
      response: {
        200: churchSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async () => {
    const church = await prisma.church.findUnique({
      where: { id: 'default' }
    })

    if (!church) {
      throw new Error('Church configuration not found')
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
      timeFormat: church.timeFormat ?? 'HH:mm'
    }

    return response
  })

  // Update church info
  app.put('/', {
    schema: {
      tags: ['system'],
      description: 'Atualiza as configurações da igreja',
      body: churchSchema.partial(),
      response: {
        200: churchSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request) => {
    const data = request.body

    const church = await prisma.church.upsert({
      where: { id: 'default' },
      update: data,
      create: {
        id: 'default',
        ...data,
        name: data.name ?? 'Igreja Exemplo'
      }
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
      timeFormat: church.timeFormat ?? 'HH:mm'
    }

    return response
  })
}
