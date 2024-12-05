'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutGridIcon, LayoutListIcon, SearchIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"

interface MemberListFiltersProps {
  view: "grid" | "table"
  onViewChange: (view: "grid" | "table") => void
  onSearch: (search: string) => void
  onStatusChange: (status: "ACTIVE" | "INACTIVE" | null) => void
}

export function MemberListFilters({ 
  view, 
  onViewChange,
  onSearch,
  onStatusChange
}: MemberListFiltersProps) {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    onSearch(debouncedSearch)
  }, [debouncedSearch, onSearch])

  const handleStatusChange = useCallback((value: string) => {
    switch (value) {
      case "active":
        onStatusChange("ACTIVE")
        break
      case "inactive":
        onStatusChange("INACTIVE")
        break
      default:
        onStatusChange(null)
    }
  }, [onStatusChange])

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <div className="w-[280px]">
          <Input
            placeholder="Buscar membros..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<SearchIcon className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
        <Select defaultValue="all" onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={view === "table" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewChange("table")}
        >
          <LayoutListIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={view === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewChange("grid")}
        >
          <LayoutGridIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
