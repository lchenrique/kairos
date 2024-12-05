import { useGetMembers } from '@/lib/api/generated/members/members'
import { useSearchParams } from 'next/navigation'
import type { GetMembersParams } from '@/lib/api/generated/model'

export function useListMembers() {
  const searchParams = useSearchParams()
  
  const filters: GetMembersParams = {
    page: Number(searchParams.get('page') ?? '1'),
    status: searchParams.get('status') as GetMembersParams['status'] ?? undefined,
    search: searchParams.get('search') ?? undefined,
    order: searchParams.get('order') as GetMembersParams['order'] ?? undefined,
    sortBy: searchParams.get('sortBy') as GetMembersParams['sortBy'] ?? undefined,
  }
  
  return useGetMembers(filters)
}
