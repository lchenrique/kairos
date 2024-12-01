import { z } from 'zod'

// Enums como const para type safety
export const EVENT_TYPE = {
  SERVICE: 'SERVICE',
  CELL: 'CELL',
  MINISTRY: 'MINISTRY',
  OTHER: 'OTHER'
} as const

export const EVENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const

export const PARTICIPANT_STATUS = {
  CONFIRMED: 'CONFIRMED',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED'
} as const

// Types
export type EventType = typeof EVENT_TYPE[keyof typeof EVENT_TYPE]
export type EventStatus = typeof EVENT_STATUS[keyof typeof EVENT_STATUS]
export type ParticipantStatus = typeof PARTICIPANT_STATUS[keyof typeof PARTICIPANT_STATUS]

// Schema do participante
export const eventParticipantSchema = z.object({
  id: z.string(),
  memberId: z.string(),
  eventId: z.string(),
  status: z.string(),
  createdAt: z.date(),
  member: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    image: z.string().nullable()
  })
})

// Schema base do evento
export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  startDate: z.date(),
  endDate: z.date().nullable(),
  location: z.string().nullable(),
  type: z.string(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  participants: z.array(eventParticipantSchema).optional()
})

// Schema de criação
export const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  location: z.string().optional(),
  type: z.enum([EVENT_TYPE.SERVICE, EVENT_TYPE.CELL, EVENT_TYPE.MINISTRY, EVENT_TYPE.OTHER]),
  participants: z.array(z.string()).optional() // Array de IDs dos membros
})

// Schema de atualização
export const updateEventSchema = createEventSchema.partial()

// Schema de listagem
export const listEventsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  type: z.enum([EVENT_TYPE.SERVICE, EVENT_TYPE.CELL, EVENT_TYPE.MINISTRY, EVENT_TYPE.OTHER]).optional(),
  status: z.enum([EVENT_STATUS.SCHEDULED, EVENT_STATUS.IN_PROGRESS, EVENT_STATUS.COMPLETED, EVENT_STATUS.CANCELLED]).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional()
})

// Schema de resposta paginada
export const paginatedEventsSchema = z.object({
  items: z.array(eventSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  pages: z.number()
})

// Tipos gerados dos schemas
export type Event = z.infer<typeof eventSchema>
export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type ListEventsQuery = z.infer<typeof listEventsSchema>
export type PaginatedEvents = z.infer<typeof paginatedEventsSchema>
export type EventParticipant = z.infer<typeof eventParticipantSchema>
