import { usePostGroups } from "@/lib/api/generated/groups/groups"
import { getGetGroupsQueryKey } from "@/lib/api/generated/groups/groups"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateGroup() {
  const queryClient = useQueryClient()

  return usePostGroups({
    mutation: {
      onSuccess: () => {
        toast.success("Grupo criado com sucesso!")
        queryClient.invalidateQueries({ queryKey: getGetGroupsQueryKey() })
      },
      onError: () => {
        toast.error("Erro ao criar grupo")
      },
    },
  })
}
