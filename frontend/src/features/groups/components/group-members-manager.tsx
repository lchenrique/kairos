"use client"

import { useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { UserPlus, UserRoundMinus, UsersRound } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetMembers } from "@/lib/api/generated/members/members"
import {
  getGetGroupsIdQueryKey,
  getGetGroupsQueryKey,
  useDeleteGroupsIdMembersMemberId,
  useGetGroupsId,
  usePostGroupsIdMembers,
} from "@/lib/api/generated/groups/groups"
import type { GetGroups200DataItem, GetGroupsId200MembersItem, PostGroupsIdMembersBodyRole } from "@/lib/api/generated/model"

type GroupMember = GetGroupsId200MembersItem

const roleLabel: Record<PostGroupsIdMembersBodyRole, string> = {
  LEADER: "Líder",
  MEMBER: "Membro",
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function GroupMembersManager({ group }: { group: GetGroups200DataItem }) {
  const queryClient = useQueryClient()
  const detail = useGetGroupsId(group.id)
  const members = detail.data?.members ?? (group.members as unknown as GroupMember[])
  const [memberId, setMemberId] = useState("")
  const [role, setRole] = useState<PostGroupsIdMembersBodyRole>("MEMBER")
  const { data: membersResponse, isLoading: isLoadingMembers } = useGetMembers({ page: 1, limit: 100 }, { query: { refetchOnWindowFocus: false } })
  const availableMembers = useMemo(
    () => (membersResponse?.data ?? []).filter((member) => !members.some((groupMember) => groupMember.memberId === member.id)),
    [members, membersResponse?.data],
  )

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: getGetGroupsQueryKey() })
    queryClient.invalidateQueries({ queryKey: getGetGroupsIdQueryKey(group.id) })
  }

  const addMember = usePostGroupsIdMembers({
    mutation: {
      onSuccess: () => {
        toast.success("Membro adicionado ao grupo")
        setMemberId("")
        refresh()
      },
      onError: () => toast.error("Não foi possível adicionar o membro"),
    },
  })

  const removeMember = useDeleteGroupsIdMembersMemberId({
    mutation: {
      onSuccess: () => {
        toast.success("Membro removido do grupo")
        refresh()
      },
      onError: () => toast.error("Não foi possível remover o membro"),
    },
  })

  return (
    <section className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 font-semibold"><UsersRound className="h-4 w-4 text-primary" aria-hidden="true" />Membros e liderança</h3>
          <p className="mt-1 text-xs text-muted-foreground">Defina quem participa e quem cuida deste grupo.</p>
        </div>
        <Badge variant="secondary">{members.length}</Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_150px_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor={`group-member-${group.id}`}>Adicionar membro</Label>
          <Select value={memberId} onValueChange={setMemberId} disabled={isLoadingMembers || !availableMembers.length}>
            <SelectTrigger id={`group-member-${group.id}`}><SelectValue placeholder={isLoadingMembers ? "Carregando…" : availableMembers.length ? "Selecione uma pessoa" : "Todos já estão no grupo"} /></SelectTrigger>
            <SelectContent>{availableMembers.map((member) => <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Função</Label>
          <Select value={role} onValueChange={(value) => setRole(value as PostGroupsIdMembersBodyRole)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="MEMBER">Membro</SelectItem><SelectItem value="LEADER">Líder</SelectItem></SelectContent>
          </Select>
        </div>
        <Button type="button" disabled={!memberId || addMember.isPending} onClick={() => addMember.mutate({ id: group.id, data: { memberId, role } })}>
          <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />Adicionar
        </Button>
      </div>

      <div className="space-y-2">
        {detail.isLoading && !members.length ? <Skeleton className="h-16 w-full" /> : members.length === 0 ? <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">Ainda não há membros neste grupo.</p> : members.map((groupMember) => (
          <div key={groupMember.memberId} className="flex items-center justify-between gap-3 rounded-lg border p-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="h-9 w-9"><AvatarImage src={groupMember.member.avatar ?? undefined} alt="" /><AvatarFallback>{initials(groupMember.member.name)}</AvatarFallback></Avatar>
              <div className="min-w-0"><p className="truncate text-sm font-medium">{groupMember.member.name}</p><p className="text-xs text-muted-foreground">{groupMember.member.email || "Sem e-mail"}</p></div>
            </div>
            <div className="flex shrink-0 items-center gap-2"><Badge variant={groupMember.role === "LEADER" ? "default" : "outline"}>{roleLabel[groupMember.role]}</Badge><Button variant="ghost" size="icon" disabled={removeMember.isPending} onClick={() => window.confirm(`Remover ${groupMember.member.name} do grupo?`) && removeMember.mutate({ id: group.id, memberId: groupMember.memberId })} aria-label={`Remover ${groupMember.member.name}`}><UserRoundMinus className="h-4 w-4 text-destructive" aria-hidden="true" /></Button></div>
          </div>
        ))}
      </div>
    </section>
  )
}
