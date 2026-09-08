import { z } from 'zod'

export const FinanceTypeEnum = z.enum(['INCOME', 'EXPENSE'])
export const financeEntrySchema = z.object({
  id: z.string(),
  type: FinanceTypeEnum,
  category: z.string(),
  description: z.string(),
  amountCents: z.number().int().positive(),
  occurredAt: z.coerce.date(),
  paymentMethod: z.string().nullable(),
  notes: z.string().nullable(),
  createdById: z.string().nullable(),
  createdByName: z.string().nullable(),
  updatedById: z.string().nullable(),
  updatedByName: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export const createFinanceEntrySchema = z.object({
  type: FinanceTypeEnum,
  category: z.string().min(2),
  description: z.string().min(2),
  amountCents: z.coerce.number().int().positive(),
  occurredAt: z.coerce.date(),
  paymentMethod: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})
export const financeQuerySchema = z.object({
  type: FinanceTypeEnum.optional(),
  category: z.string().min(1).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
})
export const financeSummarySchema = z.object({
  incomeCents: z.number().int(),
  expenseCents: z.number().int(),
  balanceCents: z.number().int(),
  entriesCount: z.number().int(),
})
export const financeListSchema = z.object({
  data: z.array(financeEntrySchema),
  summary: financeSummarySchema,
  categories: z.array(z.string()),
})
export const updateFinanceEntrySchema = createFinanceEntrySchema.partial()
export type CreateFinanceEntryInput = z.infer<typeof createFinanceEntrySchema>
export type FinanceQuery = z.infer<typeof financeQuerySchema>
