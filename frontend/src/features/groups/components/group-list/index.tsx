"use client"

import { useState } from "react"
import { GroupListHeader } from "./header"
import { GroupListFilters } from "./filters"
import { GroupListTable } from "./table"
import { GroupDrawer } from "../group-drawer"

export function GroupList() {
  const [view, setView] = useState<"grid" | "table">("table")

  return (
    <div className="space-y-8">
      <GroupListHeader />
      <GroupListFilters view={view} onViewChange={setView} />
      <GroupListTable />
      <GroupDrawer />
    </div>
  )
}
