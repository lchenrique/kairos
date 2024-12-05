import { useGetEventsId } from "@/lib/api/generated/events/events"

export function useGetEvent(id: string) {
  return useGetEventsId(id, {
    query: {
      refetchOnWindowFocus: false,
    },
  })
}
