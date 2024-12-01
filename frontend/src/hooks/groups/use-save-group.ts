import { usePostGroups, usePutGroupsId } from '@/lib/api/generated/groups'
import { CreateGroupInput, UpdateGroupInput } from '@/lib/api/generated/model'
import { queryClient } from '@/lib/query-client'
import { toast } from 'sonner'

interface UseSaveGroupInput {
  id?: string
}

export function useSaveGroup({ id }: UseSaveGroupInput = {}) {
  const isEditing = !!id

  const { mutateAsync: createGroup, isPending: isCreating } = usePostGroups({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['groups'] })
        toast.success('Grupo criado com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao criar grupo')
      },
    },
  })

  const { mutateAsync: updateGroup, isPending: isUpdating } = usePutGroupsId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['groups'] })
        toast.success('Grupo atualizado com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao atualizar grupo')
      },
    },
  })

  const handleSave = async (data: CreateGroupInput | UpdateGroupInput) => {
    try {
      if (isEditing) {
        await updateGroup({
          path: { id: id! },
          data,
        })
      } else {
        await createGroup({ data })
      }
    } catch (error) {
      throw error
    }
  }

  return {
    save: handleSave,
    isSaving: isCreating || isUpdating,
    isEditing,
  }
}
