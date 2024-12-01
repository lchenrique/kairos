import { z } from 'zod'

// Enums
export const GroupTypeEnum = z.enum(['CELL', 'MINISTRY', 'DEPARTMENT', 'OTHER'])
export const GroupMemberRoleEnum = z.enum(['LEADER', 'MEMBER'])
export const GroupSortByEnum = z.enum(['name', 'type', 'createdAt'])
export const OrderEnum = z.enum(['asc', 'desc'])

// Schema do membro
export const memberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  avatar: z.string().nullable(),
})

// Schema do membro do grupo
export const groupMemberSchema = z.object({
  member: memberSchema,
  groupId: z.string(),
  memberId: z.string(),
  role: GroupMemberRoleEnum,
  joinedAt: z.date(),
  updatedAt: z.date()
})

// Schema de adição de membro ao grupo
export const addGroupMemberSchema = z.object({
  memberId: z.string(),
  role: GroupMemberRoleEnum.default('MEMBER')
})

// Schema base do grupo
export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: GroupTypeEnum,
  meetingDay: z.string().nullable(),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
  location: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  members: z.array(groupMemberSchema)
})

const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/

// Schema base para criação e atualização
const baseGroupSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  type: GroupTypeEnum,
  meetingDay: z.string().optional(),
  startTime: z.string().regex(timeRegex, 'Formato inválido. Use HH:mm').optional(),
  endTime: z.string().regex(timeRegex, 'Formato inválido. Use HH:mm').optional(),
  location: z.string().optional(),
  members: z.array(addGroupMemberSchema).optional(),
})

// Validações comuns
const validateGroupTimes = (data: any) => {
  // Se tiver horário de início, deve ter horário de término
  if (data.startTime && !data.endTime) return false
  if (!data.startTime && data.endTime) return false
  
  // Se tiver horário, o início deve ser antes do fim
  if (data.startTime && data.endTime) {
    return data.startTime < data.endTime
  }
  
  return true
}

const validateGroupLocation = (data: any) => {
  // Se tiver horário, deve ter dia e local
  if (data.startTime || data.endTime) {
    return !!data.meetingDay && !!data.location
  }
  return true
}

// Schema de criação
export const createGroupSchema = baseGroupSchema.refine(
  validateGroupTimes,
  { message: "Horário de início deve ser anterior ao horário de término" }
).refine(
  validateGroupLocation,
  { message: "Para definir horários, informe também o dia e o local da reunião" }
)

// Schema de atualização (todos os campos são opcionais)
export const updateGroupSchema = baseGroupSchema.partial().refine(
  validateGroupTimes,
  { message: "Horário de início deve ser anterior ao horário de término" }
).refine(
  validateGroupLocation,
  { message: "Para definir horários, informe também o dia e o local da reunião" }
)

// Schema de listagem
export const listGroupsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  type: GroupTypeEnum.optional(),
  sortBy: GroupSortByEnum.default('name'),
  order: OrderEnum.default('asc')
})

// Schema de resposta paginada
export const paginatedGroupsSchema = z.object({
  data: z.array(groupSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean()
  })
})

// Schema de parâmetros
export const getGroupParamsSchema = z.object({
  id: z.string()
})

// Tipos gerados dos schemas
export type ListGroupsQuery = z.infer<typeof listGroupsQuerySchema>
export type CreateGroupInput = z.infer<typeof createGroupSchema>
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>
export type Group = z.infer<typeof groupSchema>
export type PaginatedGroups = z.infer<typeof paginatedGroupsSchema>
export type AddGroupMemberInput = z.infer<typeof addGroupMemberSchema>
