import { usePostGroups } from "@/lib/api/generated/groups/groups"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useCreateGroup() {
  const router = useRouter()

  return usePostGroups({
    mutation: {
      onSuccess: () => {
        toast.success("Grupo criado com sucesso!")
        router.refresh()
      },
      onError: () => {
        toast.error("Erro ao criar grupo")
      },
    },
  })
}
