"use client"

import { MembersTable } from "@/components/members/members-table"
import { MembersHeader } from "@/components/members/members-header"
import { MembersFilters } from "@/components/members/members-filters"
import { MembersGrid } from "@/components/members/members-grid"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export default function MembersPage() {
  const [view, setView] = useState<"grid" | "table">("table")

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MembersHeader />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <MembersFilters view={view} onViewChange={setView} />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {view === "grid" ? <MembersGrid /> : <MembersTable />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}