import { useDeleteGroupsId } from "@/lib/api/generated/groups/groups"
import { getGetGroupsQueryKey } from "@/lib/api/generated/groups/groups"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useDeleteGroup(id: string) {
  const queryClient = useQueryClient()

  const mutation = useDeleteGroupsId({
    mutation: {
      onSuccess: () => {
        toast.success("Grupo excluído com sucesso!")
        queryClient.invalidateQueries({ queryKey: getGetGroupsQueryKey() })
      },
      onError: () => {
        toast.error("Erro ao excluir grupo")
      },
    },
  })

  return {
    ...mutation,
    mutate: () => mutation.mutate({ id }),
  }
}
