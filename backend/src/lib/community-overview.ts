import type { ReportPeriodQuery } from '../schemas/reports.js'
import { prisma } from './prisma.js'

function resolvePeriod(period: ReportPeriodQuery['period'], now: Date) {
  if (period === 'all') return { from: null, to: null }
  if (period === 'year') return { from: new Date(now.getFullYear(), 0, 1), to: now }

  const days = period === '30d' ? 30 : 90
  return { from: new Date(now.getTime() - days * 24 * 60 * 60 * 1000), to: now }
}

export async function getCommunityOverview(
  churchIds: string[],
  periodKey: ReportPeriodQuery['period'],
) {
  const now = new Date()
  const period = resolvePeriod(periodKey, now)
  const churchScope = { churchId: { in: churchIds } }
  const periodFilter =
    period.from && period.to ? { startDate: { gte: period.from, lte: period.to } } : {}
  const [membersTotal, activeMembers, groupsTotal, eventsTotal, upcomingEvents, attendance] =
    await Promise.all([
      prisma.member.count({ where: churchScope }),
      prisma.member.count({ where: { ...churchScope, status: 'ACTIVE' } }),
      prisma.group.count({ where: churchScope }),
      prisma.event.count({ where: { ...churchScope, ...periodFilter } }),
      prisma.event.count({
        where: { ...churchScope, startDate: { gte: now }, status: { not: 'CANCELLED' } },
      }),
      prisma.eventParticipant.groupBy({
        by: ['status'],
        where: { event: { ...churchScope, ...periodFilter } },
        _count: { _all: true },
      }),
    ])

  const counts = Object.fromEntries(attendance.map((item) => [item.status, item._count._all]))
  const total = attendance.reduce((sum, item) => sum + item._count._all, 0)
  const confirmed = counts.CONFIRMED ?? 0

  return {
    membersTotal,
    activeMembers,
    groupsTotal,
    eventsTotal,
    upcomingEvents,
    attendance: {
      total,
      confirmed,
      pending: counts.PENDING ?? 0,
      cancelled: counts.CANCELLED ?? 0,
      rate: total ? Math.round((confirmed / total) * 100) : 0,
    },
    period: { key: periodKey, from: period.from, to: period.to },
    generatedAt: now,
  }
}
