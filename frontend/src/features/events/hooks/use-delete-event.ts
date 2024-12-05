import { useDeleteEventsId } from "@/lib/api/generated/events/events"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useDeleteEvent(id: string) {
  const router = useRouter()

  return useDeleteEventsId(id, {
    mutation: {
      onSuccess: () => {
        toast.success("Evento excluído com sucesso!")
        router.refresh()
      },
      onError: () => {
        toast.error("Erro ao excluir evento")
      },
    },
  })
}
