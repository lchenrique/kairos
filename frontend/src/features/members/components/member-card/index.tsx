"use client"

import { motion } from 'framer-motion'
import { 
  Users, 
  PhoneCall, 
  Mail, 
  MapPin, 
  MoreHorizontal, 
  Edit2, 
  Trash2,
  Eye 
} from 'lucide-react'
import { 
  Card, 
  CardContent 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { GetMembers200DataItem } from "@/lib/api/generated/model"
import { formatPhone } from "@/lib/utils"
import { useMemberActions } from '../../hooks/use-member-actions'

interface MemberCardProps {
  member: GetMembers200DataItem
}

export function MemberCard({ member }: MemberCardProps) {
  const { handleDelete, handleEdit, handleView } = useMemberActions(member)

  const getStatusVariant = (status: string) => {
    return status === 'ACTIVE' ? 'success' : 'destructive'
  }

  const getInitials = (name: string) => 
    name
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: 1.015,
        transition: { duration: 0.2 }
      }}
      className="group relative h-full"
    >
      <Card 
        className="
          relative 
          h-full
          flex 
          flex-col 
          overflow-hidden 
          border-border/80
          hover:border-primary/40
          transition-all 
          duration-300 
          shadow-sm 
          hover:shadow-lg
          bg-card
          cursor-pointer
        "
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-primary/20 transition-colors group-hover:bg-accent" />
        
          <CardContent className="flex-grow space-y-3 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="h-12 w-12 shrink-0 border-2 border-primary/20">
                <AvatarImage 
                  src={member.image || undefined} 
                  alt={`Foto de ${member.name}`} 
                />
                <AvatarFallback className="bg-primary/10 font-bold text-primary">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="line-clamp-1 text-base font-semibold">
                  {member.name}
                </h3>
                <Badge 
                  variant={getStatusVariant(member.status)} 
                  className="mt-1 text-[11px]"
                >
                  {member.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault()
                    handleView()
                  }}
                  className="cursor-pointer"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault()
                    handleEdit()
                  }}
                  className="cursor-pointer"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault()
                    handleDelete()
                  }}
                  className="cursor-pointer text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden="true" />
              <span className="truncate">{member.phone ? formatPhone(member.phone) : 'Telefone não informado'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden="true" />
              <span className="truncate">{member.email || 'E-mail não informado'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden="true" />
              <span className="truncate">{member.address || 'Endereço não informado'}</span>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/70 pt-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {member.groups && member.groups.length > 0 
                  ? `${member.groups.length} grupo(s)` 
                  : 'Sem grupos'}
              </span>
            </div>
            <Badge variant="secondary" className="text-[11px]">
              Desde {new Date(member.createdAt).getFullYear()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
