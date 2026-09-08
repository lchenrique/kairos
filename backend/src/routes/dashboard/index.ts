import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { requirePermission } from '../../lib/authorization.js'
import { getCommunityOverview } from '../../lib/community-overview.js'
import { errorResponseSchema } from '../../schemas/auth.js'
import {
  type ReportPeriodQuery,
  reportOverviewSchema,
  reportPeriodQuerySchema,
} from '../../schemas/reports.js'

export const dashboardRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', app.authenticate)
  app.addHook('preHandler', app.loadTenant)

  app.get<{ Querystring: ReportPeriodQuery }>(
    '/overview',
    {
      preHandler: [requirePermission('DASHBOARD_VIEW')],
      schema: {
        tags: ['dashboard'],
        description: 'Resumo operacional do dashboard',
        querystring: reportPeriodQuerySchema,
        response: {
          200: reportOverviewSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request) => getCommunityOverview(request.tenant.churchIds, request.query.period),
  )
}
