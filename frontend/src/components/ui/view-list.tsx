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

interface ViewListProps<T> {
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

export function ViewList<T>({
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: adjustedPageSize }).map((_, i) => (
            <div 
              key={i}
              className="
                relative 
                group 
                transform 
                transition-all 
                duration-500 
                hover:scale-105
              "
            >
              <div 
                className="
                  absolute 
                  -inset-0.5 
                  bg-gradient-to-r 
                  from-primary/10 
                  via-primary/5 
                  to-primary/10 
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
                  bg-gray-50 
                  dark:bg-gray-900 
                  rounded-xl 
                  overflow-hidden 
                  border 
                  border-gray-100 
                  dark:border-gray-800
                  shadow-sm 
                  shadow-primary/10
                  animate-pulse
                  h-[280px]
                "
              >
                <div className="relative z-10">
                  <CardHeader className="pb-2 flex flex-row items-center space-x-4">
                    <div className="
                      w-16 h-16 
                      bg-gray-200 dark:bg-gray-700
                      rounded-full 
                      border-2 
                      border-primary/20 
                      ring-2 
                      ring-primary/10 
                      ring-offset-2
                    " />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 pb-4 space-y-2 text-sm">
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center w-full">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
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
                  bg-gray-50 
                  dark:bg-gray-900 
                  border-gray-100 
                  dark:border-gray-800
                "
              >
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
                <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
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
          columns={columns} 
          data={data} 
          meta={meta}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
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
