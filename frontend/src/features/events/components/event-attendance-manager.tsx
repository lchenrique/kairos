"use client"

import { useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CheckCircle2, QrCode, UserPlus, UserRoundMinus, UsersRound } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  getGetEventsIdQueryKey,
  getGetEventsQueryKey,
  useDeleteEventsEventIdParticipantsMemberId,
  useGetEventsId,
  usePatchEventsEventIdParticipantsMemberIdStatus,
  usePostEventsEventIdParticipants,
} from "@/lib/api/generated/events/events"
import { useGetMembers } from "@/lib/api/generated/members/members"
import type { GetEvents200DataItem, GetEventsId200ParticipantsItem, GetEventsId200ParticipantsItemStatus, PatchEventsEventIdParticipantsMemberIdStatusBodyStatus, PostEventsEventIdParticipantsBodyStatus } from "@/lib/api/generated/model"
import { QRCodeSVG } from "qrcode.react"

const statusLabels: Record<GetEventsId200ParticipantsItemStatus, string> = {
  CONFIRMED: "Confirmado",
  PENDING: "Pendente",
  CANCELLED: "Cancelado",
}

const statusVariant: Record<GetEventsId200ParticipantsItemStatus, "default" | "secondary" | "destructive" | "outline"> = {
  CONFIRMED: "default",
  PENDING: "secondary",
  CANCELLED: "destructive",
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()
}

