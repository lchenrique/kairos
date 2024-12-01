"use client"

import { Button } from "@/components/ui/button"
import { useDrawerStore } from "@/store/use-drawer-store"
import { MemberForm } from "./member-form"
import { StatsCards } from "@/components/shared/stats-cards"
import { Icon } from "@/components/ui/icon"

export function MembersHeader() {
  const open = useDrawerStore((state) => state.open)

  const handleNewMember = () => {
    open({
      title: "Novo Membro",
      content: (
        <MemberForm
        />
      ),
    })
  }

  const stats = [
    {
      title: "Total de Membros",
      value: 2547,
      icon: <Icon name="Users" className="h-full w-full" />,
      description: "Membros registrados",
      color: "primary" as const
    },
    {
      title: "Membros Ativos",
      value: 2100,
      icon: <Icon name="UserCheck" className="h-full w-full" />,
      description: "+20% desde o último mês",
      color: "green" as const
    },
    {
      title: "Membros Inativos",
      value: 447,
      icon: <Icon name="UserX" className="h-full w-full" />,
      description: "-5% desde o último mês",
      color: "orange" as const
    },
    {
      title: "Frequência Média",
      value: 85,
      icon: <Icon name="BarChart" className="h-full w-full" />,
      suffix: "%",
      description: "Nos últimos 3 meses",
      color: "purple" as const
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Membros</h2>
          <p className="text-muted-foreground">
            Gerencie os membros da sua igreja
          </p>
        </div>

        <Button onClick={handleNewMember}>
          <Icon name="Plus" className="mr-2 h-4 w-4" />
          Novo Membro
        </Button>
      </div>

      <StatsCards data={stats} />
    </div>
  )
}