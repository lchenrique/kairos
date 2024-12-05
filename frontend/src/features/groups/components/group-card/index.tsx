"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User, Calendar, Edit } from "lucide-react"
import type { GetGroups200GroupsItem } from "@/lib/api/generated/model"

interface GroupCardProps {
  group: GetGroups200GroupsItem
  onEdit?: () => void
}

export function GroupCard({ group, onEdit }: GroupCardProps) {
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
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={group.status === "ACTIVE" ? "default" : "secondary"}>
          {group.status === "ACTIVE" ? "Ativo" : "Inativo"}
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
          {group.meetingTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{group.meetingTime}</span>
            </div>
          )}
          {group.meetingLocation && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{group.meetingLocation}</span>
            </div>
          )}
          {group.leader && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{group.leader}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
