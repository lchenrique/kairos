'use client'

import { StatsCard } from "@/components/ui/stats-card"
import { CalendarIcon, HeartHandshakeIcon, HomeIcon, UsersIcon } from "lucide-react"

export function DashboardStats() {
  const stats = [
    {
      title: "Total de Membros",
      value: "2,345",
      description: "+180 nos últimos 30 dias",
      icon: UsersIcon,
      trend: "up" as const,
    },
    {
      title: "Células Ativas",
      value: "45",
      description: "+3 neste mês",
      icon: HomeIcon,
      trend: "up" as const,
    },
    {
      title: "Eventos Planejados",
      value: "12",
      description: "Próximos 30 dias",
      icon: CalendarIcon,
      trend: "neutral" as const,
    },
    {
      title: "Projetos Sociais",
      value: "8",
      description: "Em andamento",
      icon: HeartHandshakeIcon,
      trend: "up" as const,
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
