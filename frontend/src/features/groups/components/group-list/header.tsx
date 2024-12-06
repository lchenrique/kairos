"use client"

import { Button } from "@/components/ui/button"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import { Users } from "lucide-react"

export function GroupListHeader() {
  const openDrawer = useDrawerStore((state) => state.open)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Grupos</h1>
        <p className="text-muted-foreground">
          Gerencie os grupos da sua igreja
        </p>
      </div>

      <Button onClick={openDrawer}>
        <Users className="w-4 h-4 mr-2" />
        Novo grupo
      </Button>
    </div>
  )
}
