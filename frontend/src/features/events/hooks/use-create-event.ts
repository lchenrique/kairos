import { usePostEvents } from "@/lib/api/generated/events/events"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useCreateEvent() {
  const router = useRouter()

  return usePostEvents({
    mutation: {
      onSuccess: () => {
        toast.success("Evento criado com sucesso!")
        router.refresh()
      },
      onError: () => {
        toast.error("Erro ao criar evento")
      },
    },
  })
}
