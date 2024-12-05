"use client"

import { ColumnDef } from "@tanstack/react-table"
import { GetMembers200DataItem } from "@/lib/api/generated/model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontalIcon, 
  PencilIcon, 
  Trash2Icon, 
  EyeIcon,
  UserIcon,
  CheckIcon,
  XIcon,
  UsersIcon,
  UserPlusIcon,
  UserMinusIcon
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useDrawerStore } from "@/store/use-drawer-store"
import { MemberForm } from "../../components/member-form/form"
import { MemberView } from "../../components/member-view/view"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatPhone, formatDate } from "@/lib/utils"

export const columns: ColumnDef<GetMembers200DataItem>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      const member = row.original

      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage 
              src={member.image || undefined} 
              alt={member.name} 
              className="object-cover"
            />
            <AvatarFallback>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{member.name}</span>
            <span className="text-xs text-muted-foreground">{member.email}</span>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ row }) => formatPhone(row.original.phone)
  },
  {
    accessorKey: "birthDate",
    header: "Data de Nascimento",
    cell: ({ row }) => formatDate(row.original.birthDate)
  },
  {
    accessorKey: "baptismDate",
    header: "Data de Batismo",
    cell: ({ row }) => {
      const baptismDate = row.original.baptismDate
      if (!baptismDate) return "Não informada"
      return formatDate(baptismDate)
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status

      return (
        <Badge variant={status === 'ACTIVE' ? 'success' : 'destructive'}>
          {status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const member = row.original
      const open = useDrawerStore((state) => state.open)

      const handleEdit = () => {
        open({
          title: "Editar Membro",
          subtitle: "Edite os dados do membro",
          content: <MemberForm initialData={member} />
        })
      }

      const handleView = () => {
        open({
          title: "Detalhes do Membro",
          subtitle: "Visualize os dados do membro",
          content: <MemberView member={member} />
        })
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleView}>
              <EyeIcon className="mr-2 h-4 w-4" />
              <span>Visualizar</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              <PencilIcon className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2Icon className="mr-2 h-4 w-4" />
              <span>Excluir</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
