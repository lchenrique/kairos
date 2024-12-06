"use client"

import { Button } from "@/components/ui/button"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import { CalendarPlus } from "lucide-react"

export function EventListHeader() {
  const openDrawer = useDrawerStore((state) => state.open)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
        <p className="text-muted-foreground">
          Gerencie os eventos da sua igreja
        </p>
      </div>

      <Button onClick={openDrawer}>
        <CalendarPlus className="w-4 h-4 mr-2" />
        Novo evento
      </Button>
    </div>
  )
}
