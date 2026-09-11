"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useListEvents } from "../../hooks/use-list-events"
import { EventListHeader } from "./header"
import { EventListFilters } from "./filters"
import { EventCard } from "../event-card"
import { EventForm } from "../event-drawer/form"
import { EventAttendanceManager } from "../event-attendance-manager"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import { PaginationWithInfo } from "@/components/ui/pagination-with-info"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CalendarDays, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import type { GetEvents200DataItem, GetEventsSortBy, GetEventsStatus, GetEventsType } from "@/lib/api/generated/model"
import { useDeleteEvent } from "../../hooks/use-delete-event"
import { hasPermission } from '@/lib/permissions'
import { useAuthStore } from '@/lib/stores/auth-store'

function EventActions({ event, onEdit, onAttendance }: { event: GetEvents200DataItem; onEdit: () => void; onAttendance: () => void }) {
  const { mutate: deleteEvent, isPending } = useDeleteEvent(event.id)
  return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Ações de ${event.title}`}><MoreHorizontal className="h-4 w-4" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={onAttendance}><CalendarDays className="mr-2 h-4 w-4" aria-hidden="true" />Gerenciar presença</DropdownMenuItem><DropdownMenuItem onClick={onEdit}><Pencil className="mr-2 h-4 w-4" aria-hidden="true" />Editar</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem disabled={isPending} className="text-destructive focus:text-destructive" onClick={() => window.confirm(`Excluir o evento “${event.title}”?`) && deleteEvent()}><Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />Excluir</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
}

export function EventList() {
  const [view, setView] = useState<"grid" | "table">("grid")
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const limit = view === "grid" ? 9 : 10
  const open = useDrawerStore((state) => state.open)
  const searchParams = useSearchParams()
  const role = useAuthStore((state) => state.user?.role)
  const canManage = hasPermission(role, 'EVENTS_MANAGE')
  useEffect(() => setPage(1), [search, type, status, view])
  const { data, isLoading, isError } = useListEvents({ page, limit, ...(search ? { search } : {}), ...(type !== "all" ? { type: type as GetEventsType } : {}), ...(status !== "all" ? { status: status as GetEventsStatus } : {}), sortBy: "startDate" as GetEventsSortBy, order: "asc" })
  const events = data?.data ?? []
  const openCreate = useCallback(() => open({ title: "Novo evento", subtitle: "Planeje o próximo momento da sua comunidade.", content: <EventForm /> }), [open])
  const openEdit = (event: GetEvents200DataItem) => open({ title: "Editar evento", subtitle: event.title, content: <EventForm initialData={event} id={event.id} /> })
  const openAttendance = (event: GetEvents200DataItem) => open({ title: "Presença do evento", subtitle: event.title, content: <div className="px-6 py-4"><EventAttendanceManager event={event} /></div> })
  useEffect(() => {
    if (canManage && searchParams.get("new") === "1") openCreate()
  }, [canManage, searchParams, openCreate])
  const clear = () => { setSearch(""); setType("all"); setStatus("all") }

  return <div className="space-y-6"><EventListHeader total={data?.meta.totalItems ?? 0} onCreate={canManage ? openCreate : undefined} />{isError && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">Não foi possível carregar os eventos.</div>}<EventListFilters view={view} onViewChange={setView} search={search} onSearch={setSearch} type={type} onTypeChange={setType} status={status} onStatusChange={setStatus} onClear={clear} />{isLoading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <Card key={index} className="h-56 animate-pulse" />)}</div> : !events.length ? <Card className="border-dashed"><CardContent className="flex flex-col items-center py-16 text-center"><CalendarDays className="mb-4 h-10 w-10 text-muted-foreground/50" aria-hidden="true" /><CardTitle className="text-lg">Nenhum evento encontrado</CardTitle><p className="mt-2 text-sm text-muted-foreground">{canManage ? "Crie um evento ou ajuste os filtros para continuar." : "Ajuste os filtros para consultar a agenda."}</p></CardContent></Card> : view === "grid" ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{events.map((event) => <EventCard key={event.id} event={event} onEdit={canManage ? () => openEdit(event) : undefined} onAttendance={canManage ? () => openAttendance(event) : undefined} showParticipantCount={canManage} />)}</div> : <div className="overflow-x-auto rounded-xl border bg-card"><table className="w-full text-sm"><thead className="bg-muted/30 text-left"><tr><th className="px-4 py-3 font-medium">Evento</th><th className="px-4 py-3 font-medium">Data</th><th className="px-4 py-3 font-medium">Local</th>{canManage && <th className="px-4 py-3"><span className="sr-only">Ações</span></th>}</tr></thead><tbody>{events.map((event) => <tr key={event.id} className="border-t"><td className="px-4 py-4"><p className="font-medium">{event.title}</p><p className="text-xs text-muted-foreground">{event.type}</p></td><td className="px-4 py-4 text-muted-foreground">{new Date(event.startDate).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</td><td className="px-4 py-4 text-muted-foreground">{event.location || "—"}</td>{canManage && <td className="px-4 py-4 text-right"><EventActions event={event} onEdit={() => openEdit(event)} onAttendance={() => openAttendance(event)} /></td>}</tr>)}</tbody></table></div>}{data?.meta && <PaginationWithInfo currentPage={data.meta.page} totalPages={data.meta.totalPages} pageSize={limit} total={data.meta.totalItems} onPageChange={setPage} onPageSizeChange={() => undefined} view={view} />}</div>
}
