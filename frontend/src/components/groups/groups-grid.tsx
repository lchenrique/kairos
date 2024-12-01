"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Users, MapPin, Calendar } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGroups } from "@/hooks/use-groups"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { useDrawerStore } from "@/store/use-drawer-store"
import { GroupProfile } from "./group-profile"
import { GroupForm } from "./group-form"

export function GroupsGrid() {
  const { data: groups, isLoading } = useGroups()
  const open = useDrawerStore((state) => state.open)

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
      content: (
        <GroupForm 
          mode="edit"
          group={group}
          onSubmit={async (data) => {
            try {
              // TODO: Implement API integration
              console.log(data)
            } catch (error) {
              console.error(error)
            }
          }}
        />
      ),
    })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <AnimatePresence mode="wait" initial={false}>
        {groups?.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card className="group relative overflow-hidden p-6 hover:border-primary/50 transition-colors">
              <div className="absolute right-2 top-2">
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
                      onClick={() => handleViewProfile(group)}
                      className="cursor-pointer"
                    >
                      Ver Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleEdit(group)}
                      className="cursor-pointer"
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-destructive">
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col items-center text-center">
                <Avatar className="h-16 w-16 border-4 border-primary/20">
                  <AvatarImage src={group.avatar} />
                  <AvatarFallback>{group.name[0]}</AvatarFallback>
                </Avatar>

                <div className="mt-4">
                  <button
                    onClick={() => handleViewProfile(group)}
                    className="text-lg font-semibold group-hover:text-primary transition-colors"
                  >
                    {group.name}
                  </button>
                  <p className="text-sm text-muted-foreground">
                    {group.type || "Grupo"}
                  </p>
                </div>

                <div className="mt-2">
                  <Badge 
                    variant={group.status === "Ativo" ? "default" : "secondary"}
                    className="bg-green-500/10 text-green-500 hover:bg-green-500/20"
                  >
                    {group.status}
                  </Badge>
                </div>

                <div className="mt-6 space-y-2 w-full">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {group.members?.length || 0} membros
                  </div>
                  {group.location && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{group.location}</span>
                    </div>
                  )}
                  {group.meetingDay && group.meetingTime && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {group.meetingDay} às {group.meetingTime}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}