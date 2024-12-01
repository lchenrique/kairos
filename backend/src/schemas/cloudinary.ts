import { z } from 'zod'

export const signatureSchema = z.object({
  publicId: z.string(),
  timestamp: z.number()
})

export const uploadSchema = z.object({
  imageStr: z.string(),
  memberId: z.string().optional()
})

export const deleteSchema = z.object({
  publicId: z.string()
})
