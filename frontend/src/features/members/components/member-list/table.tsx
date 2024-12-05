"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Mail, Phone } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { GetMembers200MembersItem } from '@/lib/api/generated/model'
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { useDrawerStore } from "@/store/use-drawer-store"
import { BulkActions } from "@/components/shared/bulk-actions"
import { useState } from "react"
import { useListMembers } from "../../hooks/use-list-members"
import { MemberCard } from "../member-card"
import { MemberForm } from "../member-form/form"
import { MemberPagination } from "./pagination"
import type { Member } from "@/lib/api/generated/model"

interface MemberListTableProps {
  members: Member[]
  meta?: {
    currentPage: number
    totalPages: number
    total: number
  }
}

export function MemberListTable({ members, meta }: MemberListTableProps) {
  const { data, isLoading } = useListMembers()
  const open = useDrawerStore((state) => state.open)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  const handleViewProfile = (member: GetMembers200MembersItem) => {
    open({
      title: "Perfil do Membro",
      subtitle: member.name,
      content: (
        <MemberCard
          member={member}
          onEdit={() => handleEdit(member)}
        />
      ),
    })
  }

  const handleEdit = (member: GetMembers200MembersItem) => {
    open({
      title: "Editar Membro",
      content: <MemberForm initialData={member} />,
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked && members) {
      setSelectedMembers(members.map((member) => member.id))
    } else {
      setSelectedMembers([])
    }
  }

  const handleSelect = (checked: boolean, memberId: string) => {
    if (checked) {
      setSelectedMembers((prev) => [...prev, memberId])
    } else {
      setSelectedMembers((prev) => prev.filter((id) => id !== memberId))
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selectedMembers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <BulkActions
            selectedCount={selectedMembers.length}
            onClear={() => setSelectedMembers([])}
          />
        </motion.div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={members?.length === selectedMembers.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Membro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contatos</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {members?.map((member) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={(checked) => handleSelect(checked, member.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={member.image ?? undefined} />
                        <AvatarFallback>
                          {member.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.status === "ACTIVE" ? "default" : "secondary"}>
                      {member.status === "ACTIVE" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {member.email && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`mailto:${member.email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {member.phone && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`tel:${member.phone}`}>
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProfile(member)}>
                          Ver perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(member)}>
                          Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {meta && (
        <MemberPagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          totalItems={meta.total}
        />
      )}
    </div>
  )
}
