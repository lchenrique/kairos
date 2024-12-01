import { useGetGroups } from '@/lib/api/generated/groups'

interface UseGroupsOptions {
  page?: number
  perPage?: number
  search?: string
}

export function useGroups({ page = 1, perPage = 10, search }: UseGroupsOptions = {}) {
  const { data, isLoading } = useGetGroups({
    query: {
      page,
      perPage,
      search,
    },
  })

  return {
    groups: data?.groups ?? [],
    pagination: data?.pagination,
    isLoading,
  }
}
