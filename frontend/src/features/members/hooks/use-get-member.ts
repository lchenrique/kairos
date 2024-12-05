import { useGetMembersId } from '@/lib/api/generated/members/members'

export function useGetMember(id: string) {
  return useGetMembersId(id, {
    query: {
      enabled: !!id
    }
  })
}
