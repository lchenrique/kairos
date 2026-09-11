"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ViewList } from "@/components/ui/view-list"

export type ListViewMode = "grid" | "table"

export interface ListShellMeta {
  currentPage: number
  totalPages: number
  total: number
  limit: number
}

export interface ListShellProps<T extends { id: string }> {
  title: string
  description?: string
  data: T[]
  columns?: any[]
  view: ListViewMode
  isLoading?: boolean
  meta: ListShellMeta
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  gridRenderItem?: (item: T, index: number) => ReactNode
  /** Normalmente um <ListToolbar />. */
  toolbar: ReactNode
  errorMessage?: string
}

export function ListShell<T extends { id: string }>({
  title,
  description,
  data,
  columns,
  view,
  isLoading,
  meta,
  onPageChange,
  onPageSizeChange,
  gridRenderItem,
  toolbar,
  errorMessage,
}: ListShellProps<T>) {
  return (
    <Card>
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {toolbar}
        {errorMessage && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {errorMessage}
          </div>
        )}
        <div className="mt-4">
          <ViewList
            data={data}
            columns={columns}
            view={view}
            isLoading={isLoading}
            meta={meta}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            gridCardRenderItem={gridRenderItem}
          />
        </div>
      </CardContent>
    </Card>
  )
}
