"use client"

import { CalendarDays, CheckCircle2, Clock3, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetMembersIdParticipation } from "@/lib/api/generated/members/members"
import type { GetMembers200DataItem } from "@/lib/api/generated/model"

const labels = { CONFIRMED: "Confirmado", PENDING: "Pendente", CANCELLED: "Cancelado" } as const

export function MemberParticipation({ member }: { member: GetMembers200DataItem }) {
  const { data, isLoading, isError } = useGetMembersIdParticipation(member.id, { query: { refetchOnWindowFocus: false } })
  if (isLoading) return <div className="space-y-3"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>
  if (isError) return <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Não foi possível carregar o histórico.</p>
  if (!data?.length) return <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Ainda não há participação registrada para este membro.</p>
  return <div className="space-y-3">{data.map((item) => { const Icon = item.status === "CONFIRMED" ? CheckCircle2 : item.status === "CANCELLED" ? XCircle : Clock3; return <div key={`${item.eventId}-${item.startDate}`} className="flex items-center justify-between gap-3 rounded-lg border p-3"><div className="flex min-w-0 items-center gap-3"><Icon className={`h-4 w-4 shrink-0 ${item.status === "CONFIRMED" ? "text-emerald-600" : item.status === "CANCELLED" ? "text-destructive" : "text-amber-600"}`} aria-hidden="true" /><div className="min-w-0"><p className="truncate text-sm font-medium">{item.title}</p><p className="flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="h-3 w-3" aria-hidden="true" />{new Date(item.startDate).toLocaleDateString("pt-BR")}</p></div></div><Badge variant={item.status === "CONFIRMED" ? "default" : item.status === "CANCELLED" ? "destructive" : "secondary"}>{labels[item.status]}</Badge></div> })}</div>
}
