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
import { useGetMembers } from '@/lib/api/generated/members/members'
import type { GetMembers200MembersItem, PostMembersBody } from '@/lib/api/generated/model'
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { useDrawerStore } from "@/store/use-drawer-store"
import { MemberProfile } from "./member-profile"
import { MemberForm } from "./member-form"
import { BulkActions } from "@/components/shared/bulk-actions"
import { useState } from "react"

export function MembersTable() {
  const { data, isLoading } = useGetMembers()
  const members = data?.members
  const open = useDrawerStore((state) => state.open)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  const handleViewProfile = (member: GetMembers200MembersItem) => {
    open({
      title: "Perfil do Membro",
      subtitle: member.name,
      content: (
        <MemberProfile
          member={member}
          onEdit={() => handleEdit(member)}
        />
      ),
    })
  }

  const handleEdit = (member: GetMembers200MembersItem) => {
 
    open({
      title: "Editar Membro",
      subtitle: member.name,
      content: (
        <MemberForm
          initialData={member}
        />
      ),
    })
  }

  const toggleSelectAll = () => {
    if (selectedMembers.length === members?.length) {
      setSelectedMembers([])
    } else {
      setSelectedMembers(members?.map(m => m.id) || [])
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(m => m !== id))
    } else {
      setSelectedMembers([...selectedMembers, id])
    }
  }

  const handleBulkAction = async (action: string) => {
    try {
      // TODO: Implement API integration
      console.log(action, selectedMembers)
      setSelectedMembers([])
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-lg border bg-card/50 backdrop-blur-sm"
    >
      {selectedMembers.length > 0 && (
        <div className="absolute -top-14 left-0 z-10">
          <BulkActions
            selectedCount={selectedMembers.length}
            onAction={handleBulkAction}
            type="members"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedMembers.length === members?.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Membro</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="wait" initial={false}>
                  {members?.map((member, index) => (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={() => toggleSelect(member.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border-2 border-primary/20">
                            <AvatarImage src={member.image || ""} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <button
                              onClick={() => handleViewProfile(member)}
                              className="font-medium group-hover:text-primary transition-colors"
                            >
                              {member.name}
                            </button>
                            <p className="text-xs text-muted-foreground">
                              Membro
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">
                            {member.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {member.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={member.status === "ACTIVE" ? "default" : "secondary"}
                          className="bg-green-500/10 text-green-500 hover:bg-green-500/20"
                        >
                          {member.status === "ACTIVE" ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuItem
                              onClick={() => handleViewProfile(member)}
                              className="cursor-pointer"
                            >
                              Ver Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(member)}
                              className="cursor-pointer"
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive">
                              Excluir
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
        </div>
      </div>
    </motion.div>
  )
}