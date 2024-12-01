"use client"

import { DataFilters, FilterOption } from "@/components/ui/data-filters"
import { useCallback } from "react"

interface MembersFiltersProps {
  view: "grid" | "table"
  onViewChange: (view: "grid" | "table") => void
}

const memberFilters: FilterOption[] = [
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
    id: "group",
    label: "Grupo",
    type: "select",
    options: [
      { value: "jovens", label: "Jovens" },
      { value: "louvor", label: "Louvor" },
      { value: "lideranca", label: "Liderança" },
    ]
  },
  {
    id: "batizados",
    label: "Apenas batizados",
    type: "switch"
  },
  {
    id: "dizimistas",
    label: "Apenas dizimistas",
    type: "switch"
  },
  {
    id: "aniversariantes",
    label: "Aniversariantes do mês",
    type: "switch"
  }
]

export function MembersFilters({ view, onViewChange }: MembersFiltersProps) {
  // TODO: Integrar com o estado global quando for criado
  const handleSearch = useCallback((search: string) => {
    console.log("Search:", search)
  }, [])

  const handleFilterChange = useCallback((key: string, value: any) => {
    console.log("Filter change:", key, value)
  }, [])

  const handleClearFilters = useCallback(() => {
    console.log("Clear filters")
  }, [])

  return (
    <DataFilters
      title="Filtros"
      description="Aplique filtros para refinar sua busca"
      searchPlaceholder="Buscar membros..."
      filters={memberFilters}
      values={{}}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      view={view}
      onViewChange={onViewChange}
      onClearFilters={handleClearFilters}
    />
  )
}