"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, Plus, Users, X } from "lucide-react"
import type { GetGroups200GroupsItem } from "@/lib/api/generated/model"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MemberSelect } from "@/components/members/member-select"
import { useAddGroupMember } from "@/hooks/groups/use-add-group-member"
import { useRemoveGroupMember } from "@/hooks/groups/use-remove-group-member"
import { toast } from "sonner"

interface GroupProfileProps {
  group: GetGroups200GroupsItem
  onEdit?: () => void
}

export function GroupProfile({ group, onEdit }: GroupProfileProps) {
  const { mutate: addMember } = useAddGroupMember()
  const { mutate: removeMember } = useRemoveGroupMember()

  const handleAddMember = (memberId: string) => {
    addMember({ groupId: group.id, memberId }, {
      onSuccess: () => {
        toast.success("Membro adicionado ao grupo com sucesso!")
      },
      onError: () => {
        toast.error("Erro ao adicionar membro ao grupo")
      }
    })
  }

  const handleRemoveMember = (memberId: string) => {
    removeMember({ groupId: group.id, memberId }, {
      onSuccess: () => {
        toast.success("Membro removido do grupo com sucesso!")
      },
      onError: () => {
        toast.error("Erro ao remover membro do grupo")
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-primary/20">
            <AvatarFallback>{group.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{group.name}</h2>
            <p className="text-muted-foreground">
              {group.type === "CELL" && "Célula"}
              {group.type === "MINISTRY" && "Ministério"}
              {group.type === "DEPARTMENT" && "Departamento"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            Editar Grupo
          </Button>
        </div>
      </div>

      <Separator />

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações do Grupo</h3>
            <div className="grid gap-4">
              {group.meetingDay && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>{group.meetingDay}</span>
                </div>
              )}
              {group.meetingTime && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{group.meetingTime}</span>
                </div>
              )}
              {group.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{group.location}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Descrição</h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {group.description || "Nenhuma descrição disponível"}
            </p>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Membros</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Membro
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Membro ao Grupo</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <MemberSelect onSelect={handleAddMember} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-4">
              {group.members?.map((groupMember) => (
                <div key={groupMember.memberId} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarImage src={groupMember.member.avatar ?? undefined} alt={groupMember.member.name} />
                      <AvatarFallback>{groupMember.member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{groupMember.member.name}</p>
                      <p className="text-sm text-muted-foreground">{groupMember.role || "Membro"}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(groupMember.memberId)}
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
              {(!group.members || group.members.length === 0) && (
                <p className="text-sm text-muted-foreground">Nenhum membro</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
