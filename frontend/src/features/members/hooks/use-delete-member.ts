import { useDeleteMembersId } from '@/lib/api/generated/members/members'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function useDeleteMember() {
  const router = useRouter()

  return useDeleteMembersId({
    mutation: {
      onSuccess: () => {
        toast.success('Membro removido com sucesso')
        router.refresh()
      },
      onError: () => {
        toast.error('Erro ao remover membro')
      }
    }
  })
}
