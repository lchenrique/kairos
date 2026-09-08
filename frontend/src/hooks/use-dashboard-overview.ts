'use client'

import { useQuery } from '@tanstack/react-query'
import type { GetReportsOverview200 } from '@/lib/api/generated/model'
import { customInstance } from '@/lib/api/axios-instance'
import { useChurchStore } from '@/lib/stores/church-store'

export function useDashboardOverview() {
  const activeChurchId = useChurchStore((state) => state.activeChurchId)

  return useQuery({
    queryKey: ['dashboard-overview', activeChurchId],
    queryFn: () =>
      customInstance<GetReportsOverview200>({ url: '/dashboard/overview', method: 'GET' }),
    refetchOnWindowFocus: false,
  })
}
