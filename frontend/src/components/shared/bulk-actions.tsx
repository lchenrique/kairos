"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Trash, UserMinus, UserPlus } from "lucide-react"

interface BulkActionsProps {
  selectedCount: number
  onAction: (action: string) => void
  type: "members" | "groups"
}

export function BulkActions({ selectedCount, onAction, type }: BulkActionsProps) {
  if (selectedCount === 0) return null

  const actions = {
    members: [
      { id: "activate", label: "Ativar Selecionados", icon: UserPlus },
      { id: "deactivate", label: "Desativar Selecionados", icon: UserMinus },
      { id: "delete", label: "Excluir Selecionados", icon: Trash },
    ],
    groups: [
      { id: "activate", label: "Ativar Grupos", icon: UserPlus },
      { id: "deactivate", label: "Desativar Grupos", icon: UserMinus },
      { id: "delete", label: "Excluir Grupos", icon: Trash },
    ],
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
      <span className="text-sm text-muted-foreground px-2">
        {selectedCount} {type === "members" ? "membros" : "grupos"} selecionados
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Ações
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {actions[type].map((action) => (
            <DropdownMenuItem
              key={action.id}
              onClick={() => onAction(action.id)}
              className="cursor-pointer"
            >
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
