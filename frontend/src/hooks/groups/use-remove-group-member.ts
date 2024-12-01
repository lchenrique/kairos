import { useDeleteGroupsIdMembersMemberId } from '@/lib/api/generated/groups'
import { toast } from 'sonner'
import { queryClient } from '@/lib/query-client'

interface RemoveGroupMemberInput {
  groupId: string
  memberId: string
}

export function useRemoveGroupMember() {
  const { mutateAsync: removeMember, isPending } = useDeleteGroupsIdMembersMemberId({
    mutation: {
      onSuccess: (data, { path }) => {
        // Invalida o cache do grupo para forçar um refetch
        queryClient.invalidateQueries({
          queryKey: ['groups', path.id],
        })
        toast.success('Membro removido do grupo com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao remover membro do grupo')
      },
    },
  })

  const handleRemoveMember = async ({ groupId, memberId }: RemoveGroupMemberInput) => {
    try {
      await removeMember({
        path: { id: groupId, memberId },
      })
    } catch (error) {
      throw error
    }
  }

  return {
    removeMember: handleRemoveMember,
    isRemoving: isPending,
  }
}
