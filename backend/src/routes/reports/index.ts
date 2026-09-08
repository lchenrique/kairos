import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { requirePermission } from '../../lib/authorization.js'
import { getCommunityOverview } from '../../lib/community-overview.js'
import { errorResponseSchema } from '../../schemas/auth.js'
import {
  type ReportPeriodQuery,
  reportOverviewSchema,
  reportPeriodQuerySchema,
} from '../../schemas/reports.js'

export const reportRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', app.authenticate)
  app.addHook('preHandler', app.loadTenant)

  app.get<{ Querystring: ReportPeriodQuery }>(
    '/overview',
    {
      preHandler: [requirePermission('REPORTS_VIEW')],
      schema: {
        tags: ['reports'],
        description: 'Resumo de indicadores para o painel de relatórios',
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
