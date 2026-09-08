"use client";

import {
  CalendarIcon,
  CheckCircle2Icon,
  HomeIcon,
  UsersIcon,
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
        className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        Não foi possível carregar os indicadores do dashboard.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Membros ativos",
      value: report?.activeMembers ?? 0,
      description: `${report?.membersTotal ?? 0} cadastrados no total`,
      icon: UsersIcon,
    },
    {
      title: "Grupos cadastrados",
      value: report?.groupsTotal ?? 0,
      description: "células, ministérios e equipes",
      icon: HomeIcon,
    },
    {
      title: "Próximos eventos",
      value: report?.upcomingEvents ?? 0,
      description: `${report?.eventsTotal ?? 0} eventos registrados`,
      icon: CalendarIcon,
    },
    {
      title: "Taxa de confirmação",
      value: `${report?.attendance.rate ?? 0}%`,
      description: `${report?.attendance.confirmed ?? 0} confirmações registradas`,
      icon: CheckCircle2Icon,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
