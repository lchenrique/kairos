"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useListEvents } from "../../hooks/use-list-events"
import { EventCard } from "../event-card"
import { EventForm } from "../event-drawer/form"
import { EventAttendanceManager } from "../event-attendance-manager"
import { getEventColumns } from "./columns"
import { PageHeader } from "@/components/shared/page-header"
import { ListShell } from "@/components/shared/list-shell"
import { ListToolbar } from "@/components/shared/list-toolbar"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, CalendarPlus } from "lucide-react"
import type { GetEvents200DataItem, GetEventsOrder, GetEventsSortBy, GetEventsStatus, GetEventsType } from "@/lib/api/generated/model"
import { hasPermission } from '@/lib/permissions'
import { useAuthStore } from '@/lib/stores/auth-store'

export function EventList() {
  const [view, setView] = useState<"grid" | "table">("grid")
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(view === "grid" ? 12 : 10)
  const open = useDrawerStore((state) => state.open)
  const searchParams = useSearchParams()
  const sortBy = (searchParams.get('sortBy') as GetEventsSortBy | null) ?? "startDate"
  const order = (searchParams.get('order') as GetEventsOrder | null) ?? "asc"
  const role = useAuthStore((state) => state.user?.role)
  const canManage = hasPermission(role, 'EVENTS_MANAGE')
  useEffect(() => {
    setPage(1)
    setLimit(view === "grid" ? 12 : 10)
  }, [search, type, status, view])
  const { data, isLoading, isError } = useListEvents({ page, limit, ...(search ? { search } : {}), ...(type !== "all" ? { type: type as GetEventsType } : {}), ...(status !== "all" ? { status: status as GetEventsStatus } : {}), sortBy, order })
  const events = data?.data ?? []
  const openCreate = useCallback(() => open({ title: "Novo evento", subtitle: "Planeje o próximo momento da sua comunidade.", content: <EventForm /> }), [open])
  const openEdit = (event: GetEvents200DataItem) => open({ title: "Editar evento", subtitle: event.title, content: <EventForm initialData={event} id={event.id} /> })
  const openAttendance = (event: GetEvents200DataItem) => open({ title: "Presença do evento", subtitle: event.title, content: <div className="px-6 py-4"><EventAttendanceManager event={event} /></div> })
  useEffect(() => {
    if (canManage && searchParams.get("new") === "1") openCreate()
  }, [canManage, searchParams, openCreate])
  const clear = () => { setSearch(""); setType("all"); setStatus("all") }
  const handlePageSizeChange = (pageSize: number) => { setLimit(pageSize); setPage(1) }

  const columns = getEventColumns({ onEdit: openEdit, onAttendance: openAttendance, canManage })

  return (
    <div className="space-y-6">
      <PageHeader
        routeName="Organizar"
        title="Eventos"
        subtitle="Planeje encontros, cultos e momentos importantes para sua igreja."
        breadcrumb={[{ label: "Organizar" }, { label: "Eventos" }]}
        variant="compact"
      >
        <Button variant="outline" asChild>
          <Link href="/calendar"><CalendarDays className="mr-2 h-4 w-4" aria-hidden="true" />Calendário</Link>
        </Button>
        {canManage && (
          <Button onClick={openCreate}>
            <CalendarPlus className="mr-2 h-4 w-4" aria-hidden="true" />
            Novo evento
          </Button>
        )}
      </PageHeader>

      <ListShell
        title="Lista de Eventos"
        description="Gerencie a agenda e os encontros da sua igreja"
        data={events}
        columns={columns}
        view={view}
        isLoading={isLoading}
        errorMessage={isError ? "Não foi possível carregar os eventos." : undefined}
        meta={{ currentPage: data?.meta.page ?? 1, totalPages: data?.meta.totalPages ?? 1, total: data?.meta.totalItems ?? 0, limit }}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        gridRenderItem={(event) => (
          <EventCard event={event} onEdit={canManage ? () => openEdit(event) : undefined} onAttendance={canManage ? () => openAttendance(event) : undefined} showParticipantCount={canManage} />
        )}
        toolbar={
          <ListToolbar
            view={view}
            onViewChange={setView}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Buscar eventos..."
            showClear={Boolean(search) || type !== "all" || status !== "all"}
            onClear={clear}
            filters={
              <>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-[180px]" aria-label="Filtrar por tipo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="SERVICE">Cultos</SelectItem>
                    <SelectItem value="CELL">Células</SelectItem>
                    <SelectItem value="MINISTRY">Ministérios</SelectItem>
                    <SelectItem value="OTHER">Outros</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[180px]" aria-label="Filtrar por status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="SCHEDULED">Agendados</SelectItem>
                    <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
                    <SelectItem value="COMPLETED">Concluídos</SelectItem>
                    <SelectItem value="CANCELLED">Cancelados</SelectItem>
                  </SelectContent>
                </Select>
              </>
            }
          />
        }
      />
    </div>
  )
}
