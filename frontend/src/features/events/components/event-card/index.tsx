"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, Users, Edit } from "lucide-react"
import type { GetEvents200EventsItem } from "@/lib/api/generated/model"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface EventCardProps {
  event: GetEvents200EventsItem
  onEdit?: () => void
}

const eventTypes = {
  WORSHIP: "Culto",
  PRAYER: "Oração",
  STUDY: "Estudo",
  FELLOWSHIP: "Comunhão",
  OTHER: "Outro",
}

const eventStatus = {
  SCHEDULED: { label: "Agendado", variant: "default" as const },
  IN_PROGRESS: { label: "Em andamento", variant: "warning" as const },
  COMPLETED: { label: "Concluído", variant: "success" as const },
  CANCELLED: { label: "Cancelado", variant: "destructive" as const },
}

export function EventCard({ event, onEdit }: EventCardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{event.name}</h2>
          {event.description && (
            <p className="text-muted-foreground">{event.description}</p>
          )}
        </div>
        {onEdit && (
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={eventStatus[event.status].variant}>
          {eventStatus[event.status].label}
        </Badge>
        <Badge variant="outline">{eventTypes[event.type]}</Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {format(new Date(event.startDate), "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {format(new Date(event.startDate), "HH:mm", {
                locale: ptBR,
              })}
              {event.endDate && (
                <> até {format(new Date(event.endDate), "HH:mm")}</>
              )}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{event.location}</span>
            </div>
          )}
          {event.organizer && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{event.organizer}</span>
            </div>
          )}
          {event.maxParticipants && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Máximo de {event.maxParticipants} participantes
              </span>
            </div>
          )}
        </div>

        {event.notes && (
          <div>
            <h3 className="mb-2 font-medium">Observações</h3>
            <p className="text-sm text-muted-foreground">{event.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
