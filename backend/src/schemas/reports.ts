import { z } from 'zod'

export const reportPeriodQuerySchema = z.object({
  period: z.enum(['30d', '90d', 'year', 'all']).default('90d'),
})

export const reportAttendanceSchema = z.object({
  total: z.number(),
  confirmed: z.number(),
  pending: z.number(),
  cancelled: z.number(),
  rate: z.number(),
})

export const reportOverviewSchema = z.object({
  membersTotal: z.number(),
  activeMembers: z.number(),
  groupsTotal: z.number(),
  eventsTotal: z.number(),
  upcomingEvents: z.number(),
  attendance: reportAttendanceSchema,
  period: z.object({
    key: reportPeriodQuerySchema.shape.period,
    from: z.coerce.date().nullable(),
    to: z.coerce.date().nullable(),
  }),
  generatedAt: z.coerce.date(),
})

export type ReportOverview = z.infer<typeof reportOverviewSchema>
export type ReportPeriodQuery = z.infer<typeof reportPeriodQuerySchema>
