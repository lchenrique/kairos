"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViewToggle } from "@/components/ui/view-toggle"
import { Search, X } from "lucide-react"

interface EventListFiltersProps {
  view: "grid" | "table"
  onViewChange: (view: "grid" | "table") => void
  search: string
  onSearch: (value: string) => void
  type: string
  onTypeChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  onClear: () => void
}

export function EventListFilters({ view, onViewChange, search, onSearch, type, onTypeChange, status, onStatusChange, onClear }: EventListFiltersProps) {
  return <div className="flex flex-col gap-3 rounded-xl border bg-card/70 p-3 sm:flex-row sm:items-center"><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar eventos" aria-label="Buscar eventos" className="h-10 bg-background pl-9" /></div><div className="flex flex-wrap items-center gap-2"><Select value={type} onValueChange={onTypeChange}><SelectTrigger className="h-10 w-[150px]" aria-label="Filtrar por tipo"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos os tipos</SelectItem><SelectItem value="SERVICE">Cultos</SelectItem><SelectItem value="CELL">Células</SelectItem><SelectItem value="MINISTRY">Ministérios</SelectItem><SelectItem value="OTHER">Outros</SelectItem></SelectContent></Select><Select value={status} onValueChange={onStatusChange}><SelectTrigger className="h-10 w-[150px]" aria-label="Filtrar por status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos os status</SelectItem><SelectItem value="SCHEDULED">Agendados</SelectItem><SelectItem value="IN_PROGRESS">Em andamento</SelectItem><SelectItem value="COMPLETED">Concluídos</SelectItem><SelectItem value="CANCELLED">Cancelados</SelectItem></SelectContent></Select>{search || type !== "all" || status !== "all" ? <Button variant="ghost" size="icon" onClick={onClear} aria-label="Limpar filtros"><X className="h-4 w-4" aria-hidden="true" /></Button> : null}<ViewToggle view={view} onChange={onViewChange} /></div></div>
}
