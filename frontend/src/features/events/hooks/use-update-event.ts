import { usePutEventsId } from "@/lib/api/generated/events/events"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useUpdateEvent(id: string) {
  const router = useRouter()

  return usePutEventsId(id, {
    mutation: {
      onSuccess: () => {
        toast.success("Evento atualizado com sucesso!")
        router.refresh()
      },
      onError: () => {
        toast.error("Erro ao atualizar evento")
      },
    },
  })
}
