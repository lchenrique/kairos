"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"
import { ViewToggle } from "@/components/ui/view-toggle"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"

export interface FilterOption {
  id: string
  label: string
  type: "select" | "switch"
  options?: Array<{
    value: string
    label: string
  }>
}

interface DataFiltersProps {
  title: string
  description: string
  searchPlaceholder: string
  filters: FilterOption[]
  values: Record<string, any>
  onSearch: (value: string) => void
  onFilterChange: (key: string, value: any) => void
  view?: "grid" | "table"
  onViewChange?: (view: "grid" | "table") => void
  onClearFilters?: () => void
}

export function DataFilters({
  title,
  description,
  searchPlaceholder,
  filters,
  values,
  onSearch,
  onFilterChange,
  view,
  onViewChange,
  onClearFilters,
}: DataFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2 flex-1 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder={searchPlaceholder}
            className="h-10 border-border/70 bg-background/60 pl-9"
            value={values.search || ""}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex h-full w-[400px] flex-col gap-0 overflow-hidden p-0 sm:w-[540px]"
          >
            <SheetHeader className="shrink-0 border-b px-6 py-4 pr-12">
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>
                {description}
              </SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto scrollbar-system px-6 py-6">
              {filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  {filter.type === "select" ? (
                    <>
                      <Label>{filter.label}</Label>
                      <Select
                        value={values[filter.id] || "all"}
                        onValueChange={(value) => onFilterChange(filter.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Selecione ${filter.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {filter.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  ) : filter.type === "switch" && (
                    <div className="flex items-center justify-between">
                      <Label htmlFor={filter.id} className="text-sm">{filter.label}</Label>
                      <Switch
                        id={filter.id}
                        checked={values[filter.id] || false}
                        onCheckedChange={(checked) => onFilterChange(filter.id, checked)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {onClearFilters && (
              <SheetFooter className="shrink-0 border-t px-6 py-4">
                <Button
                  variant="outline"
                  onClick={onClearFilters}
                  className="w-full sm:w-auto"
                >
                  Limpar Filtros
                </Button>
              </SheetFooter>
            )}
          </SheetContent>
        </Sheet>

        {view && onViewChange && (
          <ViewToggle view={view} onChange={onViewChange} className="h-10" />
        )}
      </div>
    </div>
  )
}
