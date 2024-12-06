import { getGetMembersQueryKey, usePostMembers } from '@/lib/api/generated/members/members'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

export function useCreateMember() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return usePostMembers({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMembersQueryKey() })
        router.refresh()
      },
      onError: () => {
        toast.error('Erro ao criar membro')
      }
    }
  })
}
