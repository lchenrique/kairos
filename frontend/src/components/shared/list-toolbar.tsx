"use client"

import type { ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LayoutGridIcon, LayoutListIcon, SearchIcon, X } from "lucide-react"

export type ListViewMode = "grid" | "table"

export interface ListToolbarProps {
  /** Valor controlado da busca. O debounce fica a cargo do chamador. */
  search: string
  onSearch: (value: string) => void
  searchPlaceholder?: string
  view: ListViewMode
  onViewChange?: (view: ListViewMode) => void
  /** Selects e filtros extras renderizados ao lado da busca. */
  filters?: ReactNode
  showClear?: boolean
  onClear?: () => void
}

export function ListToolbar({
  search,
  onSearch,
  searchPlaceholder = "Buscar...",
  view,
  onViewChange,
  filters,
  showClear,
  onClear,
}: ListToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <div className="w-[280px]">
          <Input
            placeholder={searchPlaceholder}
            className="pl-8"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            startIcon={<SearchIcon className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
        {filters}
      </div>

      <div className="flex items-center gap-2">
        {showClear && onClear && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            aria-label="Limpar filtros"
            title="Limpar filtros"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
        <Button
          variant={view === "table" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewChange?.("table")}
          aria-label="Visualizar em tabela"
          aria-pressed={view === "table"}
        >
          <LayoutListIcon className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          variant={view === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewChange?.("grid")}
          aria-label="Visualizar em grade"
          aria-pressed={view === "grid"}
        >
          <LayoutGridIcon className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
