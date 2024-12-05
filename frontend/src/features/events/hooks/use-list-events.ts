import { useGetEvents } from "@/lib/api/generated/events/events"
import type { GetEventsParams } from "@/lib/api/generated/model"

export function useListEvents(params?: GetEventsParams) {
  return useGetEvents(params, {
    query: {
      refetchOnWindowFocus: false,
    },
  })
}
