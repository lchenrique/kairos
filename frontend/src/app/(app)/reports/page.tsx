"use client";

import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Download,
  Users,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/ui/stats-card";
import { useGetReportsOverview } from "@/lib/api/generated/reports/reports";
import { downloadCsv } from "@/lib/utils/csv";

type ReportPeriod = "30d" | "90d" | "year" | "all";

const periodLabels: Record<ReportPeriod, string> = {
  "30d": "Últimos 30 dias",
  "90d": "Últimos 90 dias",
  year: "Este ano",
  all: "Todo o histórico",
};

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("90d");
  const {
    data: report,
    isLoading,
    isError,
  } = useGetReportsOverview(
    { period },
    { query: { refetchOnWindowFocus: false } },
  );

  const attendance = report?.attendance;

  const exportReport = () => {
    if (!report) return;
    downloadCsv(`kairos-relatorio-${period}.csv`, [
      {
        Período: periodLabels[period],
        "Membros cadastrados": report.membersTotal,
        "Membros ativos": report.activeMembers,
        Grupos: report.groupsTotal,
        "Eventos no período": report.eventsTotal,
        "Próximos eventos": report.upcomingEvents,
        "Participantes registrados": attendance?.total ?? 0,
        Confirmados: attendance?.confirmed ?? 0,
        Pendentes: attendance?.pending ?? 0,
        Cancelados: attendance?.cancelled ?? 0,
        "Taxa de confirmação": `${attendance?.rate ?? 0}%`,
        "Gerado em": new Date(report.generatedAt).toLocaleString("pt-BR"),
      },
    ]);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        routeName="Visão geral"
        title="Relatórios"
        subtitle="Indicadores reais da comunidade e da participação nos eventos."
        breadcrumb={[{ label: "Relatórios" }]}
        variant="compact"
      >
        <div className="flex w-full gap-2 sm:w-auto">
          <Select
            value={period}
            onValueChange={(value: ReportPeriod) => setPeriod(value)}
          >
            <SelectTrigger
              className="w-full sm:w-44"
              aria-label="Período do relatório"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(periodLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={exportReport}
            disabled={!report || isLoading}
          >
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Exportar CSV
          </Button>
        </div>
      </PageHeader>

      {isError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          Não foi possível carregar os indicadores. Tente novamente em
          instantes.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-xl" />
          ))
        ) : (
          <>
            <StatsCard
              title="Membros ativos"
              value={report?.activeMembers ?? 0}
              icon={Users}
              description={`${report?.membersTotal ?? 0} cadastrados atualmente`}
            />
            <StatsCard
              title="Grupos"
              value={report?.groupsTotal ?? 0}
              icon={UsersRound}
              description="cadastros atuais da unidade"
            />
            <StatsCard
              title="Eventos no período"
              value={report?.eventsTotal ?? 0}
              icon={CalendarDays}
              description={`${report?.upcomingEvents ?? 0} próximos eventos`}
            />
            <StatsCard
              title="Taxa de confirmação"
              value={`${attendance?.rate ?? 0}%`}
              icon={CheckCircle2}
              description={`${attendance?.confirmed ?? 0} de ${attendance?.total ?? 0} participantes`}
              trend="up"
            />
          </>
        )}
      </div>

      <Card className="border-primary/15 bg-primary/[0.04]">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Origem dos indicadores</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Membros e grupos representam o cadastro atual. Eventos e
              confirmações respeitam o período selecionado.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/members">Ver membros</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/groups">Ver grupos</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/events">Ver eventos</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
            Participação nos eventos
          </CardTitle>
          <CardDescription>
            Distribuição dos participantes em{" "}
            {periodLabels[period].toLowerCase()}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoading ? (
            <Skeleton className="h-36 w-full" />
          ) : attendance?.total ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Confirmados</span>
                  <span className="font-medium">
                    {attendance.confirmed}
                  </span>
                </div>
                <Progress
                  value={
                    ((attendance.confirmed ?? 0) / (attendance.total || 1)) * 100
                  }
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pendentes</span>
                  <span className="font-medium">
                    {attendance.pending}
                  </span>
                </div>
                <Progress
                  value={
                    ((attendance.pending ?? 0) / (attendance.total || 1)) * 100
                  }
                  className="[&>div]:bg-amber-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Cancelados</span>
                  <span className="font-medium">
                    {attendance.cancelled}
                  </span>
                </div>
                <Progress
                  value={
                    ((attendance.cancelled ?? 0) / (attendance.total || 1)) *
                    100
                  }
                  className="[&>div]:bg-destructive"
                />
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Nenhuma participação foi registrada neste período. Abra Eventos
              para adicionar participantes e atualizar presenças.
            </div>
          )}
        </CardContent>
      </Card>

      {report?.generatedAt && (
        <p className="text-xs text-muted-foreground">
          Atualizado em {new Date(report.generatedAt).toLocaleString("pt-BR")}
        </p>
      )}
    </div>
  );
}
