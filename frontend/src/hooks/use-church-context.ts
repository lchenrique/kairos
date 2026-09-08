'use client'

import { useQuery } from '@tanstack/react-query'
import { customInstance } from '@/lib/api/axios-instance'

export interface ChurchSummary {
  id: string
  name: string
  slug: string
  isHeadquarters: boolean
  status: 'ACTIVE' | 'INACTIVE'
  address: string | null
  timezone: string | null
}

export interface TenantContext {
  organization: { id: string; name: string }
  churches: ChurchSummary[]
  selectedChurchId: string | null
  allChurches: boolean
}

export const tenantContextQueryKey = ['tenant-context'] as const

export function useChurchContext() {
  return useQuery({
    queryKey: tenantContextQueryKey,
    queryFn: () => customInstance<TenantContext>({ url: '/system/context', method: 'GET' }),
    staleTime: 60_000,
  })
}

