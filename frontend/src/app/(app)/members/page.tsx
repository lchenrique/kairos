'use client'

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ListShell } from "@/components/shared/list-shell"
import { ListToolbar } from "@/components/shared/list-toolbar"
import { columns } from "@/features/members/components/member-list/columns"
import { MemberCard } from "@/features/members/components/member-card"
import { useGetMembers } from "@/lib/api/generated/members/members"
import { useState, useEffect } from "react"
import { Download, PlusIcon } from "lucide-react"
import { Users, UserPlus, UserMinus, CalendarClock, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from "lucide-react"
import { motion } from "framer-motion"
import { MemberForm } from "@/features/members/components/member-form/form"
import { PageHeader } from "@/components/shared/page-header"
import { MemberStats } from "@/features/members/components/stats/member-stats"
import { useSearchParams } from "next/navigation"
import { GetMembersOrder, GetMembersSortBy } from "@/lib/api/generated/model"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import { downloadCsv } from "@/lib/utils/csv"
import { MemberBirthdays } from "@/features/members/components/member-birthdays"
import { useDebounce } from "@/hooks/use-debounce"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function MembersPage() {
  const [view, setView] = useState<'grid' | 'table'>('table')
  const [searchInput, setSearchInput] = useState("")
  const search = useDebounce(searchInput, 500)
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | null>(null)
  const { open } = useDrawerStore()
  const searchParams = useSearchParams()
  const limit = Number(searchParams.get('limit') ?? '10')
  const sortBy = searchParams.get('sortBy') as GetMembersSortBy | null
  const order = searchParams.get('order') as GetMembersOrder | null

  const { 
    data: membersResponse, 
    isLoading, 
    refetch 
  } = useGetMembers({
    page: Number(searchParams.get('page') ?? '1'),
    limit,
    ...(search ? { search } : {}),
    ...(status ? { status } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(order ? { order } : {})
  }, {
    query: {
      refetchOnWindowFocus: false
    }
  })
  const { data: exportResponse } = useGetMembers({ page: 1, limit: 100, ...(search ? { search } : {}), ...(status ? { status } : {}) }, { query: { refetchOnWindowFocus: false } })

  // Adiciona efeito para refetch quando a view mudar
  useEffect(() => {
    // Reseta o limite para o padrão da view
    const defaultLimit = view === 'grid' ? 12 : 10
    
    // Atualiza a URL com o novo limite
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('limit', defaultLimit.toString())
    newSearchParams.set('page', '1') // Reset para primeira página
    window.history.replaceState(null, '', `?${newSearchParams.toString()}`)

    // Força refetch
    refetch()
  }, [view, refetch, searchParams])

  const handleNewMember = () => {
    open({
      title: "Novo Membro",
      subtitle: "Preencha os dados do novo membro",
      content: <MemberForm />
    })
  }

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('page', page.toString())
    window.history.pushState(null, '', `?${newSearchParams.toString()}`)
  }

  const handlePageSizeChange = (pageSize: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('limit', pageSize.toString())
    newSearchParams.set('page', '1') // Reset to first page when changing page size
    window.history.pushState(null, '', `?${newSearchParams.toString()}`)
  }

  return (
    <motion.div 
      className="flex-1 space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div 
        className="flex w-full items-center"
        variants={item}
      >
        <PageHeader routeName="Cuidar" title="Membros" subtitle="Acompanhe pessoas, vínculos e próximos passos da comunidade." breadcrumb={[{ label: "Cuidar" }, { label: "Membros" }]} variant="compact">
          <Button variant="outline" disabled={!exportResponse?.data.length} onClick={() => downloadCsv("kairos-membros.csv", (exportResponse?.data ?? []).map((member) => ({ Nome: member.name, Email: member.email ?? "", Telefone: member.phone ?? "", Status: member.status, Nascimento: member.birthDate ? new Date(member.birthDate).toLocaleDateString("pt-BR") : "" })))}><Download className="mr-2 h-4 w-4" aria-hidden="true" />Exportar CSV</Button>
          <Button onClick={handleNewMember}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Membro
          </Button>
        </PageHeader>
      </motion.div>

      <motion.div variants={item}>
        <MemberBirthdays members={exportResponse?.data ?? []} />
      </motion.div>

      <motion.div variants={item}>
        <MemberStats  totalMembers={membersResponse?.meta.totalItems || 0} members={membersResponse?.data || []} />
      </motion.div>

      <motion.div variants={item}>
        <ListShell
          title="Lista de Membros"
          description="Gerencie os membros da sua igreja"
          data={membersResponse?.data ?? []}
          columns={columns}
          view={view}
          isLoading={isLoading}
          meta={{
            currentPage: membersResponse?.meta.page ?? 1,
            totalPages: membersResponse?.meta.totalPages ?? 1,
            total: membersResponse?.meta.totalItems ?? 0,
            limit
          }}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          gridRenderItem={(member, index) => <MemberCard key={index} member={member} />}
          toolbar={
            <ListToolbar
              view={view}
              onViewChange={setView}
              search={searchInput}
              onSearch={setSearchInput}
              searchPlaceholder="Buscar membros..."
              filters={
                <Select
                  value={status === "ACTIVE" ? "active" : status === "INACTIVE" ? "inactive" : "all"}
                  onValueChange={(value) => setStatus(value === "active" ? "ACTIVE" : value === "inactive" ? "INACTIVE" : null)}
                >
                  <SelectTrigger className="w-[180px]" aria-label="Filtrar membros por status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              }
            />
          }
        />
      </motion.div>
    </motion.div>
  )
}
