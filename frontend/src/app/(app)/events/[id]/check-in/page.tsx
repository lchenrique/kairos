"use client"

import { useParams } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { EventAttendanceManager } from "@/features/events/components/event-attendance-manager"
import { useGetEventsId } from "@/lib/api/generated/events/events"
import type { GetEvents200DataItem } from "@/lib/api/generated/model"

export default function EventCheckInPage() {
  const params = useParams<{ id: string }>()
  const { data, isLoading, isError } = useGetEventsId(params.id)

  if (isLoading) return <div className="space-y-5"><Skeleton className="h-12 w-2/3" /><Skeleton className="h-[520px] w-full" /></div>
  if (isError || !data) return <div role="alert" className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"><AlertCircle className="h-4 w-4" aria-hidden="true" />Não foi possível carregar este evento.</div>

  return <div className="mx-auto w-full max-w-3xl space-y-5"><PageHeader routeName="Eventos" title={`Check-in · ${data.title}`} subtitle="Atualize a presença dos participantes pelo celular ou computador." breadcrumb={[{ label: "Eventos", href: "/events" }, { label: "Check-in" }]} variant="compact" /><EventAttendanceManager event={data as unknown as GetEvents200DataItem} /></div>
}
