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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Clock, MapPin, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { GetGroups200GroupsItem } from '@/lib/api/generated/model'
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import { useState } from "react"
import { useListGroups } from "../../hooks/use-list-groups"
import { GroupCard } from "../group-card"
import { GroupForm } from "../group-drawer/form"
import { BulkActions } from "@/components/shared/bulk-actions"

export function GroupListTable() {
  const { data, isLoading } = useListGroups()
  const groups = data?.groups
  const open = useDrawerStore((state) => state.open)
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  const handleViewProfile = (group: GetGroups200GroupsItem) => {
    open({
      title: "Detalhes do Grupo",
      subtitle: group.name,
      content: (
        <GroupCard
          group={group}
          onEdit={() => handleEdit(group)}
        />
      ),
    })
  }

  const handleEdit = (group: GetGroups200GroupsItem) => {
    open({
      title: "Editar Grupo",
      content: <GroupForm initialData={group} />,
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked && groups) {
      setSelectedGroups(groups.map((group) => group.id))
    } else {
      setSelectedGroups([])
    }
  }

  const handleSelect = (checked: boolean, groupId: string) => {
    if (checked) {
      setSelectedGroups((prev) => [...prev, groupId])
    } else {
      setSelectedGroups((prev) => prev.filter((id) => id !== groupId))
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12" />
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
      {selectedGroups.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <BulkActions
            selectedCount={selectedGroups.length}
            onClear={() => setSelectedGroups([])}
          />
        </motion.div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={groups?.length === selectedGroups.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reunião</TableHead>
              <TableHead>Líder</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {groups?.map((group) => (
                <motion.tr
                  key={group.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedGroups.includes(group.id)}
                      onCheckedChange={(checked) => handleSelect(checked, group.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{group.name}</div>
                      {group.description && (
                        <div className="text-sm text-muted-foreground">
                          {group.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={group.status === "ACTIVE" ? "default" : "secondary"}>
                      {group.status === "ACTIVE" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {group.meetingDay && (
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4" />
                          {group.meetingDay}
                          {group.meetingTime && ` às ${group.meetingTime}`}
                        </div>
                      )}
                      {group.meetingLocation && (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-4 w-4" />
                          {group.meetingLocation}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {group.leader && (
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-4 w-4" />
                        {group.leader}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProfile(group)}>
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(group)}>
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
    </div>
  )
}
