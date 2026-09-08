"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Home,
  Plus,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
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
import { PageHeader } from "@/components/shared/page-header";

const itemMotion = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.name?.split(" ")[0] || "Administrador";
  const today = useMemo(() => new Date().toISOString(), []);
  const {
    data: events,
    isLoading: eventsLoading,
    isError: eventsError,
  } = useGetEvents(
    {
      page: 1,
      limit: 3,
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
  const upcomingEvents = useMemo(
    () =>
      events?.data.map((event: GetEvents200DataItem) => ({
        id: event.id,
        title: event.title,
        date: new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date(event.startDate)),
        place: event.location || "Local a definir",
        tag:
          event.type === "SERVICE"
            ? "Culto"
            : event.type === "CELL"
              ? "Célula"
              : event.type === "MINISTRY"
                ? "Ministério"
                : "Outro",
      })) ?? [],
    [events],
  );
  const inactiveMembers = Math.max(
    0,
    (report?.membersTotal ?? 0) - (report?.activeMembers ?? 0),
  );

  return (
    <motion.div
      className="space-y-5"
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.div variants={itemMotion}>
        <PageHeader
          routeName="Visão geral"
          title={`Olá, ${firstName}`}
          subtitle="Uma visão clara para cuidar melhor da sua comunidade."
          breadcrumb={[{ label: "Dashboard" }]}
          variant="compact"
        >
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/members">
              <UsersRound className="mr-2 h-4 w-4" aria-hidden="true" />
              Ver membros
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/groups">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Novo grupo
            </Link>
          </Button>
        </PageHeader>
      </motion.div>

      <motion.div
        variants={itemMotion}
        className="relative overflow-hidden rounded-2xl bg-foreground p-5 text-background shadow-xl shadow-foreground/10 sm:p-6"
      >
        <div
          className="absolute -right-16 -top-20 h-56 w-56 rounded-full border-[28px] border-accent/25"
          aria-hidden="true"
        />
        <Sparkles
          className="absolute right-7 top-7 h-16 w-16 text-background/10"
          aria-hidden="true"
        />
        <div className="relative grid items-center gap-5 lg:grid-cols-[1fr,220px]">
          <div className="max-w-2xl space-y-3">
            <Badge className="border-background/20 bg-background/10 text-background hover:bg-background/15">
              Painel de cuidado
            </Badge>
            <h2 className="max-w-2xl font-display text-2xl font-medium leading-[1.08] tracking-tight sm:text-4xl">
              Cuidar de pessoas começa com boas informações.
            </h2>
            <p className="max-w-xl text-sm leading-5 text-background/70">
              Os indicadores abaixo são calculados a partir dos cadastros e das
              presenças da unidade selecionada.
            </p>
          </div>
          <div className="relative rounded-xl border border-background/15 bg-background/10 p-3.5 backdrop-blur-sm">
            <p className="text-xs text-background/65">Próximos eventos</p>
            {reportLoading ? (
              <Skeleton className="mt-3 h-10 w-20 bg-background/20" />
            ) : reportError ? (
              <p className="mt-3 text-sm text-background/70">
                Indicador indisponível
              </p>
            ) : (
              <p className="mt-2 font-display text-4xl font-semibold">
                {report?.upcomingEvents ?? 0}
              </p>
            )}
            <p className="mt-1 text-xs text-background/75">
              eventos futuros na agenda
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemMotion}>
        <DashboardStats />
      </motion.div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr,1fr]">
        <motion.div variants={itemMotion}>
          <Card className="h-full">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-xl">
                Participação nos eventos
              </CardTitle>
              <CardDescription>
                Situação real das confirmações registradas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-5 pb-5">
              {reportError ? (
                <p
                  role="alert"
                  className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                >
                  Não foi possível carregar os dados de participação.
                </p>
              ) : reportLoading ? (
                <Skeleton className="h-36 w-full" />
              ) : report?.attendance.total ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confirmados</span>
                      <span className="font-medium">
                        {report.attendance.confirmed}
                      </span>
                    </div>
                    <Progress
                      value={
                        (report.attendance.confirmed /
                          report.attendance.total) *
                        100
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pendentes</span>
                      <span className="font-medium">
                        {report.attendance.pending}
                      </span>
                    </div>
                    <Progress
                      value={
                        (report.attendance.pending / report.attendance.total) *
                        100
                      }
                      className="[&>div]:bg-amber-500"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {report.attendance.total} participações registradas no total
                  </p>
                </>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  As confirmações aparecerão aqui depois que participantes forem
                  adicionados aos eventos.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemMotion}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5 pb-3">
              <div>
                <CardTitle className="text-xl">Próximos eventos</CardTitle>
                <CardDescription>O que acontece a seguir</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/calendar">
                  Ver agenda
                  <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-1 px-5 pb-5">
              {eventsError ? (
                <p
                  role="alert"
                  className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                >
                  Não foi possível carregar a agenda.
                </p>
              ) : eventsLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-14 w-full" />
                ))
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {event.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {event.date} · {event.place}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="hidden shrink-0 text-[11px] sm:inline-flex"
                    >
                      {event.tag}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
                  Nenhum evento futuro agendado.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div variants={itemMotion}>
          <Card className="h-full">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-xl">Atalhos de gestão</CardTitle>
              <CardDescription>
                Ações frequentes para ganhar tempo
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 px-5 pb-5 sm:grid-cols-3">
              <Button variant="outline" className="group justify-start" asChild>
                <Link href="/members">
                  <UsersRound
                    className="mr-3 h-4 w-4 text-primary transition-colors group-hover:text-accent-hover-foreground"
                    aria-hidden="true"
                  />
                  Cadastrar membro
                  <ArrowUpRight
                    className="ml-auto h-4 w-4"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button variant="outline" className="group justify-start" asChild>
                <Link href="/groups">
                  <Home
                    className="mr-3 h-4 w-4 text-primary transition-colors group-hover:text-accent-hover-foreground"
                    aria-hidden="true"
                  />
                  Organizar grupo
                  <ArrowUpRight
                    className="ml-auto h-4 w-4"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button variant="outline" className="group justify-start" asChild>
                <Link href="/events?new=1">
                  <CalendarDays
                    className="mr-3 h-4 w-4 text-primary transition-colors group-hover:text-accent-hover-foreground"
                    aria-hidden="true"
                  />
                  Planejar evento
                  <ArrowUpRight
                    className="ml-auto h-4 w-4"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemMotion}>
          <Card className="h-full">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-xl">Pontos de atenção</CardTitle>
              <CardDescription>
                Calculados a partir dos dados atuais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-5 pb-5">
              {reportError ? (
                <p
                  role="alert"
                  className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                >
                  Não foi possível calcular os pontos de atenção.
                </p>
              ) : reportLoading ? (
                <Skeleton className="h-24 w-full" />
              ) : inactiveMembers === 0 &&
                (report?.attendance.pending ?? 0) === 0 ? (
                <div className="flex items-start gap-3 rounded-lg bg-emerald-500/10 p-3">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <p className="text-sm">
                    Nenhuma pendência identificada nos indicadores disponíveis.
                  </p>
                </div>
              ) : (
                <>
                  {inactiveMembers > 0 && (
                    <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 p-3">
                      <CircleAlert
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                        aria-hidden="true"
                      />
                      <p className="text-sm">
                        {inactiveMembers}{" "}
                        {inactiveMembers === 1
                          ? "membro está inativo"
                          : "membros estão inativos"}
                        .
                      </p>
                    </div>
                  )}
                  {(report?.attendance.pending ?? 0) > 0 && (
                    <div className="flex items-start gap-3 rounded-lg bg-primary/10 p-3">
                      <CalendarDays
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <p className="text-sm">
                        {report?.attendance.pending} confirmações de evento
                        aguardam resposta.
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {report?.generatedAt && (
        <p className="text-xs text-muted-foreground">
          Indicadores atualizados em{" "}
          {new Date(report.generatedAt).toLocaleString("pt-BR")}
        </p>
      )}
    </motion.div>
  );
}
