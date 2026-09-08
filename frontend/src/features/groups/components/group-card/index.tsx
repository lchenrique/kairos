"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Calendar, Edit, UsersRound } from "lucide-react"
import type { GetGroups200DataItem } from "@/lib/api/generated/model"
import { GroupMembersManager } from "../group-members-manager"
import { hasPermission } from '@/lib/permissions'
import { useAuthStore } from '@/lib/stores/auth-store'

interface GroupCardProps {
  group: GetGroups200DataItem
  onEdit?: () => void
}

export function GroupCard({ group, onEdit }: GroupCardProps) {
  const role = useAuthStore((state) => state.user?.role)
  const canManage = hasPermission(role, 'GROUPS_MANAGE')
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{group.name}</h2>
          {group.description && (
            <p className="text-muted-foreground">{group.description}</p>
          )}
        </div>
        {onEdit && (
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Editar grupo</span>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          {group.type === "CELL" ? "Célula" : group.type === "MINISTRY" ? "Ministério" : group.type === "DEPARTMENT" ? "Departamento" : "Outro"}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {group.meetingDay && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{group.meetingDay}</span>
            </div>
          )}
          {group.startTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{group.startTime}{group.endTime ? `–${group.endTime}` : ""}</span>
            </div>
          )}
          {group.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{group.location}</span>
            </div>
          )}
          {canManage && (
            <div className="flex items-center gap-2">
              <UsersRound className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{group.members.length} membros</span>
            </div>
          )}
        </div>
      </div>

      {canManage ? (
        <GroupMembersManager group={group} />
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          A lista de membros é restrita à equipe responsável pelos cadastros.
        </p>
      )}
    </div>
  )
}
