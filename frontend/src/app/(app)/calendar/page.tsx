"use client";

import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Repeat2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEvents } from "@/lib/api/generated/events/events";
import type { GetEvents200DataItem } from "@/lib/api/generated/model";
import { hasPermission } from "@/lib/permissions";
import { useAuthStore } from "@/lib/stores/auth-store";

type CalendarOccurrence = { event: GetEvents200DataItem; date: Date };

function occurrencesForMonth(
  event: GetEvents200DataItem,
  month: Date,
): CalendarOccurrence[] {
  const start = new Date(event.startDate);
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  if (!event.recurrenceRule) {
    return start >= monthStart && start <= monthEnd
      ? [{ event, date: start }]
      : [];
  }

  // Séries antigas, criadas antes do campo de término, são limitadas a 12 meses.
  const seriesEnd = event.recurrenceEndDate
    ? new Date(event.recurrenceEndDate)
    : addMonths(start, 12);
  if (seriesEnd < monthStart || start > monthEnd) return [];

  const exceptions = event.recurrenceExceptions.map((date) => new Date(date));
  const advance = (date: Date) =>
    event.recurrenceRule === "WEEKLY" ? addWeeks(date, 1) : addMonths(date, 1);
  const occurrences: CalendarOccurrence[] = [];
  let cursor = start;
  let iterations = 0;

  while (cursor < monthStart && cursor <= seriesEnd && iterations < 600) {
    cursor = advance(cursor);
    iterations += 1;
  }
  while (cursor <= monthEnd && cursor <= seriesEnd && iterations < 650) {
    if (!exceptions.some((exception) => isSameDay(exception, cursor))) {
      occurrences.push({ event, date: cursor });
    }
    cursor = advance(cursor);
    iterations += 1;
  }
  return occurrences;
}

export default function CalendarPage() {
  const role = useAuthStore((state) => state.user?.role);
  const canManageEvents = hasPermission(role, "EVENTS_MANAGE");
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const { data, isLoading, isError } = useGetEvents(
    { page: 1, limit: 100, sortBy: "startDate", order: "asc" },
    { query: { refetchOnWindowFocus: false } },
  );
  const occurrences = useMemo(
    () =>
      (data?.data ?? [])
        .flatMap((event) => occurrencesForMonth(event, month))
        .sort((left, right) => left.date.getTime() - right.date.getTime()),
    [data?.data, month],
  );
  const gridStart = startOfWeek(month, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days = [];
  for (let cursor = gridStart; cursor <= gridEnd; cursor = addDays(cursor, 1))
    days.push(cursor);

  return (
    <div className="space-y-5">
      <PageHeader
        routeName="Planejamento"
        title="Calendário"
        subtitle="Os encontros são os mesmos eventos da agenda, organizados por data."
        breadcrumb={[{ label: "Calendário" }]}
        variant="compact"
      >
        <Button variant="outline" asChild>
          <Link href="/events">Ver eventos</Link>
        </Button>
        {canManageEvents && (
          <Button asChild>
            <Link href="/events?new=1">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Novo evento
            </Link>
          </Button>
        )}
      </PageHeader>

      <Card>
        <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="capitalize">
              {format(month, "MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
            <CardDescription>
              {occurrences.length} encontro(s) neste mês. Selecione um para
              {canManageEvents ? " abrir o check-in." : " consultar a agenda."}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMonth(addMonths(month, -1))}
              aria-label="Mês anterior"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setMonth(startOfMonth(new Date()))}
            >
              Hoje
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMonth(addMonths(month, 1))}
              aria-label="Próximo mês"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-6 text-center text-sm text-destructive"
            >
              Não foi possível carregar a agenda. Tente novamente em instantes.
            </div>
          ) : isLoading ? (
            <Skeleton className="h-[420px] w-full" />
          ) : !occurrences.length ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <CalendarDays
                className="mx-auto mb-3 h-9 w-9 text-muted-foreground/60"
                aria-hidden="true"
              />
              <p className="font-medium">Nenhum encontro neste mês</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                Crie um evento na agenda para ele aparecer aqui. Eventos
                recorrentes respeitam a data final e as exceções cadastradas.
              </p>
              {canManageEvents && (
                <Button className="mt-4" asChild>
                  <Link href="/events?new=1">
                    <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                    Criar primeiro evento
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2 md:hidden">
                {occurrences.map(({ event, date }) => (
                  <Link
                    key={`${event.id}-${date.toISOString()}-mobile`}
                    href={canManageEvents ? `/events/${event.id}/check-in` : "/events"}
                    className="group flex items-center justify-between gap-3 rounded-lg border bg-card p-3 transition-colors hover:border-accent-hover hover:bg-accent-hover hover:text-accent-hover-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground transition-colors group-hover:text-accent-hover-foreground/80">
                        {format(date, "EEEE, dd 'de' MMMM 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    {event.recurrenceRule && (
                      <Repeat2
                        className="h-4 w-4 shrink-0"
                        aria-label="Evento recorrente"
                      />
                    )}
                  </Link>
                ))}
              </div>

              <div className="hidden md:block">
                <div className="grid grid-cols-7 border-b text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(
                    (day) => (
                      <div key={day} className="p-3">
                        {day}
                      </div>
                    ),
                  )}
                </div>
                <div className="grid grid-cols-7">
                  {days.map((day) => {
                    const dayEvents = occurrences.filter((occurrence) =>
                      isSameDay(occurrence.date, day),
                    );
                    const outside = day.getMonth() !== month.getMonth();
                    return (
                      <div
                        key={day.toISOString()}
                        className={`min-h-28 border-b border-r p-2 ${outside ? "bg-muted/20 text-muted-foreground" : ""}`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span
                            className={`text-sm ${isSameDay(day, new Date()) ? "flex h-7 w-7 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground" : ""}`}
                          >
                            {format(day, "d")}
                          </span>
                          {dayEvents.length > 0 && (
                            <span className="text-[10px] text-muted-foreground">
                              {dayEvents.length}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map(({ event, date }) => (
                            <Link
                              key={`${event.id}-${date.toISOString()}`}
                              href={canManageEvents ? `/events/${event.id}/check-in` : "/events"}
                              className="group block rounded-md border border-primary/15 bg-primary/5 px-2 py-1.5 text-xs transition-colors hover:border-accent-hover hover:bg-accent-hover hover:text-accent-hover-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              aria-label={canManageEvents ? `Abrir check-in de ${event.title}` : `Ver ${event.title} na agenda`}
                            >
                              <p className="truncate font-medium">
                                {event.title}
                              </p>
                              <p className="mt-0.5 flex items-center gap-1 text-muted-foreground transition-colors group-hover:text-accent-hover-foreground/80">
                                {format(date, "HH:mm")}
                                {event.recurrenceRule && (
                                  <Repeat2
                                    className="h-3 w-3"
                                    aria-label="Recorrente"
                                  />
                                )}
                              </p>
                            </Link>
                          ))}
                          {dayEvents.length > 3 && (
                            <Badge variant="outline" className="text-[10px]">
                              +{dayEvents.length - 3} mais
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
        Séries recorrentes têm término obrigatório e podem ignorar datas
        específicas.
      </div>
    </div>
  );
}
