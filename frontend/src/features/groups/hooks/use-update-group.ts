import { usePutGroupsId } from "@/lib/api/generated/groups/groups"
import { getGetGroupsQueryKey } from "@/lib/api/generated/groups/groups"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateGroup(id: string) {
  const queryClient = useQueryClient()
  const mutation = usePutGroupsId({
    mutation: {
      onSuccess: () => {
        toast.success("Grupo atualizado com sucesso!")
        queryClient.invalidateQueries({ queryKey: getGetGroupsQueryKey() })
      },
      onError: () => {
        toast.error("Erro ao atualizar grupo")
      },
    },
  })

  return {
    ...mutation,
    mutate: (data: Parameters<typeof mutation.mutate>[0]["data"]) =>
      mutation.mutate({ id, data }),
    mutateAsync: (data: Parameters<typeof mutation.mutateAsync>[0]["data"]) =>
      mutation.mutateAsync({ id, data }),
  }
}
