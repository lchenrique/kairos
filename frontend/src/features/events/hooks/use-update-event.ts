import { usePutEventsId } from "@/lib/api/generated/events/events"
import { getGetEventsQueryKey } from "@/lib/api/generated/events/events"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient()

  const mutation = usePutEventsId({
    mutation: {
      onSuccess: () => {
        toast.success("Evento atualizado com sucesso!")
        queryClient.invalidateQueries({ queryKey: getGetEventsQueryKey() })
      },
      onError: () => {
        toast.error("Erro ao atualizar evento")
      },
    },
  })

  return { ...mutation, mutate: (data: Parameters<typeof mutation.mutate>[0]["data"]) => mutation.mutate({ id, data }) }
}
