"use client"

import { Button } from "@/components/ui/button"
import { UserPlus, Plus } from "lucide-react"
import { useDrawerStore } from "@/store/use-drawer-store"
import { MemberForm } from "@/components/members/member-form"
import { GroupForm } from "@/components/groups/group-form"

const actions = [
  {
    title: "Novo Membro",
    icon: UserPlus,
    color: "text-blue-500",
    onClick: (open: Function) =>
      open({
        title: "Adicionar Membro",
        subtitle: "Cadastre um novo membro na igreja",
        content: <MemberForm />,
      }),
  },
  {
    title: "Novo Grupo",
    icon: Plus,
    color: "text-purple-500",
    onClick: (open: Function) =>
      open({
        title: "Criar Grupo",
        subtitle: "Crie um novo grupo ou ministério",
        content: <GroupForm />,
      }),
  },
]

export function QuickActions() {
  const open = useDrawerStore((state) => state.open)

  return (
    <div className="flex gap-2">
      {actions.map((action) => (
        <Button
          key={action.title}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => action.onClick(open)}
        >
          <action.icon className={`h-4 w-4 ${action.color}`} />
          {action.title}
        </Button>
      ))}
    </div>
  )
}