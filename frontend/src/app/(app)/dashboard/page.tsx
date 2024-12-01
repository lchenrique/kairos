"use client"

import { StatsCard } from "@/components/dashboard/stats-card"
import { WelcomeMessage } from "@/components/dashboard/welcome-message"
import { BirthdaysCard } from "@/components/dashboard/birthdays-card"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Users, UserCircle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      {/* Cabeçalho e Ações Rápidas */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <WelcomeMessage />
        <QuickActions />
      </div>

      {/* Estatísticas Principais */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard
          title="Total de Membros"
          value="0"
          icon={<Users className="h-4 w-4" />}
          description="Membros cadastrados"
          trend="up"
        />
        <StatsCard
          title="Grupos Ativos"
          value="0"
          icon={<UserCircle className="h-4 w-4" />}
          description="Grupos cadastrados"
          trend="up"
        />
      </div>

      {/* Informações Importantes */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-[400px]">
          <UpcomingEvents />
        </div>
        <div className="h-[400px]">
          <BirthdaysCard />
        </div>
      </div>
    </div>
  )
}