export function EventAttendanceManager({ event }: { event: GetEvents200DataItem }) {
  const queryClient = useQueryClient()
  const detail = useGetEventsId(event.id)
  const participants = detail.data?.participants ?? (event.participants as unknown as GetEventsId200ParticipantsItem[])
  const [memberId, setMemberId] = useState("")
  const [newStatus, setNewStatus] = useState<PostEventsEventIdParticipantsBodyStatus>("PENDING")
  const [qrOpen, setQrOpen] = useState(false)
  const { data: membersResponse, isLoading: isLoadingMembers } = useGetMembers({ page: 1, limit: 100 }, { query: { refetchOnWindowFocus: false } })
  const availableMembers = useMemo(() => (membersResponse?.data ?? []).filter((member) => !participants.some((participant) => participant.memberId === member.id)), [membersResponse?.data, participants])
  const confirmed = participants.filter((participant) => participant.status === "CONFIRMED").length
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: getGetEventsQueryKey() })
    queryClient.invalidateQueries({ queryKey: getGetEventsIdQueryKey(event.id) })
  }
  const checkInUrl = typeof window !== "undefined" ? `${window.location.origin}/events/${event.id}/check-in` : `/events/${event.id}/check-in`

  const updateStatus = usePatchEventsEventIdParticipantsMemberIdStatus({
    mutation: {
      onSuccess: () => { toast.success("Presença atualizada"); refresh() },
      onError: () => toast.error("Não foi possível atualizar a presença"),
    },
  })
  const addParticipant = usePostEventsEventIdParticipants({
    mutation: {
      onSuccess: () => { toast.success("Participante adicionado"); setMemberId(""); refresh() },
      onError: () => toast.error("Não foi possível adicionar o participante"),
    },
  })
  const removeParticipant = useDeleteEventsEventIdParticipantsMemberId({
    mutation: {
      onSuccess: () => { toast.success("Participante removido"); refresh() },
      onError: () => toast.error("Não foi possível remover o participante"),
    },
  })

  return (
    <section className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div><h3 className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />Controle de presença</h3><p className="mt-1 text-xs text-muted-foreground">Acompanhe quem confirmou e atualize a lista em tempo real.</p></div>
        <Dialog open={qrOpen} onOpenChange={setQrOpen}><DialogTrigger asChild><Button variant="outline" size="sm"><QrCode className="mr-2 h-4 w-4" aria-hidden="true" />QR Code</Button></DialogTrigger><DialogContent className="sm:max-w-sm"><DialogHeader><DialogTitle>Check-in rápido</DialogTitle><DialogDescription>Mostre este código para a equipe abrir a tela de presença no celular.</DialogDescription></DialogHeader><div className="flex flex-col items-center gap-4 rounded-xl bg-white p-5"><QRCodeSVG value={checkInUrl} size={220} includeMargin fgColor="#111827" bgColor="#ffffff" /><p className="max-w-full break-all text-center text-xs text-slate-500">{checkInUrl}</p></div></DialogContent></Dialog>
        <Badge variant="secondary">{confirmed}/{participants.length}</Badge>
      </div>
      <div className="space-y-2"><div className="flex justify-between text-xs text-muted-foreground"><span>Confirmações</span><span>{participants.length ? Math.round((confirmed / participants.length) * 100) : 0}%</span></div><Progress value={participants.length ? (confirmed / participants.length) * 100 : 0} className="h-2" /></div>
      <div className="grid gap-3 sm:grid-cols-[1fr_150px_auto] sm:items-end">
        <div className="space-y-2"><Label htmlFor={`event-member-${event.id}`}>Adicionar participante</Label><Select value={memberId} onValueChange={setMemberId} disabled={isLoadingMembers || !availableMembers.length}><SelectTrigger id={`event-member-${event.id}`}><SelectValue placeholder={isLoadingMembers ? "Carregando…" : availableMembers.length ? "Selecione uma pessoa" : "Todos já estão na lista"} /></SelectTrigger><SelectContent>{availableMembers.map((member) => <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label>Status inicial</Label><Select value={newStatus} onValueChange={(value) => setNewStatus(value as PostEventsEventIdParticipantsBodyStatus)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PENDING">Pendente</SelectItem><SelectItem value="CONFIRMED">Confirmado</SelectItem><SelectItem value="CANCELLED">Cancelado</SelectItem></SelectContent></Select></div>
        <Button type="button" disabled={!memberId || addParticipant.isPending} onClick={() => addParticipant.mutate({ eventId: event.id, data: { memberId, status: newStatus } })}><UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />Adicionar</Button>
      </div>
      <div className="space-y-2">
        {detail.isLoading && !participants.length ? <Skeleton className="h-16 w-full" /> : participants.length === 0 ? <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">Nenhum participante adicionado.</p> : participants.map((participant) => <div key={participant.memberId} className="flex items-center justify-between gap-3 rounded-lg border p-3"><div className="flex min-w-0 items-center gap-3"><Avatar className="h-9 w-9"><AvatarImage src={participant.member.image ?? undefined} alt="" /><AvatarFallback>{initials(participant.member.name)}</AvatarFallback></Avatar><div className="min-w-0"><p className="truncate text-sm font-medium">{participant.member.name}</p><p className="text-xs text-muted-foreground">{participant.member.email || "Sem e-mail"}</p></div></div><div className="flex shrink-0 items-center gap-1"><Select value={participant.status} onValueChange={(value) => updateStatus.mutate({ eventId: event.id, memberId: participant.memberId, data: { status: value as PatchEventsEventIdParticipantsMemberIdStatusBodyStatus } })}><SelectTrigger className="h-8 w-[122px] text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PENDING">Pendente</SelectItem><SelectItem value="CONFIRMED">Confirmado</SelectItem><SelectItem value="CANCELLED">Cancelado</SelectItem></SelectContent></Select><Badge variant={statusVariant[participant.status]} className="hidden sm:inline-flex">{statusLabels[participant.status]}</Badge><Button variant="ghost" size="icon" disabled={removeParticipant.isPending} onClick={() => window.confirm(`Remover ${participant.member.name} do evento?`) && removeParticipant.mutate({ eventId: event.id, memberId: participant.memberId })} aria-label={`Remover ${participant.member.name}`}><UserRoundMinus className="h-4 w-4 text-destructive" aria-hidden="true" /></Button></div></div>)}
      </div>
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><UsersRound className="h-3.5 w-3.5" aria-hidden="true" />A presença pode ser atualizada durante o evento pelo mesmo painel.</p>
    </section>
  )
}
