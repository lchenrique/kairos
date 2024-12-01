import { z } from 'zod'
import { groupSchema } from './groups'

// Enums
export const MemberStatusEnum = z.enum(['ACTIVE', 'INACTIVE'])
export const MemberSortByEnum = z.enum(['name', 'email', 'createdAt'])
export const OrderEnum = z.enum(['asc', 'desc'])

// Schema base do membro
export const memberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  birthDate: z.date().nullable(),
  baptismDate: z.date().nullable(),
  status: MemberStatusEnum,
  notes: z.string().nullable(),
  image: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  groups: z.array(z.object({
    id: z.string(),
    name: z.string()
  }))
})

// Schema de parâmetros
export const getMemberParamsSchema = z.object({
  id: z.string().min(1)
})

// Schema de criação
export const createMemberSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  birthDate: z.string().optional().transform(val => val ? new Date(val) : null),
  baptismDate: z.string().optional().transform(val => val ? new Date(val) : null),
  status: MemberStatusEnum.default('ACTIVE'),
  notes: z.string().optional(),
  image: z.string().optional(),
  groups: z.array(z.object({
    id: z.string()
  })).optional()
})

// Schema de atualização
export const updateMemberSchema = createMemberSchema.partial()

// Schema de listagem
export const listMembersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: MemberStatusEnum.optional(),
  sortBy: MemberSortByEnum.default('name'),
  order: OrderEnum.default('asc')
})

// Schema de resposta paginada
export const paginatedMembersSchema = z.object({
  data: z.array(memberSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean()
  })
})

// Tipos gerados dos schemas
export type ListMembersQuery = z.infer<typeof listMembersQuerySchema>
export type CreateMemberInput = z.infer<typeof createMemberSchema>
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>
export type Member = z.infer<typeof memberSchema>
export type PaginatedMembers = z.infer<typeof paginatedMembersSchema>
