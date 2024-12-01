"use client"

import { DataFilters, FilterOption } from "@/components/ui/data-filters"
import { useGroupsStore } from "@/store/groups"
import { GroupFilters, GroupType, GroupStatus, GroupMeetingDay } from "@/types/group"
import { useCallback } from "react"

interface GroupsFiltersProps {
  view: "grid" | "table"
  onViewChange: (view: "grid" | "table") => void
}

const groupFilters: FilterOption[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "active", label: "Ativos" },
      { value: "inactive", label: "Inativos" },
    ]
  },
  {
    id: "type",
    label: "Tipo",
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "ministry", label: "Ministério" },
      { value: "small-group", label: "Pequeno Grupo" },
      { value: "department", label: "Departamento" },
    ]
  },
  {
    id: "meetingDay",
    label: "Dia de Reunião",
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "sunday", label: "Domingo" },
      { value: "monday", label: "Segunda-feira" },
      { value: "tuesday", label: "Terça-feira" },
      { value: "wednesday", label: "Quarta-feira" },
      { value: "thursday", label: "Quinta-feira" },
      { value: "friday", label: "Sexta-feira" },
      { value: "saturday", label: "Sábado" },
    ]
  },
  {
    id: "hasLeader",
    label: "Apenas grupos com líder",
    type: "switch"
  },
  {
    id: "hasMembers",
    label: "Apenas grupos com membros",
    type: "switch"
  },
  {
    id: "meetingToday",
    label: "Reunião hoje",
    type: "switch"
  }
]

export function GroupsFilters({ view, onViewChange }: GroupsFiltersProps) {
  const { filters, setFilters } = useGroupsStore()

  const handleSearch = useCallback((search: string) => {
    setFilters({ ...filters, search })
  }, [filters, setFilters])

  const handleFilterChange = useCallback((key: string, value: any) => {
    if (value === "all") {
      const newFilters = { ...filters }
      delete newFilters[key]
      setFilters(newFilters)
    } else {
      setFilters({ ...filters, [key]: value })
    }
  }, [filters, setFilters])

  const handleClearFilters = useCallback(() => {
    setFilters({})
  }, [setFilters])

  return (
    <DataFilters
      title="Filtros"
      description="Aplique filtros para refinar sua busca"
      searchPlaceholder="Buscar grupos..."
      filters={groupFilters}
      values={filters}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      view={view}
      onViewChange={onViewChange}
      onClearFilters={handleClearFilters}
    />
  )
}