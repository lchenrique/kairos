import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePutMembersId, deleteMembers } from '@/lib/api/generated/members/members'
import { toast } from 'sonner'
import { getGetMembersQueryKey } from '@/lib/api/generated/members/members'

export function useBulkMemberActions() {
  const queryClient = useQueryClient()
  const putMemberMutation = usePutMembersId()

  const bulkUpdateStatus = useMutation({
    mutationFn: async (params: { 
      memberIds: string[], 
      status: 'ACTIVE' | 'INACTIVE' 
    }) => {
      const updatePromises = params.memberIds.map(id => 
        putMemberMutation.mutateAsync({ 
          id, 
          data: { status: params.status } 
        })
      )
      
      return Promise.all(updatePromises)
    },
    onSuccess: (_, params) => {
      toast.success(`${params.memberIds.length} membros ${params.status === 'ACTIVE' ? 'ativados' : 'desativados'} com sucesso`)
      queryClient.invalidateQueries({ 
        queryKey: getGetMembersQueryKey() 
      })
    },
    onError: (error) => {
      toast.error('Erro ao atualizar membros', { description: error.message })
    }
  })

  const bulkDeleteMembers = useMutation({
    mutationFn: async (memberIds: string[]) => {
      const deletePromises = memberIds.map(id => 
        deleteMembers(id)
      )
      
      return Promise.all(deletePromises)
    },
    onSuccess: (_, memberIds) => {
      toast.success(`${memberIds.length} membros excluídos com sucesso`)
      queryClient.invalidateQueries({ 
        queryKey: getGetMembersQueryKey() 
      })
    },
    onError: (error) => {
      toast.error('Erro ao excluir membros', { description: error.message })
    }
  })

  return {
    bulkUpdateStatus,
    bulkDeleteMembers
  }
}
