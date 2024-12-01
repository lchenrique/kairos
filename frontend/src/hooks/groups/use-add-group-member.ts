import { usePostGroupsIdMembers } from '@/lib/api/generated/groups'
import { toast } from 'sonner'
import { queryClient } from '@/lib/query-client'

interface AddGroupMemberInput {
  groupId: string
  memberId: string
}

export function useAddGroupMember() {
  const { mutateAsync: addMember, isPending } = usePostGroupsIdMembers({
    mutation: {
      onSuccess: (data, { path }) => {
        // Invalida o cache do grupo para forçar um refetch
        queryClient.invalidateQueries({
          queryKey: ['groups', path.id],
        })
        toast.success('Membro adicionado ao grupo com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao adicionar membro ao grupo')
      },
    },
  })

  const handleAddMember = async ({ groupId, memberId }: AddGroupMemberInput) => {
    try {
      await addMember({
        path: { id: groupId },
        data: { memberId },
      })
    } catch (error) {
      throw error
    }
  }

  return {
    addMember: handleAddMember,
    isAdding: isPending,
  }
}
