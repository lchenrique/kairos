import { usePutMembersId } from '@/lib/api/generated/members/members'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function useUpdateMember() {
  const router = useRouter()

  return usePutMembersId({
    mutation: {
      onSuccess: () => {
        toast.success('Membro atualizado com sucesso')
        router.refresh()
      },
      onError: () => {
        toast.error('Erro ao atualizar membro')
      }
    }
  })
}
