"use client"

import { DataFilters, FilterOption } from "@/components/ui/data-filters"
import { useCallback } from "react"

interface EventListFiltersProps {
  view: "grid" | "table"
  onViewChange: (view: "grid" | "table") => void
}

const eventFilters: FilterOption[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "SCHEDULED", label: "Agendados" },
      { value: "IN_PROGRESS", label: "Em andamento" },
      { value: "COMPLETED", label: "Concluídos" },
      { value: "CANCELLED", label: "Cancelados" },
    ]
  },
  {
    id: "type",
    label: "Tipo",
    type: "select",
    options: [
      { value: "WORSHIP", label: "Culto" },
      { value: "PRAYER", label: "Oração" },
      { value: "STUDY", label: "Estudo" },
      { value: "FELLOWSHIP", label: "Comunhão" },
      { value: "OTHER", label: "Outro" },
    ]
  },
  {
    id: "upcoming",
    label: "Apenas próximos eventos",
    type: "switch"
  }
]

export function EventListFilters({ view, onViewChange }: EventListFiltersProps) {
  const handleSearch = useCallback((search: string) => {
    console.log("Search:", search)
  }, [])

  const handleFilterChange = useCallback((key: string, value: any) => {
    console.log("Filter changed:", key, value)
  }, [])

  const handleClearFilters = useCallback(() => {
    console.log("Clear filters")
  }, [])

  return (
    <DataFilters
      title="Filtros"
      description="Filtre os eventos por diferentes critérios"
      searchPlaceholder="Buscar eventos..."
      filters={eventFilters}
      values={{}}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      view={view}
      onViewChange={onViewChange}
    />
  )
}
