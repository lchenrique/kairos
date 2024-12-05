import { useGetGroups } from "@/lib/api/generated/groups/groups"
import type { GetGroupsParams } from "@/lib/api/generated/model"

export function useListGroups(params?: GetGroupsParams) {
  return useGetGroups(params, {
    query: {
      refetchOnWindowFocus: false,
    },
  })
}
