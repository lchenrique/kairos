'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MemberListFilters } from "@/features/members/components/member-list/filters"
import { MemberList } from "@/features/members/components/member-list"
import { useGetMembers } from "@/lib/api/generated/members/members"
import { useState } from "react"
import { useDrawerStore } from "@/store/use-drawer-store"
import { PlusIcon } from "lucide-react"
import { Users, UserPlus, UserMinus, CalendarClock, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from "lucide-react"
import { motion } from "framer-motion"
import { MemberForm } from "@/features/members/components/member-form/form"
import { PageHeader } from "@/components/shared/page-header"
import { MemberStats } from "@/features/members/components/stats/member-stats"
import { useSearchParams } from "next/navigation"

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

  const { data: membersResponse, isLoading } = useGetMembers({
    page: Number(searchParams.get('page') ?? '1'),
    limit,
    ...(search ? { search } : {}),
    ...(status ? { status } : {})
  }, {
    query: {
      refetchOnWindowFocus: false
    }
  })

  const handleNewMember = () => {
    open({
      title: "Novo Membro",
      subtitle: "Preencha os dados do novo membro",
      content: <MemberForm />
    })
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
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
