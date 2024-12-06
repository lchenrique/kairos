'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MemberListFilters } from "@/features/members/components/member-list/filters"
import { MemberList } from "@/features/members/components/member-list"
import { useGetMembers } from "@/lib/api/generated/members/members"
import { useState, useEffect } from "react"
import { PlusIcon } from "lucide-react"
import { Users, UserPlus, UserMinus, CalendarClock, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from "lucide-react"
import { motion } from "framer-motion"
import { MemberForm } from "@/features/members/components/member-form/form"
import { PageHeader } from "@/components/shared/page-header"
import { MemberStats } from "@/features/members/components/stats/member-stats"
import { useSearchParams } from "next/navigation"
import { GetMembersOrder, GetMembersSortBy } from "@/lib/api/generated/model"
import { useDrawerStore } from "@/lib/stores/drawer-store"

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
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | null>(null)
  const { open } = useDrawerStore()
  const searchParams = useSearchParams()
  const limit = Number(searchParams.get('limit') ?? '10')
  const sortBy = searchParams.get('sortBy') as GetMembersSortBy | null
  const order = searchParams.get('order') as GetMembersOrder | null

  console.log('Members Query Params:', {
    page: Number(searchParams.get('page') ?? '1'),
    limit,
    search,
    status,
    sortBy,
    order
  })

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
  }, [view])

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
        className="flex items-center w-full"
        variants={item}
      >
        <PageHeader title="Membros">
          <Button onClick={handleNewMember}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Membro
          </Button>
        </PageHeader>
      </motion.div>

      <motion.div variants={item}>
        <MemberStats  totalMembers={membersResponse?.meta.totalItems || 0} members={membersResponse?.data || []} />
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Membros</CardTitle>
            <CardDescription>Gerencie os membros da sua igreja</CardDescription>
          </CardHeader>
          <CardContent>
            <MemberListFilters 
              view={view} 
              onViewChange={setView}
              onSearch={setSearch}
              onStatusChange={(value) => setStatus(value as "ACTIVE" | "INACTIVE" | null)}
            />
            <div className="mt-6">
              <MemberList 
                members={membersResponse?.data ?? []} 
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
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
