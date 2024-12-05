"use client"

import { DataFilters, FilterOption } from "@/components/ui/data-filters"
import { useCallback } from "react"

interface GroupListFiltersProps {
  view: "grid" | "table"
  onViewChange: (view: "grid" | "table") => void
}

const groupFilters: FilterOption[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Ativos" },
      { value: "inactive", label: "Inativos" },
    ]
  },
  {
    id: "meetingDay",
    label: "Dia da reunião",
    type: "select",
    options: [
      { value: "segunda", label: "Segunda-feira" },
      { value: "terca", label: "Terça-feira" },
      { value: "quarta", label: "Quarta-feira" },
      { value: "quinta", label: "Quinta-feira" },
      { value: "sexta", label: "Sexta-feira" },
      { value: "sabado", label: "Sábado" },
      { value: "domingo", label: "Domingo" },
    ]
  }
]

export function GroupListFilters({ view, onViewChange }: GroupListFiltersProps) {
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
      description="Filtre os grupos por diferentes critérios"
      searchPlaceholder="Buscar grupos..."
      filters={groupFilters}
      values={{}}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      view={view}
      onViewChange={onViewChange}
    />
  )
}
