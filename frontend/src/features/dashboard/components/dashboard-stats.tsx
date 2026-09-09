"use client";

import {
  CalendarDays,
  CheckCircle2,
  Users2,
  Layers,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/ui/stats-card";
import { useDashboardOverview } from "@/hooks/use-dashboard-overview";

export function DashboardStats() {
  const {
    data: report,
    isLoading,
    isError,
  } = useDashboardOverview();

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-destructive/20 bg-destructive/10 px-5 py-4 text-sm text-destructive"
      >
        Não foi possível carregar os indicadores do painel.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  const activePercent =
    report?.membersTotal && report.membersTotal > 0
      ? Math.round(((report?.activeMembers ?? 0) / report.membersTotal) * 100)
      : 100;

  const stats = [
    {
      title: "Membros Ativos",
      value: report?.activeMembers ?? 0,
      description: `${report?.membersTotal ?? 0} membros cadastrados`,
      icon: Users2,
      trend: "up" as const,
      trendValue: `${activePercent}% ativos`,
      chartType: "none" as const,
    },
    {
      title: "Taxa de Presença",
      value: `${report?.attendance.rate ?? 0}%`,
      description: `${report?.attendance.confirmed ?? 0} presenças confirmadas`,
      icon: CheckCircle2,
      trend: (report?.attendance.rate ?? 0) >= 70 ? ("up" as const) : ("neutral" as const),
      trendValue: "+4.8%",
      chartType: "bars" as const,
    },
    {
      title: "Próximos Encontros",
      value: report?.upcomingEvents ?? 0,
      description: `${report?.eventsTotal ?? 0} eventos no calendário`,
      icon: CalendarDays,
      trend: "up" as const,
      trendValue: "Agenda ativa",
      chartType: "sparkline" as const,
    },
    {
      title: "Grupos e Células",
      value: report?.groupsTotal ?? 0,
      description: "Células, ministérios e equipes",
      icon: Layers,
      trend: "neutral" as const,
      trendValue: "Em ritmo",
      chartType: "none" as const,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
