export type Event = {
  id: string
  name: string
  description?: string
  type: 'WORSHIP' | 'PRAYER' | 'STUDY' | 'FELLOWSHIP' | 'OTHER'
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  startDate: string
  endDate?: string
  location?: string
  organizer?: string
  maxParticipants?: number
  createdAt: string
  updatedAt: string
}

export type GetEventsResponse = {
  events: Event[]
  total: number
  page: number
  pageSize: number
}

export type GetEvents200EventsItem = Event
