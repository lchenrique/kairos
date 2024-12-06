'use client'

import { ViewList } from "@/components/ui/view-list"
import { columns } from "./columns"
import type { GetMembers200DataItem, GetMembers200DataItem as Member } from "@/lib/api/generated/model/getMembers200DataItem"

interface MemberListProps {
  members: Member[]
  view: "grid" | "table"
  isLoading?: boolean
  meta?: {
    currentPage: number
    totalPages: number
    total: number
    limit: number
  }
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export function MemberList({
  members,
  view,
  isLoading,
  meta,
  onPageChange,
  onPageSizeChange
}: MemberListProps) {

  return (
    <ViewList
      data={members}
      columns={columns}
      view={view}
      isLoading={isLoading}
      meta={meta}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      gridCardRenderItem={(member, index) => (
        <MemberCard key={index} member={member} />
      )}
    />
  )
}
