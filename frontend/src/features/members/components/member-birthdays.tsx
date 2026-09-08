"use client"

import { Cake } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { GetMembers200DataItem } from "@/lib/api/generated/model"

function initials(name: string) { return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() }

function nextBirthday(birthDate: string) {
  const original = new Date(birthDate)
  const today = new Date()
  const birthday = new Date(today.getFullYear(), original.getMonth(), original.getDate())
  if (birthday < new Date(today.getFullYear(), today.getMonth(), today.getDate())) birthday.setFullYear(today.getFullYear() + 1)
  return birthday
}

export function MemberBirthdays({ members }: { members: GetMembers200DataItem[] }) {
  const today = new Date()
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30)
  const upcoming = members.filter((member) => member.birthDate).map((member) => ({ member, date: nextBirthday(member.birthDate as string) })).filter(({ date }) => date <= end).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 6)

  return <Card><CardHeader className="p-5 pb-3"><CardTitle className="flex items-center gap-2 text-xl"><Cake className="h-4 w-4 text-primary" aria-hidden="true" />Aniversariantes</CardTitle><CardDescription>Próximos 30 dias entre os membros carregados.</CardDescription></CardHeader><CardContent className="px-5 pb-5">{upcoming.length ? <div className="space-y-2">{upcoming.map(({ member, date }) => <div key={member.id} className="flex items-center justify-between gap-3 rounded-lg border p-2.5"><div className="flex min-w-0 items-center gap-3"><Avatar className="h-8 w-8"><AvatarImage src={member.image ?? undefined} alt="" /><AvatarFallback className="text-xs">{initials(member.name)}</AvatarFallback></Avatar><p className="truncate text-sm font-medium">{member.name}</p></div><Badge variant="secondary" className="text-[11px]">{date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</Badge></div>)}</div> : <p className="rounded-lg border border-dashed p-3 text-center text-sm text-muted-foreground">Nenhum aniversário nos próximos 30 dias.</p>}</CardContent></Card>
}
