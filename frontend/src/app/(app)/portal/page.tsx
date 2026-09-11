"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { CalendarDays, ChevronRight, HeartHandshake, QrCode, UsersRound } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetEvents } from "@/lib/api/generated/events/events"
import type { GetEventsParams } from "@/lib/api/generated/model"
import { hasPermission } from "@/lib/permissions"
import { useAuthStore } from "@/lib/stores/auth-store"
import { cn } from "@/lib/utils"

export default function PortalPage() {
  const role = useAuthStore((state) => state.user?.role)
  const canViewGroups = hasPermission(role, "GROUPS_VIEW")
  const canManageEvents = hasPermission(role, "EVENTS_MANAGE")
  const [startDate] = useState(() => new Date().toISOString())
  const eventsParams = useMemo<GetEventsParams>(
    () => ({
      page: 1,
      limit: 6,
      startDate,
      sortBy: "startDate",
      order: "asc",
    }),
    [startDate],
  )
  const { data, isLoading } = useGetEvents(eventsParams, {
    query: { refetchOnWindowFocus: false },
  })

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-foreground p-6 text-background shadow-xl shadow-foreground/10 sm:p-8">
        <div
          className="absolute -right-14 -top-16 h-48 w-48 rounded-full border-[24px] border-accent/25"
          aria-hidden="true"
        />
        <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-background">
          Kairos · Portal
        </p>
        <h1 className="relative mt-3 font-display text-4xl font-medium leading-tight sm:text-5xl">
          Sua comunidade em um só lugar
        </h1>
        <p className="relative mt-3 max-w-lg text-sm leading-6 text-background/70">
          Acompanhe os próximos encontros e consulte a agenda da comunidade de forma simples no celular.
        </p>
      </div>

      <div className={cn("grid gap-3 sm:grid-cols-2", canViewGroups && canManageEvents && "sm:grid-cols-3")}>
        <Button asChild variant="outline" className="group h-auto min-h-[76px] justify-start p-4 hover:bg-accent-hover hover:text-accent-hover-foreground">
          <Link href="/events">
            <CalendarDays className="mr-3 h-5 w-5 text-primary transition-colors group-hover:text-accent-hover-foreground" aria-hidden="true" />
            <span className="text-left">
              <strong className="block transition-colors group-hover:text-accent-hover-foreground">Eventos</strong>
              <small className="text-muted-foreground transition-colors group-hover:text-accent-hover-foreground/80">Ver agenda e encontros</small>
            </span>
          </Link>
        </Button>
        {canViewGroups && (
          <Button asChild variant="outline" className="group h-auto min-h-[76px] justify-start p-4 hover:bg-accent-hover hover:text-accent-hover-foreground">
            <Link href="/groups">
              <UsersRound className="mr-3 h-5 w-5 text-primary transition-colors group-hover:text-accent-hover-foreground" aria-hidden="true" />
              <span className="text-left">
                <strong className="block transition-colors group-hover:text-accent-hover-foreground">Grupos</strong>
                <small className="text-muted-foreground transition-colors group-hover:text-accent-hover-foreground/80">Consultar encontros</small>
              </span>
            </Link>
          </Button>
        )}
        {canManageEvents && (
          <Button asChild variant="outline" className="group h-auto min-h-[76px] justify-start p-4 hover:bg-accent-hover hover:text-accent-hover-foreground">
            <Link href="/events">
              <QrCode className="mr-3 h-5 w-5 text-primary transition-colors group-hover:text-accent-hover-foreground" aria-hidden="true" />
              <span className="text-left">
                <strong className="block transition-colors group-hover:text-accent-hover-foreground">Check-in</strong>
                <small className="text-muted-foreground transition-colors group-hover:text-accent-hover-foreground/80">Escolher evento</small>
              </span>
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-primary" aria-hidden="true" />
            Próximos encontros
          </CardTitle>
          <CardDescription>
            Encontros são eventos da agenda. Consulte os detalhes de data e local.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-16 w-full" />)
          ) : !data?.data.length ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">Nenhum encontro agendado.</p>
              {canManageEvents && (
                <Button variant="link" asChild className="mt-1">
                  <Link href="/events?new=1">Criar primeiro evento</Link>
                </Button>
              )}
            </div>
          ) : (
            data.data.map((event) => {
              const href = canManageEvents ? `/events/${event.id}/check-in` : "/events"
              return (
                <div key={event.id} className="group flex items-center justify-between gap-3 rounded-xl border p-4 transition-colors hover:border-accent-hover/40 hover:bg-accent-hover hover:text-accent-hover-foreground">
                  <div className="min-w-0">
                    <Link href={href} className="block truncate font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {event.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground transition-colors group-hover:text-accent-hover-foreground/80">
                      {new Date(event.startDate).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                      {event.location ? ` · ${event.location}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {canManageEvents && (
                      <Badge variant="outline" className="group-hover:border-accent-hover-foreground/40 group-hover:text-accent-hover-foreground">
                        {event.participants.length} pessoas
                      </Badge>
                    )}
                    <Button asChild variant="ghost" size="icon" className="hover:bg-accent-hover-foreground/15 hover:text-accent-hover-foreground" aria-label={`Abrir ${event.title}`}>
                      <Link href={href}>
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
