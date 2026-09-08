import { useDeleteEventsId } from "@/lib/api/generated/events/events"
import { getGetEventsQueryKey } from "@/lib/api/generated/events/events"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useDeleteEvent(id: string) {
  const queryClient = useQueryClient()

  const mutation = useDeleteEventsId({
    mutation: {
      onSuccess: () => {
        toast.success("Evento excluído com sucesso!")
        queryClient.invalidateQueries({ queryKey: getGetEventsQueryKey() })
      },
      onError: () => {
        toast.error("Erro ao excluir evento")
      },
    },
  })

  return { ...mutation, mutate: () => mutation.mutate({ id }) }
}
