"use client"

import { Icon } from "@/components/ui/icon"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/shared/stats-cards"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

export function SettingsHeader() {
  const form = useFormContext()

  const handleSave = () => {
    form.handleSubmit((data) => {
      toast.success("Configurações salvas com sucesso!")
      console.log(data)
    })()
  }

  const stats = [
    {
      title: "Total de Configurações",
      value: 7,
      icon: <Icon name="Settings" className="h-full w-full" />,
      description: "Configurações disponíveis",
      color: "primary"
    },
    {
      title: "Notificações",
      value: 2,
      icon: <Icon name="Bell" className="h-full w-full" />,
      description: "Tipos de notificação",
      color: "green"
    },
    {
      title: "Última Atualização",
      value: 5,
      icon: <Icon name="Clock" className="h-full w-full" />,
      suffix: "dias",
      description: "Desde a última modificação",
      color: "orange"
    },
    {
      title: "Integrações",
      value: 3,
      icon: <Icon name="Link" className="h-full w-full" />,
      description: "Serviços conectados",
      color: "purple"
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua igreja
          </p>
        </div>

        <Button onClick={handleSave}>
          <Icon name="Save" className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <StatsCards data={stats} />
    </div>
  )
}
