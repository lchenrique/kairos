"use client"

import { GroupsGrid } from "@/components/groups/groups-grid"
import { GroupsHeader } from "@/components/groups/groups-header"
import { GroupsFilters } from "@/components/groups/groups-filters"
import { GroupsTable } from "@/components/groups/groups-table"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export default function GroupsPage() {
  const [view, setView] = useState<"grid" | "table">("grid")

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GroupsHeader />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <GroupsFilters view={view} onViewChange={setView} />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {view === "grid" ? <GroupsGrid /> : <GroupsTable />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}