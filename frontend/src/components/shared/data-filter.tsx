"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Filter {
  label: string
  value: string
}

interface DataFilterProps {
  placeholder?: string
  filters: Filter[]
  onSearchChange?: (value: string) => void
  onFilterChange?: (value: string) => void
}

export function DataFilter({
  placeholder = "Buscar...",
  filters,
  onSearchChange,
  onFilterChange,
}: DataFilterProps) {
  const [search, setSearch] = useState("")
  const [selectedFilter, setSelectedFilter] = useState(filters[0]?.value || "")

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onSearchChange?.(value)
  }

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value)
    onFilterChange?.(value)
  }

  return (
    <div className="flex w-full gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={selectedFilter} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          {filters.map((filter) => (
            <SelectItem key={filter.value} value={filter.value}>
              {filter.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
