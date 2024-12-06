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
        scale: 1.05,
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
          border-2 
          border-transparent 
          hover:border-primary/20
          transition-all 
          duration-300 
          shadow-sm 
          hover:shadow-lg
          bg-background
          cursor-pointer
        "
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-primary/10" />
        
        <CardContent className="flex-grow p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-2 border-primary/20">
                <AvatarImage 
                  src={member.image || undefined} 
                  alt={`Foto de ${member.name}`} 
                />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                  {member.name}
                </h3>
                <Badge 
                  variant={getStatusVariant(member.status)} 
                  className="mt-1 text-xs"
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
                  <MoreHorizontal className="w-5 h-5" />
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

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-primary/70" />
              <span className="truncate">{member.phone ? formatPhone(member.phone) : 'Telefone não informado'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-primary/70" />
              <span className="truncate">{member.email || 'E-mail não informado'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary/70" />
              <span className="truncate">{member.address || 'Endereço não informado'}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Users className="w-4 h-4" />
              <span>
                {member.groups && member.groups.length > 0 
                  ? `${member.groups.length} grupo(s)` 
                  : 'Sem grupos'}
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              Desde {new Date(member.createdAt).getFullYear()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
