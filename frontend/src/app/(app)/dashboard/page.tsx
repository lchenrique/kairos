"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Flame,
  HeartHandshake,
  Layers,
  MapPin,
  Plus,
  QrCode,
  UserCheck,
  Users2,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { useGetEvents } from "@/lib/api/generated/events/events";
import type { GetEvents200DataItem } from "@/lib/api/generated/model/getEvents200DataItem";
import { useDashboardOverview } from "@/hooks/use-dashboard-overview";
import { useAuthStore } from "@/lib/stores/auth-store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const itemMotion = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const shouldReduceMotion = useReducedMotion();
  const firstName = user?.name?.split(" ")[0] || "Líder";
  const today = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay.toISOString();
  }, []);

  const [activeTab, setActiveTab] = useState<"ALL" | "SERVICE" | "CELL" | "MINISTRY">("ALL");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const {
    data: eventsResponse,
    isLoading: eventsLoading,
    isError: eventsError,
  } = useGetEvents(
    {
      page: 1,
      limit: 8,
      startDate: today,
      status: "SCHEDULED",
      sortBy: "startDate",
      order: "asc",
    },
    { query: { refetchOnWindowFocus: false } },
  );

  const {
    data: report,
    isLoading: reportLoading,
    isError: reportError,
  } = useDashboardOverview();

  const allEvents = useMemo(() => eventsResponse?.data ?? [], [eventsResponse]);

  const filteredEvents = useMemo(() => {
    if (activeTab === "ALL") return allEvents;
    return allEvents.filter((ev) => ev.type === activeTab);
  }, [allEvents, activeTab]);

  const selectedEvent = useMemo(() => {
    if (selectedEventId) {
      const found = filteredEvents.find((e) => e.id === selectedEventId);
      if (found) return found;
    }
    return filteredEvents[0] || null;
  }, [filteredEvents, selectedEventId]);

  const inactiveMembers = Math.max(
    0,
    (report?.membersTotal ?? 0) - (report?.activeMembers ?? 0),
  );

  const currentDateFormatted = useMemo(() => {
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date());
  }, []);

  return (
    <motion.div
      className="space-y-6"
      initial={shouldReduceMotion ? undefined : "hidden"}
      animate={shouldReduceMotion ? undefined : "show"}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.07 } },
      }}
    >
      {/* Top Welcome & Quick Actions Bar (Finnova Header Style) */}
      <motion.div
        variants={itemMotion}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              Visão geral
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {currentDateFormatted}
            </span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Olá, {firstName}.
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Membros, encontros e presença. Sua comunidade em uma só visão.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-border/80 bg-card px-4 text-xs font-semibold shadow-sm hover:bg-muted"
          >
            <Link href="/members">
              <UsersRound className="mr-1.5 h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Membros
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-border/80 bg-card px-4 text-xs font-semibold shadow-sm hover:bg-muted"
          >
            <Link href="/portal">
              <QrCode className="mr-1.5 h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Check-in
            </Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90"
          >
            <Link href="/events?new=1">
              <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Criar Encontro
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Top 4 Finnova KPI Cards */}
      <motion.div variants={itemMotion}>
        <DashboardStats />
      </motion.div>

      {/* Finnova Filter Pills Navigation */}
      <motion.div
        variants={itemMotion}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-border/70 bg-card/60 p-1.5 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            aria-pressed={activeTab === "ALL"}
            className={cn(
              "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
              activeTab === "ALL"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            Todos os Encontros ({allEvents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("SERVICE")}
            aria-pressed={activeTab === "SERVICE"}
            className={cn(
              "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
              activeTab === "SERVICE"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            Cultos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("CELL")}
            aria-pressed={activeTab === "CELL"}
            className={cn(
              "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
              activeTab === "CELL"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            Células & Grupos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("MINISTRY")}
            aria-pressed={activeTab === "MINISTRY"}
            className={cn(
              "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
              activeTab === "MINISTRY"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            Ministérios
          </button>
        </div>

        <Button variant="ghost" size="sm" asChild className="rounded-full text-xs text-muted-foreground">
          <Link href="/calendar" className="flex items-center gap-1">
            Ver calendário completo
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </Button>
      </motion.div>

      {/* SIGNATURE FINNOVA CENTERPIECE: High-Contrast Dark Slate Command Showcase */}
      <motion.div
        variants={itemMotion}
        className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm lg:p-7"
      >
        {/* Ambient Glow Effects */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.1fr,1.4fr] xl:grid-cols-[1fr,1.35fr]">
          {/* Left Column: Interactive Event List */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Agenda Próxima
                </p>
                <h3 className="text-lg font-bold text-card-foreground">
                  Encontros & Celebrações
                </h3>
              </div>
              <span className="rounded-full border border-border bg-muted/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {filteredEvents.length} agendados
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto pr-1">
              {eventsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl bg-muted/60" />
                ))
              ) : eventsError ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
                  Erro ao carregar a lista de eventos.
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/40 p-8 text-center">
                  <CalendarDays className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    Nenhum encontro agendado nesta categoria.
                  </p>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="mt-4 rounded-full border-border bg-muted text-xs text-card-foreground hover:bg-muted/70"
                  >
                    <Link href="/events?new=1">
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Agendar Agora
                    </Link>
                  </Button>
                </div>
              ) : (
                filteredEvents.map((ev: GetEvents200DataItem) => {
                  const isSelected = selectedEvent?.id === ev.id;
                  const dateFormatted = new Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(ev.startDate));

                  const typeLabel =
                    ev.type === "SERVICE"
                      ? "Culto"
                      : ev.type === "CELL"
                        ? "Célula"
                        : ev.type === "MINISTRY"
                          ? "Ministério"
                          : "Evento";

                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => setSelectedEventId(ev.id)}
                      className={cn(
                        "w-full text-left rounded-2xl p-3.5 transition-all duration-200 border",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30"
                          : "bg-background/70 border-border/70 text-muted-foreground hover:bg-muted/80 hover:border-border",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            isSelected
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted text-muted-foreground border border-border",
                          )}
                        >
                          {typeLabel}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            isSelected ? "text-primary-foreground/90" : "text-muted-foreground",
                          )}
                        >
                          {dateFormatted}
                        </span>
                      </div>

                      <p
                        className={cn(
                          "mt-1.5 truncate text-sm font-semibold",
                            isSelected ? "text-primary-foreground" : "text-card-foreground/90",
                        )}
                      >
                        {ev.title}
                      </p>

                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span
                          className={cn(
                            "truncate max-w-[170px]",
                            isSelected ? "text-primary-foreground/80" : "text-muted-foreground",
                          )}
                        >
                          {ev.location || "Templo principal"}
                        </span>
                        <span
                          className={cn(
                            "font-medium",
                            isSelected ? "text-primary-foreground" : "text-primary",
                          )}
                        >
                          {(ev.participants?.filter((p) => p.status === "CONFIRMED").length ?? 0)} confirmados
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Finnova Spotlight Preview Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-background/60 p-5 backdrop-blur-md lg:p-6">
            {selectedEvent ? (
              <div className="space-y-5">
                {/* Header tag & quick status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-primary/30 bg-primary/15 px-3 py-0.5 text-xs font-semibold text-primary">
                      #{selectedEvent.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary motion-reduce:animate-none animate-pulse" />
                      Agendado
                    </span>
                  </div>

                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Intl.DateTimeFormat("pt-BR", {
                      weekday: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(selectedEvent.startDate))}
                  </span>
                </div>

                {/* Big Title & Location */}
                <div>
                  <h2 className="text-xl font-bold text-card-foreground sm:text-2xl">
                    {selectedEvent.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {selectedEvent.location || "Local principal da comunidade"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "medium",
                      }).format(new Date(selectedEvent.startDate))}
                    </span>
                  </div>
                  {selectedEvent.description && (
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {selectedEvent.description}
                    </p>
                  )}
                </div>

                {/* 3 Metric Pills inside Spotlight */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border/70 bg-background/50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Confirmados
                    </p>
                    <p className="mt-1 font-display text-xl font-bold text-card-foreground">
                      {selectedEvent.participants?.filter((p) => p.status === "CONFIRMED").length ?? 0}
                    </p>
                    <p className="text-[10px] font-medium text-primary flex items-center gap-0.5 mt-0.5">
                      <ArrowUpRight className="h-3 w-3" />
                      Em alta
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/70 bg-background/50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Meta Presença
                    </p>
                    <p className="mt-1 font-display text-xl font-bold text-card-foreground">
                      {Math.max(20, (selectedEvent.participants?.length ?? 0) + 15)}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Capacidade</p>
                  </div>

                  <div className="rounded-xl border border-border/70 bg-background/50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Check-in
                    </p>
                    <p className="mt-1 font-display text-xl font-bold text-primary">
                      {selectedEvent.participants?.length
                        ? Math.round(
                            (selectedEvent.participants.filter(
                              (p) => p.status === "CONFIRMED",
                            ).length /
                              selectedEvent.participants.length) *
                              100,
                          )
                        : 0}
                      %
                    </p>
                    <p className="text-[10px] font-medium text-primary mt-0.5">Taxa atual</p>
                  </div>
                </div>

                {/* Participants Preview */}
                <div className="flex items-center justify-between rounded-xl border border-border/70 bg-background/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 overflow-hidden">
                      {selectedEvent.participants && selectedEvent.participants.length > 0 ? (
                        selectedEvent.participants.slice(0, 4).map((p, idx) => (
                          <Avatar key={p.id || idx} className="h-7 w-7 border-2 border-background">
                            <AvatarImage src={p.member?.image || undefined} />
                            <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
                              {p.member?.name?.[0] || "M"}
                            </AvatarFallback>
                          </Avatar>
                        ))
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                          0
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {selectedEvent.participants?.length || 0} pessoas registradas na lista
                    </span>
                  </div>

                  <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-card-foreground hover:bg-muted">
                    <Link href={`/events/${selectedEvent.id}`}>
                      Ver lista
                    </Link>
                  </Button>
                </div>

                {/* Finnova CTA Action Row */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      className="rounded-full border-border bg-muted text-muted-foreground hover:bg-muted hover:text-card-foreground"
                      title="Abrir no Calendário"
                    >
                      <Link href="/calendar">
                        <CalendarDays className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      className="rounded-full border-border bg-muted text-muted-foreground hover:bg-muted hover:text-card-foreground"
                      title="Ver Detalhes do Evento"
                    >
                      <Link href={`/events/${selectedEvent.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <Button
                    asChild
                    className="rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                  >
                    <Link href={`/portal`}>
                      <QrCode className="mr-2 h-4 w-4" aria-hidden="true" />
                      Realizar Check-in
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <CalendarDays className="h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Selecione um evento ao lado para inspecionar os detalhes.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Two Column Section: Participation Status & Pastoral Alerts */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr,1fr]">
        {/* Attendance Progression Card */}
        <motion.div variants={itemMotion}>
          <Card className="h-full">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Confirmações & Presença Geral</CardTitle>
                  <CardDescription>
                    Status das participações nos últimos encontros
                  </CardDescription>
                </div>
                <Badge variant="outline" className="rounded-full font-medium">
                  {report?.attendance.total ?? 0} registros
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 px-6 pb-6">
              {reportError ? (
                <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
                  Não foi possível carregar os dados de participação.
                </p>
              ) : reportLoading ? (
                <Skeleton className="h-32 w-full rounded-2xl" />
              ) : report?.attendance.total ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Presenças Confirmadas
                      </span>
                      <span className="font-bold text-foreground">
                        {report.attendance.confirmed} (
                        {Math.round(
                          (report.attendance.confirmed / report.attendance.total) * 100,
                        )}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={(report.attendance.confirmed / report.attendance.total) * 100}
                      className="h-2.5 rounded-full bg-muted dark:bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        Aguardando Resposta / Pendentes
                      </span>
                      <span className="font-bold text-foreground">
                        {report.attendance.pending} (
                        {Math.round(
                          (report.attendance.pending / report.attendance.total) * 100,
                        )}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={(report.attendance.pending / report.attendance.total) * 100}
                      className="h-2.5 rounded-full bg-muted dark:bg-muted [&>div]:bg-amber-500"
                    />
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-primary" />
                      Dica de Cuidado Comunitário
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Líderes de célula que realizam check-in nos primeiros 15 minutos do encontro
                      apresentam 32% mais fidelidade na frequência de visitantes.
                    </p>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                  As confirmações de presença aparecerão aqui conforme os membros participarem das reuniões.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pastoral Attention & Quick Shortcuts */}
        <motion.div variants={itemMotion} className="space-y-6">
          <Card>
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-lg">Pontos de Atenção</CardTitle>
              <CardDescription>
                Cuidado pastoral preventivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6">
              {reportError ? (
                <p className="text-xs text-destructive">Não foi possível carregar os alertas.</p>
              ) : reportLoading ? (
                <Skeleton className="h-20 w-full rounded-xl" />
              ) : inactiveMembers === 0 && (report?.attendance.pending ?? 0) === 0 ? (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-primary/10 p-3.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-xs font-semibold text-primary dark:text-primary">
                      Tudo em ordem na comunidade
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-primary dark:text-primary">
                      Nenhuma pendência crítica de membros ou confirmações no momento.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {inactiveMembers > 0 && (
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3.5">
                      <Users2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <div className="text-xs">
                        <p className="font-semibold text-amber-900 dark:text-amber-200">
                          {inactiveMembers} {inactiveMembers === 1 ? "membro sem frequência" : "membros sem frequência"}
                        </p>
                        <p className="text-amber-800 dark:text-amber-200 mt-0.5">
                          Vale uma mensagem de acolhimento ou visita pastoral.
                        </p>
                      </div>
                    </div>
                  )}

                  {(report?.attendance.pending ?? 0) > 0 && (
                    <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-3.5">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div className="text-xs">
                        <p className="font-semibold text-foreground">
                          {report?.attendance.pending} confirmações pendentes
                        </p>
                        <p className="text-muted-foreground mt-0.5">
                          Aguardando resposta para os próximos encontros.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Shortcuts */}
          <Card>
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-lg">Atalhos de Gestão</CardTitle>
              <CardDescription>
                Ações frequentes com 1 clique
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 px-6 pb-6">
              <Button
                variant="outline"
                className="group h-11 justify-between rounded-xl border-border/70 hover:border-primary/40 hover:bg-primary/5"
                asChild
              >
                <Link href="/members">
                  <span className="flex items-center gap-2.5 text-xs font-semibold text-foreground">
                    <UserCheck className="h-4 w-4 text-primary" />
                    Cadastrar novo membro
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="group h-11 justify-between rounded-xl border-border/70 hover:border-primary/40 hover:bg-primary/5"
                asChild
              >
                <Link href="/groups">
                  <span className="flex items-center gap-2.5 text-xs font-semibold text-foreground">
                    <Layers className="h-4 w-4 text-primary" />
                    Gerenciar células & grupos
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="group h-11 justify-between rounded-xl border-border/70 hover:border-primary/40 hover:bg-primary/5"
                asChild
              >
                <Link href="/events?new=1">
                  <span className="flex items-center gap-2.5 text-xs font-semibold text-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    Planejar culto especial
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {report?.generatedAt && (
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>Kairos Community Platform · Edição Viva</span>
          <span>Atualizado em {new Intl.DateTimeFormat("pt-BR", { timeStyle: "medium" }).format(new Date(report.generatedAt))}</span>
        </div>
      )}
    </motion.div>
  );
}
