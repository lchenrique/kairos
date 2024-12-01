"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Mail, Phone, UserCircle, MapPin, Calendar, Star } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetMembers } from '@/lib/api/generated/members/members'
import type { GetMembers200MembersItem } from '@/lib/api/generated/model'
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { useDrawerStore } from "@/store/use-drawer-store"
import { MemberProfile } from "./member-profile"
import { MemberForm } from "./member-form"

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

export function MembersGrid() {
  const { data, isLoading } = useGetMembers()
  const members = data?.members
  const open = useDrawerStore((state) => state.open)

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
          mode="edit"
          member={member}
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    )
  }

  return (
    <motion.div 
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {members?.map((member) => (
        <motion.div key={member.id} variants={item}>
          <Card className="group relative cursor-pointer" onClick={() => handleViewProfile(member)}>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/20 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
            
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold leading-none">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role || "Membro"}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      handleViewProfile(member)
                    }}>
                      Ver perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(member)
                    }}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                      Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={member.status === "Ativo" ? "default" : "secondary"}
                  className="px-2 py-0.5"
                >
                  {member.status}
                </Badge>
                {member.isLeader && (
                  <Badge variant="outline" className="px-2 py-0.5">
                    <Star className="h-3 w-3 mr-1" />
                    Líder
                  </Badge>
                )}
              </div>

              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{member.phone}</span>
                  </div>
                )}
                {member.address && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{member.address}</span>
                  </div>
                )}
                {member.birthDate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{member.birthDate}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                {member.groups?.map((group) => (
                  <Badge key={group} variant="secondary" className="px-2 py-0.5">
                    {group}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}