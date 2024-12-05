import { useGetGroupsId } from "@/lib/api/generated/groups/groups"

export function useGetGroup(id: string) {
  return useGetGroupsId(id, {
    query: {
      refetchOnWindowFocus: false,
    },
  })
}
