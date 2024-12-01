import { useState } from "react"

interface UseSelectionProps<T> {
  items?: T[]
  getId: (item: T) => string
}

export function useSelection<T>({ items = [], getId }: UseSelectionProps<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(items.map(getId))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const clearSelection = () => {
    setSelectedIds([])
  }

  return {
    selectedIds,
    toggleSelectAll,
    toggleSelect,
    clearSelection,
    isAllSelected: items.length > 0 && selectedIds.length === items.length,
    hasSelection: selectedIds.length > 0,
  }
}
