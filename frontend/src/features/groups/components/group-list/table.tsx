"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CalendarDays, Clock3, MapPin, MoreHorizontal, Pencil, Trash2, UsersRound } from "lucide-react"
import { useState } from "react"
import type { GetGroups200DataItem } from "@/lib/api/generated/model"
import { useDeleteGroup } from "../../hooks/use-delete-group"

interface GroupListTableProps {
  groups: GetGroups200DataItem[]
  isLoading?: boolean
  view: "grid" | "table"
  onView: (group: GetGroups200DataItem) => void
  onEdit: (group: GetGroups200DataItem) => void
  canManage: boolean
}

const typeLabels: Record<GetGroups200DataItem["type"], string> = {
  CELL: "Célula",
  MINISTRY: "Ministério",
  DEPARTMENT: "Departamento",
  OTHER: "Outro",
}

function GroupRowActions({ group, onView, onEdit, canManage }: { group: GetGroups200DataItem; onView: () => void; onEdit: () => void; canManage: boolean }) {
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

function GroupMeta({ group, showMemberCount }: { group: GetGroups200DataItem; showMemberCount: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
      {group.meetingDay && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" aria-hidden="true" />{group.meetingDay}</span>}
      {group.startTime && <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" aria-hidden="true" />{group.startTime}{group.endTime ? `–${group.endTime}` : ""}</span>}
      {group.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" aria-hidden="true" />{group.location}</span>}
      {showMemberCount && <span className="inline-flex items-center gap-1.5"><UsersRound className="h-4 w-4" aria-hidden="true" />{group.members.length}</span>}
    </div>
  )
}

export function GroupListTable({ groups, isLoading, view, onView, onEdit, canManage }: GroupListTableProps) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  if (isLoading) {
    return (
      <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "space-y-3"}>
        {Array.from({ length: view === "grid" ? 6 : 5 }).map((_, index) => (
          <Card key={index} className="overflow-hidden"><CardHeader className="space-y-3"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /></CardContent></Card>
        ))}
      </div>
    )
  }

  if (!groups.length) {
    return <Card className="border-dashed"><CardContent className="flex flex-col items-center justify-center py-16 text-center"><UsersRound className="mb-4 h-10 w-10 text-muted-foreground/50" aria-hidden="true" /><CardTitle className="text-lg">Nenhum grupo encontrado</CardTitle><p className="mt-2 text-sm text-muted-foreground">Ajuste os filtros ou crie o primeiro grupo da sua igreja.</p></CardContent></Card>
  }

  if (view === "grid") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id} className="group relative overflow-hidden transition-shadow hover:shadow-md">
            <CardHeader className="pb-3"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><CardTitle className="truncate text-lg">{group.name}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{typeLabels[group.type]}</p></div><GroupRowActions group={group} onView={() => onView(group)} onEdit={() => onEdit(group)} canManage={canManage} /></div></CardHeader>
            <CardContent className="space-y-4"><p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">{group.description || "Sem descrição cadastrada."}</p><GroupMeta group={group} showMemberCount={canManage} /><Button variant="secondary" className="w-full" onClick={() => onView(group)}>Ver detalhes</Button></CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const allSelected = groups.length > 0 && selectedGroups.length === groups.length

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table>
        <TableHeader><TableRow className="bg-muted/30"><TableHead className="w-12"><Checkbox checked={allSelected} onCheckedChange={(checked) => setSelectedGroups(checked ? groups.map((group) => group.id) : [])} aria-label="Selecionar todos os grupos" /></TableHead><TableHead>Grupo</TableHead><TableHead>Tipo</TableHead><TableHead>Encontro</TableHead><TableHead className="w-16"><span className="sr-only">Ações</span></TableHead></TableRow></TableHeader>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id} className="group">
              <TableCell><Checkbox checked={selectedGroups.includes(group.id)} onCheckedChange={(checked) => setSelectedGroups((current) => checked ? [...current, group.id] : current.filter((id) => id !== group.id))} aria-label={`Selecionar ${group.name}`} /></TableCell>
              <TableCell><button type="button" className="text-left" onClick={() => onView(group)}><span className="font-medium transition-colors group-hover:text-primary">{group.name}</span><span className="mt-1 block max-w-[280px] truncate text-xs text-muted-foreground">{group.description || "Sem descrição"}</span></button></TableCell>
              <TableCell><Badge variant="secondary">{typeLabels[group.type]}</Badge></TableCell>
              <TableCell><GroupMeta group={group} showMemberCount={canManage} /></TableCell>
              <TableCell><GroupRowActions group={group} onView={() => onView(group)} onEdit={() => onEdit(group)} canManage={canManage} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
