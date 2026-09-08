"use client"

import { Button } from "@/components/ui/button"
import { Plus, UsersRound } from "lucide-react"

interface GroupListHeaderProps {
  total: number
  onCreate?: () => void
}

export function GroupListHeader({ total, onCreate }: GroupListHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <UsersRound className="h-3.5 w-3.5" aria-hidden="true" />
          Organização e cuidado
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Grupos</h1>
        <p className="mt-1 text-muted-foreground">Acompanhe células, ministérios e departamentos em um só lugar.</p>
        <p className="mt-2 text-sm text-muted-foreground"><span className="font-semibold text-foreground">{total}</span> grupos cadastrados</p>
      </div>

      {onCreate && (
        <Button onClick={onCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Novo grupo
        </Button>
      )}
    </div>
  )
}
