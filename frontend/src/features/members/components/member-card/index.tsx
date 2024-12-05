"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Calendar, Edit } from "lucide-react"
import type { GetMembers200DataItem } from "@/lib/api/generated/model"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface MemberCardProps {
  member: GetMembers200DataItem
  onEdit?: () => void
}

export function MemberCard({ member, onEdit }: MemberCardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={member.image ?? undefined} />
            <AvatarFallback className="text-xl">
              {member.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{member.name}</h2>
            <p className="text-muted-foreground">{member.email}</p>
          </div>
        </div>
        {onEdit && (
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={member.status === "ACTIVE" ? "default" : "secondary"}>
          {member.status === "ACTIVE" ? "Ativo" : "Inativo"}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {member.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${member.email}`}
                className="text-sm hover:underline"
              >
                {member.email}
              </a>
            </div>
          )}
          {member.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${member.phone}`} className="text-sm hover:underline">
                {member.phone}
              </a>
            </div>
          )}
          {member.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{member.address}</span>
            </div>
          )}
          {member.birthDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(new Date(member.birthDate), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </span>
            </div>
          )}
        </div>

        {member.notes && (
          <div>
            <h3 className="mb-2 font-medium">Observações</h3>
            <p className="text-sm text-muted-foreground">{member.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
