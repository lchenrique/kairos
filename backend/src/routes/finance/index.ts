import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { requirePermission } from '../../lib/authorization.js'
import { requireActiveSubscriptionForMutation } from '../../lib/billing.js'
import { prisma } from '../../lib/prisma.js'
import { requireCurrentChurch } from '../../lib/tenant.js'
import {
  createFinanceEntrySchema,
  financeEntrySchema,
  financeListSchema,
  financeQuerySchema,
  financeSummarySchema,
  updateFinanceEntrySchema,
} from '../../schemas/finance.js'
import { errorResponseSchema, noContentResponseSchema } from '../../schemas/shared.js'

const idParams = z.object({ id: z.string() })

export const financeRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', app.authenticate)
  app.addHook('preHandler', app.loadTenant)
  app.addHook('preHandler', requireActiveSubscriptionForMutation)

  app.get<{ Querystring: z.infer<typeof financeQuerySchema> }>(
    '/',
    {
      preHandler: [requirePermission('FINANCE_VIEW')],
      schema: {
        tags: ['finance'],
        description: 'Lista lançamentos e resumo financeiro',
        querystring: financeQuerySchema,
        response: { 200: financeListSchema, 401: errorResponseSchema },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request) => {
      const { type, category, from, to, limit = 50 } = request.query
      const where = {
        churchId: { in: request.tenant.churchIds },
        deletedAt: null,
        ...(type ? { type } : {}),
        ...(category ? { category } : {}),
        ...(from || to
          ? { occurredAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } }
          : {}),
      }
      const [data, grouped, entriesCount, categoryRows] = await Promise.all([
        prisma.financeEntry.findMany({ where, orderBy: { occurredAt: 'desc' }, take: limit }),
        prisma.financeEntry.groupBy({ by: ['type'], where, _sum: { amountCents: true } }),
        prisma.financeEntry.count({ where }),
        prisma.financeEntry.findMany({
          where: { churchId: { in: request.tenant.churchIds }, deletedAt: null },
          distinct: ['category'],
          select: { category: true },
          orderBy: { category: 'asc' },
        }),
      ])
      const incomeCents = grouped.find((item) => item.type === 'INCOME')?._sum.amountCents ?? 0
      const expenseCents = grouped.find((item) => item.type === 'EXPENSE')?._sum.amountCents ?? 0
      return {
        data: data.map((entry) => financeEntrySchema.parse(entry)),
        summary: {
          incomeCents,
          expenseCents,
          balanceCents: incomeCents - expenseCents,
          entriesCount,
        },
        categories: categoryRows.map((item) => item.category),
      }
    },
  )

  app.post<{ Body: z.infer<typeof createFinanceEntrySchema> }>(
    '/',
    {
      preHandler: [requirePermission('FINANCE_MANAGE')],
      schema: {
        tags: ['finance'],
        description: 'Cria um lançamento financeiro',
        body: createFinanceEntrySchema,
        response: {
          201: financeEntrySchema,
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const churchId = requireCurrentChurch(request, reply)
      if (!churchId) return
      return reply.status(201).send(
        await prisma.financeEntry.create({
          data: {
            ...request.body,
            churchId,
            createdById: request.user.sub,
            createdByName: request.user.name,
          },
        }),
      )
    },
  )

  app.put<{ Params: { id: string }; Body: z.infer<typeof updateFinanceEntrySchema> }>(
    '/:id',
    {
      preHandler: [requirePermission('FINANCE_MANAGE')],
      schema: {
        tags: ['finance'],
        description: 'Atualiza um lançamento financeiro',
        params: idParams,
        body: updateFinanceEntrySchema,
        response: {
          200: financeEntrySchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const entry = await prisma.financeEntry.findFirst({
        where: {
          id: request.params.id,
          churchId: { in: request.tenant.churchIds },
          deletedAt: null,
        },
        select: { id: true },
      })
      if (!entry)
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'FINANCE_ENTRY_NOT_FOUND',
          message: 'Lançamento financeiro não encontrado.',
        })
      return prisma.financeEntry.update({
        where: { id: entry.id },
        data: {
          ...request.body,
          updatedById: request.user.sub,
          updatedByName: request.user.name,
        },
      })
    },
  )

  app.delete<{ Params: { id: string } }>(
    '/:id',
    {
      preHandler: [requirePermission('FINANCE_MANAGE')],
      schema: {
        tags: ['finance'],
        description: 'Remove um lançamento financeiro',
        params: idParams,
        response: {
          204: noContentResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const entry = await prisma.financeEntry.findFirst({
        where: {
          id: request.params.id,
          churchId: { in: request.tenant.churchIds },
          deletedAt: null,
        },
        select: { id: true },
      })
      if (!entry)
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'FINANCE_ENTRY_NOT_FOUND',
          message: 'Lançamento financeiro não encontrado.',
        })
      await prisma.financeEntry.update({
        where: { id: entry.id },
        data: {
          deletedAt: new Date(),
          deletedById: request.user.sub,
          deletedByName: request.user.name,
        },
      })
      return reply.status(204).send()
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [requirePermission('FINANCE_VIEW')],
      schema: {
        tags: ['finance'],
        description: 'Resumo financeiro sem a lista de lançamentos',
        response: { 200: financeSummarySchema, 401: errorResponseSchema },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request) => {
      const where = { churchId: { in: request.tenant.churchIds }, deletedAt: null }
      const [grouped, entriesCount] = await Promise.all([
        prisma.financeEntry.groupBy({ by: ['type'], where, _sum: { amountCents: true } }),
        prisma.financeEntry.count({ where }),
      ])
      const incomeCents = grouped.find((item) => item.type === 'INCOME')?._sum.amountCents ?? 0
      const expenseCents = grouped.find((item) => item.type === 'EXPENSE')?._sum.amountCents ?? 0
      return { incomeCents, expenseCents, balanceCents: incomeCents - expenseCents, entriesCount }
    },
  )
}
