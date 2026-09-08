"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarPlus, CalendarDays } from "lucide-react"

export function EventListHeader({ total, onCreate }: { total: number; onCreate?: () => void }) {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />Agenda da comunidade</div>
        <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
        <p className="mt-1 text-muted-foreground">Planeje encontros, cultos e momentos importantes para sua igreja.</p>
        <p className="mt-2 text-sm text-muted-foreground"><span className="font-semibold text-foreground">{total}</span> eventos cadastrados</p>
      </div>

      <div className="flex w-full gap-2 sm:w-auto">
        <Button variant="outline" asChild className="flex-1 sm:flex-none"><Link href="/calendar"><CalendarDays className="mr-2 h-4 w-4" aria-hidden="true" />Calendário</Link></Button>
        {onCreate && (
          <Button onClick={onCreate} className="flex-1 sm:flex-none">
            <CalendarPlus className="mr-2 h-4 w-4" aria-hidden="true" />
            Novo evento
          </Button>
        )}
      </div>
    </div>
  )
}
