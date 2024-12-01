import { useGetGroupsId } from '@/lib/api/generated/groups'

export function useGroup(id: string) {
  const { data: group, isLoading } = useGetGroupsId({
    path: { id },
    query: {
      enabled: !!id,
    },
  })

  return {
    group,
    isLoading,
  }
}
