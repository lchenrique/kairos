import { usePutGroupsId } from "@/lib/api/generated/groups/groups"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useUpdateGroup(id: string) {
  const router = useRouter()

  return usePutGroupsId(id, {
    mutation: {
      onSuccess: () => {
        toast.success("Grupo atualizado com sucesso!")
        router.refresh()
      },
      onError: () => {
        toast.error("Erro ao atualizar grupo")
      },
    },
  })
}
