import { useDeleteGroupsId } from "@/lib/api/generated/groups/groups"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useDeleteGroup(id: string) {
  const router = useRouter()

  return useDeleteGroupsId(id, {
    mutation: {
      onSuccess: () => {
        toast.success("Grupo excluído com sucesso!")
        router.refresh()
      },
      onError: () => {
        toast.error("Erro ao excluir grupo")
      },
    },
  })
}
