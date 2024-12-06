import { useToast } from "@/components/ui/use-toast"
import { useModalStore } from "@/lib/stores/modal-store"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import { useQueryClient } from "@tanstack/react-query"
import { useDeleteMembersId, getGetMembersQueryKey } from "@/lib/api/generated/members/members"
import { MemberForm } from "../components/member-form/form"
import { MemberView } from "../components/member-view/view"
import type { GetMembers200DataItem as Member } from "@/lib/api/generated/model/getMembers200DataItem"

export function useMemberActions(member: Member) {
  const { toast } = useToast()
  const modalStore = useModalStore()
  const queryClient = useQueryClient()
  const { open: openDrawer } = useDrawerStore()

  const { mutate: deleteMember } = useDeleteMembersId({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Membro excluído com sucesso",
          description: `O membro ${member.name} foi excluído com sucesso.`,
        })
        queryClient.invalidateQueries({ queryKey: getGetMembersQueryKey() })
        modalStore.close()
      },
      onError: () => {
        toast({
          title: "Erro ao excluir membro",
          description: `Não foi possível excluir o membro ${member.name}.`,
          variant: "destructive",
        })
        modalStore.close()
      },
    },
  })

  const handleDelete = () => {
    modalStore.confirm({
      title: "Excluir membro",
      subtitle: `Tem certeza que deseja excluir o membro ${member.name}?`,
      confirmText: "Excluir",
      variant: "destructive",
      onConfirm: () => {
        deleteMember({ id: member.id })
      }
    })
  }

  const handleEdit = () => {
    openDrawer({
      title: "Editar Membro",
      subtitle: "Edite os dados do membro",
      content: <MemberForm initialData={member} />
    })
  }

  const handleView = () => {
      openDrawer({
        title: "Detalhes do Membro",
        subtitle: "Visualize os dados do membro",
        content: <MemberView member={member} />
    })
  }

  return {
    handleDelete,
    handleEdit,
    handleView
  }
}
