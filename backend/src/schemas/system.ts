import { z } from 'zod'

export const healthcheckResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  version: z.string(),
  memory: z.object({
    rss: z.number(),
    heapTotal: z.number(),
    heapUsed: z.number()
  })
})

export type HealthcheckResponse = z.infer<typeof healthcheckResponseSchema>

// Schema de setup inicial do sistema
export const setupSchema = z.object({
  church: z.object({
    name: z.string().min(3, 'Nome da igreja deve ter pelo menos 3 caracteres'),
    address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
    phone: z.string().optional(),
  }),
  admin: z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  })
})

export const setupResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
})

export type SetupInput = z.infer<typeof setupSchema>
export type SetupResponse = z.infer<typeof setupResponseSchema>
