"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Mail, MapPin, Phone, Star, UserCircle } from "lucide-react"

interface MemberProfileProps {
  member: any // TODO: Add proper type
  onEdit?: () => void
}

export function MemberProfile({ member, onEdit }: MemberProfileProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-primary/20">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{member.name}</h2>
            <p className="text-muted-foreground">{member.role || "Membro"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            Editar Perfil
          </Button>
        </div>
      </div>

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

      <Separator />

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
            <div className="grid gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>
              {member.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{member.phone}</span>
                </div>
              )}
              {member.address && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{member.address}</span>
                </div>
              )}
              {member.birthDate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>{member.birthDate}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Grupos</h3>
            <div className="space-y-2">
              {member.groups?.map((group: string) => (
                <div key={group} className="flex items-center gap-2 text-muted-foreground">
                  <UserCircle className="h-4 w-4 shrink-0" />
                  <span>{group}</span>
                </div>
              ))}
              {(!member.groups || member.groups.length === 0) && (
                <p className="text-sm text-muted-foreground">Nenhum grupo</p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Ministérios</h3>
            <div className="space-y-2">
              {member.ministries?.map((ministry: string) => (
                <div key={ministry} className="flex items-center gap-2 text-muted-foreground">
                  <UserCircle className="h-4 w-4 shrink-0" />
                  <span>{ministry}</span>
                </div>
              ))}
              {(!member.ministries || member.ministries.length === 0) && (
                <p className="text-sm text-muted-foreground">Nenhum ministério</p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
            <div className="space-y-2">
              {member.activities?.map((activity: any) => (
                <div key={activity.id} className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span className="truncate">{activity.description}</span>
                </div>
              ))}
              {(!member.activities || member.activities.length === 0) && (
                <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
