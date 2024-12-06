"use client"

import { Button } from "@/components/ui/button"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import { UserPlus } from "lucide-react"
import { MemberForm } from "../member-form/form"

export function MemberListHeader() {
  const openDrawer = useDrawerStore((state) => state.open)

  const handleNewMember = () => {
    openDrawer({
      title: "Novo membro",
      content: <MemberForm />
    })
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Membros</h1>
        <p className="text-muted-foreground">
          Gerencie os membros da sua igreja
        </p>
      </div>

      <Button onClick={handleNewMember}>
        <UserPlus className="w-4 h-4 mr-2" />
        Novo membro
      </Button>
    </div>
  )
}
