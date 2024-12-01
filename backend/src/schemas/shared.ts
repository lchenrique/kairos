import { z } from 'zod'

// Schema de resposta vazia (204 No Content)
export const noContentResponseSchema = z.null()

// Schema de erro padrão
export const errorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string()
})
