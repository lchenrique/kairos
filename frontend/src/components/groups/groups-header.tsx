"use client"

import { Button } from "@/components/ui/button"
import { useDrawerStore } from "@/store/use-drawer-store"
import { GroupForm } from "./group-form"
import { StatsCards } from "@/components/shared/stats-cards"
import { Icon } from "@/components/ui/icon"

export function GroupsHeader() {
  const open = useDrawerStore((state) => state.open)

  const handleNewGroup = () => {
    open({
      title: "Novo Grupo",
      content: (
        <GroupForm 
          mode="create"
          onSubmit={async (data) => {
            try {
              // TODO: Implement API integration
              console.log(data)
            } catch (error) {
              console.error(error)
            }
          }}
        />
      ),
    })
  }

  const stats = [
    {
      title: "Total de Grupos",
      value: 32,
      icon: <Icon name="Users" className="h-full w-full" />,
      description: "Grupos ativos e inativos",
      color: "primary"
    },
    {
      title: "Membros por Grupo",
      value: 25,
      icon: <Icon name="UserPlus" className="h-full w-full" />,
      description: "Média de membros",
      color: "green"
    },
    {
      title: "Taxa de Crescimento",
      value: 12,
      icon: <Icon name="TrendingUp" className="h-full w-full" />,
      suffix: "%",
      description: "Nos últimos 3 meses",
      color: "orange"
    },
    {
      title: "Encontros Mensais",
      value: 128,
      icon: <Icon name="CalendarCheck" className="h-full w-full" />,
      description: "Média mensal",
      color: "purple"
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Grupos</h2>
          <p className="text-muted-foreground">
            Gerencie os grupos da sua igreja
          </p>
        </div>

        <Button onClick={handleNewGroup}>
          <Icon name="plus" className="mr-2 h-4 w-4" />
          Novo Grupo
        </Button>
      </div>

      <StatsCards data={stats} />
    </div>
  )
}