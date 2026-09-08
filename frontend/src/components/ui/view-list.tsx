'use client'

import { DataTableWithPagination } from "./data-table-with-pagination"
import { GridWithPagination } from "./grid-with-pagination"
import { Skeleton } from "./skeleton"
import { PaginationWithInfo } from "./pagination-with-info"
import { Card, CardHeader, CardContent, CardFooter } from "./card"
import { motion } from "framer-motion"
import { MemberCard } from "@/features/members/components/member-card"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import type { GetMembers200DataItem } from "@/lib/api/generated/model"

type ViewType = 'grid' | 'table'

interface ViewListProps<T extends { id: string }> {
  data: T[]
  columns?: any[]
  view: ViewType
  isLoading?: boolean
  gridCardRenderItem?: (item: T, index: number) => React.ReactNode
  meta?: {
    currentPage: number
    totalPages: number
    total: number
    limit: number
  }
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export function ViewList<T extends { id: string }>({
  data, 
  columns, 
  view, 
  isLoading, 
  meta, 
  onPageChange, 
  onPageSizeChange,
  gridCardRenderItem
}: ViewListProps<T>) {

  const adjustedPageSize = view === 'grid' 
    ? Math.max(12, Math.ceil((meta?.limit || 12) / 12) * 12)
    : meta?.limit || 10

  if (isLoading) {
    if (view === 'grid') {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: adjustedPageSize }).map((_, i) => (
            <div 
              key={i}
              className="
                relative 
                group 
                transform 
                transition-transform
                duration-200
              "
            >
              <div 
                className="
                  absolute 
                  -inset-0.5 
                  bg-primary/10
                  rounded-xl 
                  opacity-50 
                  blur-xl 
                  transition-all 
                  duration-500
                "
              />
              <Card 
                className="
                  relative 
                  bg-card
                  rounded-xl 
                  overflow-hidden 
                  border 
                  border-border/80
                  shadow-sm 
                  shadow-primary/10
                  animate-pulse
                  h-[220px]
                "
              >
                <div className="relative z-10">
                  <CardHeader className="pb-2 flex flex-row items-center space-x-4">
                    <div className="
                      h-12 w-12
                      bg-muted
                      rounded-full 
                      border-2 
                      border-primary/20 
                      ring-2 
                      ring-primary/10 
                      ring-offset-2
                    " />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 rounded bg-muted w-3/4" />
                      <div className="h-3 rounded bg-muted w-1/2" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 pb-4 space-y-2 text-sm">
                    <div className="space-y-2">
                      <div className="h-3 rounded bg-muted" />
                      <div className="h-3 w-5/6 rounded bg-muted" />
                      <div className="h-3 w-2/3 rounded bg-muted" />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-border/70 pt-2">
                    <div className="flex justify-between items-center w-full">
                      <div className="h-3 w-1/2 rounded bg-muted" />
                      <div className="h-3 w-1/4 rounded bg-muted" />
                    </div>
                  </CardFooter>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )
    }

    if (view === 'table') {
      return (
        <div className="border rounded-md">
          <div className="animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className="
                  flex 
                  items-center 
                  p-4 
                  border-b 
                  last:border-b-0 
                  space-x-4
                  bg-card
                  border-border/80
                "
              >
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
                <div className="h-6 w-20 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      )
    }
  }

  const renderContent = () => {
    if (view === 'grid') {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 10,
            staggerChildren: 0.1
          }}
        >
          <GridWithPagination 
            data={data} 
            renderItem={gridCardRenderItem}
          />
        </motion.div>
      )
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 10 
        }}
      >
          <DataTableWithPagination
            columns={columns ?? []}
            data={data}
            meta={meta}
          />
      </motion.div>
    )
  }

  return (
      <div className="space-y-5">
      {renderContent()}
      {meta && (
        <PaginationWithInfo
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          pageSize={view === 'grid' ? adjustedPageSize : meta.limit}
          total={meta.total}
          onPageChange={onPageChange || (() => {})}
          onPageSizeChange={onPageSizeChange || (() => {})}
          view={view}
        />
      )}
    </div>
  )
}
