import { useDeleteGroupsId } from '@/lib/api/generated/groups'
import { queryClient } from '@/lib/query-client'
import { toast } from 'sonner'

export function useRemoveGroup() {
  const { mutateAsync: removeGroup, isPending } = useDeleteGroupsId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['groups'] })
        toast.success('Grupo removido com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao remover grupo')
      },
    },
  })

  const handleRemove = async (id: string) => {
    try {
      await removeGroup({
        path: { id },
      })
    } catch (error) {
      throw error
    }
  }

  return {
    remove: handleRemove,
    isRemoving: isPending,
  }
}
