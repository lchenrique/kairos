"use client"

import { useEffect, useState } from "react"
import { useGetGroups } from "@/lib/api/generated/groups/groups"
import type { GetGroups200DataItem, GetGroupsType } from "@/lib/api/generated/model"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import { GroupForm } from "../group-drawer/form"
import { GroupCard } from "../group-card"
import { GroupListHeader } from "./header"
import { GroupListFilters } from "./filters"
import { GroupListTable } from "./table"
import { PaginationWithInfo } from "@/components/ui/pagination-with-info"
import { motion } from "framer-motion"
import { hasPermission } from '@/lib/permissions'
import { useAuthStore } from '@/lib/stores/auth-store'

export function GroupList() {
  const [view, setView] = useState<"grid" | "table">("table")
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const [page, setPage] = useState(1)
  const limit = view === "grid" ? 12 : 10
  const open = useDrawerStore((state) => state.open)
  const role = useAuthStore((state) => state.user?.role)
  const canManage = hasPermission(role, 'GROUPS_MANAGE')

  useEffect(() => setPage(1), [search, type, view])

  const { data, isLoading, isError } = useGetGroups({
    page,
    limit,
    ...(search ? { search } : {}),
    ...(type !== "all" ? { type: type as GetGroupsType } : {}),
  }, { query: { refetchOnWindowFocus: false } })

  const groups = data?.data ?? []
  const total = data?.meta.totalItems ?? 0

  const handleCreate = () => open({ title: "Novo grupo", subtitle: "Cadastre os detalhes do encontro e mantenha sua equipe alinhada.", content: <GroupForm /> })
  const handleEdit = (group: GetGroups200DataItem) => open({ title: "Editar grupo", subtitle: group.name, content: <GroupForm initialData={group} id={group.id} /> })
  const handleView = (group: GetGroups200DataItem) => open({ title: group.name, subtitle: "Detalhes do grupo", content: <GroupCard group={group} onEdit={canManage ? () => handleEdit(group) : undefined} /> })
  const handleClear = () => { setSearch(""); setType("all") }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <GroupListHeader total={total} onCreate={canManage ? handleCreate : undefined} />
      {isError && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">Não foi possível carregar os grupos. Verifique sua conexão e tente novamente.</div>}
      <GroupListFilters view={view} onViewChange={setView} search={search} onSearch={setSearch} type={type} onTypeChange={setType} onClear={handleClear} />
      <GroupListTable groups={groups} isLoading={isLoading} view={view} onView={handleView} onEdit={handleEdit} canManage={canManage} />
      {data?.meta && <PaginationWithInfo currentPage={data.meta.page} totalPages={data.meta.totalPages} pageSize={limit} total={total} onPageChange={setPage} onPageSizeChange={() => undefined} view={view} />}
    </motion.div>
  )
}
