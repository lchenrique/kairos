import { usePostMembers } from '@/lib/api/generated/members/members'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function useCreateMember() {
  const router = useRouter()

  return usePostMembers({
    mutation: {
      onSuccess: () => {
        toast.success('Membro criado com sucesso')
        router.refresh()
      },
      onError: () => {
        toast.error('Erro ao criar membro')
      }
    }
  })
}
