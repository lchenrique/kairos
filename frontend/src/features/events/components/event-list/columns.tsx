"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { CalendarDays, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import type { GetEvents200DataItem } from "@/lib/api/generated/model"
import { useDeleteEvent } from "../../hooks/use-delete-event"

export function EventActions({ event, onEdit, onAttendance }: { event: GetEvents200DataItem; onEdit: () => void; onAttendance: () => void }) {
  const { mutate: deleteEvent, isPending } = useDeleteEvent(event.id)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Ações de ${event.title}`}><MoreHorizontal className="h-4 w-4" aria-hidden="true" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onAttendance}><CalendarDays className="mr-2 h-4 w-4" aria-hidden="true" />Gerenciar presença</DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}><Pencil className="mr-2 h-4 w-4" aria-hidden="true" />Editar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isPending} className="text-destructive focus:text-destructive" onClick={() => window.confirm(`Excluir o evento “${event.title}”?`) && deleteEvent()}><Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />Excluir</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface EventColumnsOptions {
  onEdit: (event: GetEvents200DataItem) => void
  onAttendance: (event: GetEvents200DataItem) => void
  canManage: boolean
}

export function getEventColumns({ onEdit, onAttendance, canManage }: EventColumnsOptions): ColumnDef<GetEvents200DataItem>[] {
  const columns: ColumnDef<GetEvents200DataItem>[] = [
    {
      accessorKey: "title",
      header: "Evento",
      enableSorting: true,
      cell: ({ row }) => {
        const event = row.original
        return (
          <div>
            <p className="font-medium">{event.title}</p>
            <p className="text-xs text-muted-foreground">{event.type}</p>
          </div>
        )
      },
    },
    {
      id: "startDate",
      header: "Data",
      enableSorting: true,
      cell: ({ row }) => <span className="text-muted-foreground">{new Date(row.original.startDate).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</span>,
    },
    {
      accessorKey: "location",
      header: "Local",
      enableSorting: false,
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.location || "—"}</span>,
    },
  ]

  if (canManage) {
    columns.push({
      id: "actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-right">
          <EventActions event={row.original} onEdit={() => onEdit(row.original)} onAttendance={() => onAttendance(row.original)} />
        </div>
      ),
    })
  }

  return columns
}
