"use client"

import { useState } from "react"
import { useListEvents } from "../../hooks/use-list-events"
import { EventListHeader } from "./header"
import { EventListFilters } from "./filters"
import { EventCard } from "../event-card"
import { EventDrawer } from "../event-drawer"
import { useDrawerStore } from "@/store/use-drawer-store"
import { DataGrid } from "@/components/ui/data-grid"
import { DataError } from "@/components/ui/data-error"
import { DataEmpty } from "@/components/ui/data-empty"
import { DataLoading } from "@/components/ui/data-loading"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { GetEvents200EventsItem } from "@/lib/api/generated/model"

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

export function EventList() {
  const [selectedEvent, setSelectedEvent] = useState<GetEvents200EventsItem>()
  const [view, setView] = useState<"grid" | "table">("grid")
  const { data: events, isLoading, error } = useListEvents()
  const openDrawer = useDrawerStore((state) => state.open)

  const handleEdit = (event: GetEvents200EventsItem) => {
    setSelectedEvent(event)
    openDrawer()
  }

  if (isLoading) {
    return <DataLoading />
  }

  if (error) {
    return <DataError />
  }

  if (!events?.length) {
    return <DataEmpty />
  }

  const columns = [
    {
      header: "Nome",
      accessorKey: "name",
    },
    {
      header: "Tipo",
      accessorKey: "type",
      cell: ({ row }) => eventTypes[row.original.type as keyof typeof eventTypes],
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status as keyof typeof eventStatus
        return eventStatus[status].label
      },
    },
    {
      header: "Data",
      accessorKey: "startDate",
      cell: ({ row }) => format(new Date(row.original.startDate), "dd/MM/yyyy", { locale: ptBR }),
    },
    {
      header: "Horário",
      accessorKey: "startTime",
      cell: ({ row }) => {
        const start = format(new Date(row.original.startDate), "HH:mm")
        const end = row.original.endDate 
          ? format(new Date(row.original.endDate), "HH:mm")
          : null
        return end ? `${start} até ${end}` : start
      },
    },
    {
      header: "Local",
      accessorKey: "location",
    },
  ]

  return (
    <div className="space-y-6">
      <EventListHeader />
      <EventListFilters view={view} onViewChange={setView} />

      {view === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
            >
              <EventCard event={event} onEdit={() => handleEdit(event)} />
            </div>
          ))}
        </div>
      ) : (
        <DataGrid
          data={events}
          columns={columns}
          onRowClick={(row) => handleEdit(row.original)}
        />
      )}

      <EventDrawer
        initialData={selectedEvent}
        id={selectedEvent?.id}
      />
    </div>
  )
}
