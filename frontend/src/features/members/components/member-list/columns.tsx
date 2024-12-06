import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { GetMembers200DataItem as Member } from "@/lib/api/generated/model/getMembers200DataItem"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Trash, Eye, Pencil } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getGetMembersQueryKey, useDeleteMembersId } from "@/lib/api/generated/members/members"
import { useToast } from "@/components/ui/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { useModalStore } from "@/lib/stores/modal-store"
import { DialogFooter } from "@/components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { formatPhone, formatDate } from "@/lib/utils"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import { MemberForm } from "../member-form/form"
import { MemberView } from "../member-view/view"
import { useMemberActions } from "@/features/members/hooks/use-member-actions"

export const columns: ColumnDef<Member>[] = [
  {
    id: "select",
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Nome",
    enableSorting: true,
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
              {member.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{member.name}</span>
            <span className="text-xs text-muted-foreground">{member.email}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
    cell: ({ row }) => row.original.email
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    enableSorting: false,
    cell: ({ row }) => formatPhone(row.original.phone)
  },
  {
    accessorKey: "birthDate",
    header: "Data de Nascimento",
    enableSorting: false,
    cell: ({ row }) => formatDate(row.original.birthDate)
  },
  {
    accessorKey: "baptismDate",
    header: "Data de Batismo",
    enableSorting: false,
    cell: ({ row }) => {
      const baptismDate = row.original.baptismDate
      if (!baptismDate) return "Não informada"
      return formatDate(baptismDate)
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
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
    accessorKey: "createdAt",
    header: "Data de Cadastro",
    enableSorting: true,
    cell: ({ row }) => formatDate(row.original.createdAt)
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const member = row.original
      const { handleDelete, handleEdit, handleView } = useMemberActions(member)

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleView}>
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
