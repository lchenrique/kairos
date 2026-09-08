'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Building2 } from 'lucide-react'
import { useChurchContext, tenantContextQueryKey } from '@/hooks/use-church-context'
import { useChurchStore } from '@/lib/stores/church-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function ChurchSwitcher({ isCollapsed }: { isCollapsed: boolean }) {
  const queryClient = useQueryClient()
  const { data, isLoading } = useChurchContext()
  const activeChurchId = useChurchStore((state) => state.activeChurchId)
  const setActiveChurchId = useChurchStore((state) => state.setActiveChurchId)

  useEffect(() => {
    if (!data) return
    const validValues = new Set(['all', ...data.churches.map((church) => church.id)])
    if (!activeChurchId || !validValues.has(activeChurchId)) {
      setActiveChurchId(data.selectedChurchId || data.churches[0]?.id || 'all')
    }
  }, [activeChurchId, data, setActiveChurchId])

  if (isLoading || !data) {
    return <Skeleton className={cn('h-10 bg-sidebar-border/60', isCollapsed ? 'w-10' : 'w-full')} />
  }

  const value = activeChurchId || data.selectedChurchId || data.churches[0]?.id || 'all'
  const selectedChurch = data.churches.find((church) => church.id === value)

  const handleChange = async (churchId: string) => {
    setActiveChurchId(churchId)
    await queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] !== tenantContextQueryKey[0],
    })
  }

  return (
    <div className={cn('px-3', isCollapsed && 'px-0')}>
      {!isCollapsed && (
        <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-muted">
          {data.organization.name}
        </p>
      )}
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger
          aria-label="Selecionar igreja ou unidade"
          className={cn(
            'border-sidebar-border bg-sidebar-accent/40 text-sidebar-foreground hover:bg-sidebar-accent/70 focus:border-sidebar-ring',
            isCollapsed ? 'mx-auto h-10 w-10 justify-center p-0 [&>svg]:hidden' : 'h-10 w-full',
          )}
          title={isCollapsed ? selectedChurch?.name || 'Todas as unidades' : undefined}
        >
          {isCollapsed ? (
            <Building2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            <SelectValue placeholder="Selecione uma unidade" />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as unidades</SelectItem>
          {data.churches.map((church) => (
            <SelectItem key={church.id} value={church.id}>
              {church.name}{church.isHeadquarters ? ' (sede)' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
