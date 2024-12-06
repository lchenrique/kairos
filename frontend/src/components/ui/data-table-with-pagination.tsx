'use client'

import { ColumnDef, SortingState } from "@tanstack/react-table"
import { DataTable } from "./data-table"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

interface DataTableWithPaginationProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  meta?: {
    currentPage: number
    totalPages: number
    total: number
    limit: number
  }
}

export function DataTableWithPagination<TData, TValue>({
  columns,
  data,
  meta,
}: DataTableWithPaginationProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSortingChange = (sorting: SortingState) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (sorting.length > 0) {
      const [{ id, desc }] = sorting
      params.set('sortBy', id)
      params.set('order', desc ? 'desc' : 'asc')
    } else {
      params.delete('sortBy')
      params.delete('order')
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const initialSorting: SortingState = (() => {
    const sortBy = searchParams.get('sortBy')
    const order = searchParams.get('order')
    if (sortBy && order) {
      return [{ id: sortBy, desc: order === 'desc' }]
    }
    return []
  })()

  if (!meta) {
    console.warn('No meta provided for DataTableWithPagination')
    return (
      <DataTable
        columns={columns}
        data={data}
        pageSize={10}
        initialSorting={initialSorting}
        onSortingChange={handleSortingChange}
      />
    )
  }

  const defaultMeta = {
    currentPage: 1,
    totalPages: 1,
    total: data.length,
    limit: 10
  }

  const tableMeta = meta || defaultMeta

  console.log('DataTableWithPagination render:', {
    dataLength: data.length,
    columns: columns.length,
    meta: tableMeta
  })

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data}
        pageSize={meta?.limit}
        initialSorting={initialSorting}
        onSortingChange={handleSortingChange}
      />
    </div>
  )
}
