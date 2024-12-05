import { z } from 'zod'
import { paginationSchema, paginationMetaSchema, searchSchema, idSchema } from './shared'

// Enums
export const EventTypeEnum = z.enum(['SERVICE', 'CELL', 'MINISTRY', 'OTHER']).describe('Tipo do evento')
export const EventStatusEnum = z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).describe('Status do evento')
export const ParticipantStatusEnum = z.enum(['CONFIRMED', 'PENDING', 'CANCELLED']).describe('Status do participante')
export const EventSortByEnum = z.enum(['title', 'startDate', 'type', 'createdAt']).describe('Campo para ordenação')
export const OrderEnum = z.enum(['asc', 'desc']).describe('Direção da ordenação')

// Constantes
export const EVENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const

// Schema do participante
export const eventParticipantSchema = z.object({
  id: z.string().describe('ID do participante'),
  memberId: z.string().describe('ID do membro'),
  eventId: z.string().describe('ID do evento'),
  status: ParticipantStatusEnum,
  createdAt: z.coerce.date().describe('Data de criação'),
  member: z.object({
    id: z.string().describe('ID do membro'),
    name: z.string().describe('Nome do membro'),
    email: z.string().nullable().describe('Email do membro'),
    phone: z.string().nullable().describe('Telefone do membro'),
    image: z.string().nullable().describe('URL da imagem do membro')
  }).describe('Dados do membro')
}).describe('Participante do evento')

// Schema base do evento
export const eventSchema = z.object({
  id: z.string().describe('ID do evento'),
  title: z.string().describe('Título do evento'),
  description: z.string().nullable().describe('Descrição do evento'),
  startDate: z.coerce.date().describe('Data de início'),
  endDate: z.coerce.date().nullable().describe('Data de término'),
  type: EventTypeEnum,
  status: EventStatusEnum,
  location: z.string().nullable().describe('Local do evento'),
  createdAt: z.coerce.date().describe('Data de criação'),
  updatedAt: z.coerce.date().describe('Data de atualização'),
  participants: z.array(eventParticipantSchema).describe('Lista de participantes')
}).describe('Evento')

// Schema base para criação e atualização
const baseEventSchema = z.object({
  title: z.string().min(3).describe('Título do evento'),
  description: z.string().nullable().optional().describe('Descrição do evento'),
  startDate: z.coerce.date().describe('Data de início'),
  endDate: z.coerce.date().nullable().optional().describe('Data de término'),
  type: EventTypeEnum,
  status: EventStatusEnum.optional().default('SCHEDULED'),
  location: z.string().nullable().optional().describe('Local do evento'),
  participants: z.array(z.string()).optional().describe('IDs dos participantes')
}).describe('Dados base do evento')

// Validação de datas
const validateEventDates = (data: any) => {
  if (data.endDate && data.startDate > data.endDate) {
    return false
  }
  return true
}

// Schema de criação
export const createEventSchema = baseEventSchema
  .refine(validateEventDates, { 
    message: "Data de início deve ser anterior à data de término" 
  })
  .describe('Dados para criação de evento')

// Schema de atualização
export const updateEventSchema = baseEventSchema
  .partial()
  .refine(validateEventDates, { 
    message: "Data de início deve ser anterior à data de término" 
  })
  .describe('Dados para atualização de evento')

// Schema de listagem
export const listEventsSchema = z.object({
  ...paginationSchema.shape,
  ...searchSchema.shape,
  type: EventTypeEnum.optional().describe('Filtrar por tipo'),
  status: EventStatusEnum.optional().describe('Filtrar por status'),
  startDate: z.coerce.date().optional().describe('Filtrar por data de início'),
  endDate: z.coerce.date().optional().describe('Filtrar por data de término'),
  sortBy: EventSortByEnum.optional().default('startDate'),
  order: OrderEnum.optional().default('asc')
}).describe('Parâmetros de listagem de eventos')

// Schema de resposta paginada
export const paginatedEventsSchema = z.object({
  data: z.array(eventSchema),
  meta: paginationMetaSchema
}).describe('Resposta paginada de eventos')

// Schema de participante
export const participantSchema = z.object({
  ...idSchema.shape,
  status: ParticipantStatusEnum.optional().default('PENDING')
}).describe('Dados do participante')

// Tipos gerados dos schemas
export type Event = z.infer<typeof eventSchema>
export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type ListEventsQuery = z.infer<typeof listEventsSchema>
export type PaginatedEvents = z.infer<typeof paginatedEventsSchema>
export type EventParticipant = z.infer<typeof eventParticipantSchema>
