"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useGetGroups } from "@/lib/api/generated/groups/groups"
import type { GetGroups200DataItem, GetGroupsOrder, GetGroupsSortBy, GetGroupsType } from "@/lib/api/generated/model"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import { GroupForm } from "../group-drawer/form"
import { GroupCard } from "../group-card"
import { PageHeader } from "@/components/shared/page-header"
import { ListShell } from "@/components/shared/list-shell"
import { ListToolbar } from "@/components/shared/list-toolbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GroupMeta, GroupRowActions, getGroupColumns } from "./columns"
import { Plus } from "lucide-react"
import { motion } from "framer-motion"
import { hasPermission } from '@/lib/permissions'
import { useAuthStore } from '@/lib/stores/auth-store'

const typeLabels: Record<GetGroups200DataItem["type"], string> = {
  CELL: "Célula",
  MINISTRY: "Ministério",
  DEPARTMENT: "Departamento",
  OTHER: "Outro",
}

export function GroupList() {
  const [view, setView] = useState<"grid" | "table">("table")
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(view === "grid" ? 12 : 10)
  const open = useDrawerStore((state) => state.open)
  const searchParams = useSearchParams()
  const sortBy = searchParams.get('sortBy') as GetGroupsSortBy | null
  const order = searchParams.get('order') as GetGroupsOrder | null
  const role = useAuthStore((state) => state.user?.role)
  const canManage = hasPermission(role, 'GROUPS_MANAGE')

  useEffect(() => {
    setPage(1)
    setLimit(view === "grid" ? 12 : 10)
  }, [search, type, view])

  const { data, isLoading, isError } = useGetGroups({
    page,
    limit,
    ...(search ? { search } : {}),
    ...(type !== "all" ? { type: type as GetGroupsType } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(order ? { order } : {}),
  }, { query: { refetchOnWindowFocus: false } })

  const groups = data?.data ?? []
  const total = data?.meta.totalItems ?? 0

  const handleCreate = () => open({ title: "Novo grupo", subtitle: "Cadastre os detalhes do encontro e mantenha sua equipe alinhada.", content: <GroupForm /> })
  const handleEdit = (group: GetGroups200DataItem) => open({ title: "Editar grupo", subtitle: group.name, content: <GroupForm initialData={group} id={group.id} /> })
  const handleView = (group: GetGroups200DataItem) => open({ title: group.name, subtitle: "Detalhes do grupo", content: <GroupCard group={group} onEdit={canManage ? () => handleEdit(group) : undefined} /> })
  const handleClear = () => { setSearch(""); setType("all") }
  const handlePageSizeChange = (pageSize: number) => { setLimit(pageSize); setPage(1) }

  const columns = getGroupColumns({ onView: handleView, onEdit: handleEdit, canManage })

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <PageHeader
        routeName="Organização"
        title="Grupos"
        subtitle="Acompanhe células, ministérios e departamentos em um só lugar."
        breadcrumb={[{ label: "Organização" }, { label: "Grupos" }]}
        variant="compact"
      >
        {canManage && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Novo grupo
          </Button>
        )}
      </PageHeader>

      <ListShell
        title="Lista de Grupos"
        description="Gerencie as células, ministérios e departamentos da sua igreja"
        data={groups}
        columns={columns}
        view={view}
        isLoading={isLoading}
        errorMessage={isError ? "Não foi possível carregar os grupos. Verifique sua conexão e tente novamente." : undefined}
        meta={{ currentPage: data?.meta.page ?? 1, totalPages: data?.meta.totalPages ?? 1, total, limit }}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        gridRenderItem={(group) => (
          <Card className="group relative h-full overflow-hidden transition-shadow hover:shadow-md">
            <CardHeader className="pb-3"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><CardTitle className="truncate text-lg">{group.name}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{typeLabels[group.type]}</p></div><GroupRowActions group={group} onView={() => handleView(group)} onEdit={() => handleEdit(group)} canManage={canManage} /></div></CardHeader>
            <CardContent className="space-y-4"><p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">{group.description || "Sem descrição cadastrada."}</p><GroupMeta group={group} showMemberCount={canManage} /><Button variant="secondary" className="w-full" onClick={() => handleView(group)}>Ver detalhes</Button></CardContent>
          </Card>
        )}
        toolbar={
          <ListToolbar
            view={view}
            onViewChange={setView}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Buscar grupos..."
            showClear={Boolean(search) || type !== "all"}
            onClear={handleClear}
            filters={
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-[180px]" aria-label="Filtrar por tipo">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="CELL">Células</SelectItem>
                  <SelectItem value="MINISTRY">Ministérios</SelectItem>
                  <SelectItem value="DEPARTMENT">Departamentos</SelectItem>
                  <SelectItem value="OTHER">Outros</SelectItem>
                </SelectContent>
              </Select>
            }
          />
        }
      />
    </motion.div>
  )
}
