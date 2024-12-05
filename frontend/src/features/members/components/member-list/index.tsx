'use client'

import { Member } from "@/lib/api/generated/members/members"
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MemberPagination } from "./pagination"

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
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function MemberList({ members, view, isLoading, meta }: MemberListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    )
  }

  if (view === 'table') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        <DataTable 
          columns={columns} 
          data={members} 
          pageSize={meta?.limit} 
        />
        {meta && (
          <MemberPagination
            currentPage={meta.currentPage}
            totalPages={Math.ceil(meta.total / meta.limit)}
            totalItems={meta.total}
          />
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence>
        {members.map((member) => (
          <motion.div key={member.id} variants={item} layout>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{member.name}</span>
                  <Badge variant={member.status === "ACTIVE" ? "default" : "secondary"}>
                    {member.status === "ACTIVE" ? "Ativo" : "Inativo"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <p>{member.email}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Data de Nascimento:</span>
                  <p>{format(new Date(member.birthDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                </div>
                {member.baptismDate && (
                  <div>
                    <span className="text-sm text-muted-foreground">Data de Batismo:</span>
                    <p>{format(new Date(member.baptismDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
