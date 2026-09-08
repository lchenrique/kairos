import { usePostEvents } from "@/lib/api/generated/events/events"
import { getGetEventsQueryKey } from "@/lib/api/generated/events/events"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return usePostEvents({
    mutation: {
      onSuccess: () => {
        toast.success("Evento criado com sucesso!")
        queryClient.invalidateQueries({ queryKey: getGetEventsQueryKey() })
      },
      onError: () => {
        toast.error("Erro ao criar evento")
      },
    },
  })
}
