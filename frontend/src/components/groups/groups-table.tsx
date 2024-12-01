"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Users, MapPin, Calendar, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { useDrawerStore } from "@/store/use-drawer-store"
import { GroupProfile } from "./group-profile"
import { GroupForm } from "./group-form"
import { Checkbox } from "@/components/ui/checkbox"
import { BulkActions } from "@/components/shared/bulk-actions"
import { useState } from "react"
import { useGetGroups, useDeleteGroupsId } from "@/lib/api/generated/groups"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

export function GroupsTable() {
  const { data, isLoading } = useGetGroups()
  const open = useDrawerStore((state) => state.open)
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const queryClient = useQueryClient()

  const deleteGroup = useDeleteGroupsId({
    mutation: {
      onSuccess: () => {
        toast.success("Grupo removido com sucesso")
        queryClient.invalidateQueries({ queryKey: ["groups"] })
      },
      onError: () => {
        toast.error("Erro ao remover grupo")
      }
    }
  })

  const handleViewProfile = (group: any) => {
    open({
      title: "Perfil do Grupo",
      subtitle: group.name,
      content: (
        <GroupProfile 
          group={group} 
          onEdit={() => handleEdit(group)}
        />
      ),
    })
  }

  const handleEdit = (group: any) => {
    open({
      title: "Editar Grupo",
      subtitle: group.name,
      content: <GroupForm initialData={group} />,
    })
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteGroup.mutateAsync({ id })
    } catch (error) {
      console.error(error)
    }
  }

  const toggleSelectAll = () => {
    if (selectedGroups.length === data?.groups?.length) {
      setSelectedGroups([])
    } else {
      setSelectedGroups(data?.groups?.map(g => g.id) || [])
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedGroups.includes(id)) {
      setSelectedGroups(selectedGroups.filter(g => g !== id))
    } else {
      setSelectedGroups([...selectedGroups, id])
    }
  }

  const handleBulkAction = async (action: string) => {
    try {
      if (action === "delete") {
        await Promise.all(selectedGroups.map(id => deleteGroup.mutateAsync({ id })))
        setSelectedGroups([])
      }
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
      {selectedGroups.length > 0 && (
        <div className="absolute -top-14 left-0 z-10">
          <BulkActions
            selectedCount={selectedGroups.length}
            onAction={handleBulkAction}
            type="groups"
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
                      checked={selectedGroups.length === data?.groups?.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Dia/Horário</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="wait" initial={false}>
                  {data?.groups?.map((group, index) => (
                    <motion.tr
                      key={group.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell>
                        <Checkbox 
                          checked={selectedGroups.includes(group.id)}
                          onCheckedChange={() => toggleSelect(group.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border-2 border-primary/20">
                            <AvatarFallback>{group.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <button
                              onClick={() => handleViewProfile(group)}
                              className="font-medium group-hover:text-primary transition-colors"
                            >
                              {group.name}
                            </button>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {group.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {group.type === "CELL" && "Célula"}
                          {group.type === "MINISTRY" && "Ministério"}
                          {group.type === "DEPARTMENT" && "Departamento"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {group.location || "Não definido"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {group.meetingDay ? `${group.meetingDay} às ${group.meetingTime}` : "Não definido"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(group)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(group.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
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