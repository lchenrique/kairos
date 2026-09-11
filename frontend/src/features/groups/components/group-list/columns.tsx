"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { CalendarDays, Clock3, MapPin, MoreHorizontal, Pencil, Trash2, UsersRound } from "lucide-react"
import type { GetGroups200DataItem } from "@/lib/api/generated/model"
import { useDeleteGroup } from "../../hooks/use-delete-group"

const typeLabels: Record<GetGroups200DataItem["type"], string> = {
  CELL: "Célula",
  MINISTRY: "Ministério",
  DEPARTMENT: "Departamento",
  OTHER: "Outro",
}

export function GroupRowActions({ group, onView, onEdit, canManage }: { group: GetGroups200DataItem; onView: () => void; onEdit: () => void; canManage: boolean }) {
  const { mutate: deleteGroup, isPending } = useDeleteGroup(group.id)

  const handleDelete = () => {
    if (window.confirm(`Excluir o grupo “${group.name}”?`)) deleteGroup()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Ações de ${group.name}`}>
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onView}>Ver detalhes</DropdownMenuItem>
        {canManage && (
          <>
            <DropdownMenuItem onClick={onEdit}><Pencil className="mr-2 h-4 w-4" aria-hidden="true" />Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={isPending} onClick={handleDelete} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />Excluir</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function GroupMeta({ group, showMemberCount }: { group: GetGroups200DataItem; showMemberCount: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
      {group.meetingDay && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" aria-hidden="true" />{group.meetingDay}</span>}
      {group.startTime && <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" aria-hidden="true" />{group.startTime}{group.endTime ? `–${group.endTime}` : ""}</span>}
      {group.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" aria-hidden="true" />{group.location}</span>}
      {showMemberCount && <span className="inline-flex items-center gap-1.5"><UsersRound className="h-4 w-4" aria-hidden="true" />{group.members.length}</span>}
    </div>
  )
}

interface GroupColumnsOptions {
  onView: (group: GetGroups200DataItem) => void
  onEdit: (group: GetGroups200DataItem) => void
  canManage: boolean
}

export function getGroupColumns({ onView, onEdit, canManage }: GroupColumnsOptions): ColumnDef<GetGroups200DataItem>[] {
  return [
    {
      accessorKey: "name",
      header: "Grupo",
      enableSorting: true,
      cell: ({ row }) => {
        const group = row.original
        return (
          <button type="button" className="text-left" onClick={() => onView(group)}>
            <span className="font-medium transition-colors hover:text-primary">{group.name}</span>
            <span className="mt-1 block max-w-[280px] truncate text-xs text-muted-foreground">{group.description || "Sem descrição"}</span>
          </button>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Tipo",
      enableSorting: true,
      cell: ({ row }) => <Badge variant="secondary">{typeLabels[row.original.type]}</Badge>,
    },
    {
      id: "meeting",
      header: "Encontro",
      enableSorting: false,
      cell: ({ row }) => <GroupMeta group={row.original} showMemberCount={canManage} />,
    },
    {
      id: "actions",
      enableSorting: false,
      cell: ({ row }) => (
        <GroupRowActions group={row.original} onView={() => onView(row.original)} onEdit={() => onEdit(row.original)} canManage={canManage} />
      ),
    },
  ]
}
