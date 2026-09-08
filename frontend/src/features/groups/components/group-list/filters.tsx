"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViewToggle } from "@/components/ui/view-toggle"
import { Search, SlidersHorizontal, X } from "lucide-react"

interface GroupListFiltersProps {
  view: "grid" | "table"
  onViewChange: (view: "grid" | "table") => void
  search: string
  onSearch: (search: string) => void
  type: string
  onTypeChange: (type: string) => void
  onClear: () => void
}

export function GroupListFilters({ view, onViewChange, search, onSearch, type, onTypeChange, onClear }: GroupListFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card/70 p-3 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar por nome ou descrição" aria-label="Buscar grupos" className="h-10 bg-background pl-9" />
      </div>
      <div className="flex items-center gap-2">
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger className="h-10 w-full bg-background sm:w-[170px]" aria-label="Filtrar por tipo">
            <SlidersHorizontal className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="CELL">Células</SelectItem>
            <SelectItem value="MINISTRY">Ministérios</SelectItem>
            <SelectItem value="DEPARTMENT">Departamentos</SelectItem>
            <SelectItem value="OTHER">Outros</SelectItem>
          </SelectContent>
        </Select>
        {search || type !== "all" ? (
          <Button variant="ghost" size="icon" onClick={onClear} aria-label="Limpar filtros" title="Limpar filtros">
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : null}
        <ViewToggle view={view} onChange={onViewChange} className="h-10" />
      </div>
    </div>
  )
}
