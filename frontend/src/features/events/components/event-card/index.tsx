"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, CheckCircle2, Clock3, Edit, MapPin, UsersRound } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { GetEvents200DataItem } from "@/lib/api/generated/model"

interface EventCardProps { event: GetEvents200DataItem; onEdit?: () => void; onAttendance?: () => void; showParticipantCount?: boolean }

const eventTypes: Record<GetEvents200DataItem["type"], string> = { SERVICE: "Culto", CELL: "Célula", MINISTRY: "Ministério", OTHER: "Outro" }
const eventStatus: Record<GetEvents200DataItem["status"], { label: string; variant: "default" | "secondary" | "destructive" | "success" }> = {
  SCHEDULED: { label: "Agendado", variant: "default" }, IN_PROGRESS: { label: "Em andamento", variant: "secondary" }, COMPLETED: { label: "Concluído", variant: "success" }, CANCELLED: { label: "Cancelado", variant: "destructive" },
}

export function EventCard({ event, onEdit, onAttendance, showParticipantCount = true }: EventCardProps) {
  const start = new Date(event.startDate)
  return <Card className="h-full"><CardHeader className="flex flex-row items-start justify-between gap-3"><div className="min-w-0"><CardTitle className="truncate text-lg">{event.title}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{eventTypes[event.type]}</p></div>{onEdit && <Button variant="ghost" size="icon" onClick={onEdit} aria-label={`Editar ${event.title}`}><Edit className="h-4 w-4" aria-hidden="true" /></Button>}</CardHeader><CardContent className="space-y-4"><div className="flex flex-wrap gap-2"><Badge variant={eventStatus[event.status].variant}>{eventStatus[event.status].label}</Badge><Badge variant="outline">{eventTypes[event.type]}</Badge></div><div className="space-y-2 text-sm text-muted-foreground"><div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" aria-hidden="true" />{format(start, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</div><div className="flex items-center gap-2"><Clock3 className="h-4 w-4" aria-hidden="true" />{format(start, "HH:mm")}{event.endDate && ` até ${format(new Date(event.endDate), "HH:mm")}`}</div>{event.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" />{event.location}</div>}{showParticipantCount && <div className="flex items-center gap-2"><UsersRound className="h-4 w-4" aria-hidden="true" />{event.participants.length} participantes</div>}</div>{event.description && <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>}{onAttendance && <Button variant="outline" className="w-full" onClick={onAttendance}><CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />Gerenciar presença</Button>}</CardContent></Card>
}
