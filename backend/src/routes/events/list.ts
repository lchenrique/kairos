import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { hasPermission } from '../../lib/authorization.js'
import { prisma } from '../../lib/prisma.js'
import {
  type ListEventsQuery,
  eventSchema,
  listEventsSchema,
  paginatedEventsSchema,
  parseEventResponse,
} from '../../schemas/events.js'
import { errorResponseSchema } from '../../schemas/shared.js'

export const list: FastifyPluginAsyncZod = async (app) => {
  app.get<{
    Querystring: ListEventsQuery
  }>(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['events'],
        description: 'Lista eventos com paginação e filtros',
        querystring: listEventsSchema,
        response: {
          200: paginatedEventsSchema,
          500: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request) => {
      const canViewParticipants = hasPermission(request.user.role, 'MEMBERS_VIEW')
      const {
        page = 1,
        limit = 10,
        search,
        type,
        status,
        startDate,
        endDate,
        sortBy = 'startDate',
        order = 'asc',
      } = request.query as ListEventsQuery

      const where = {
        AND: [
          { churchId: { in: request.tenant.churchIds } },
          // Busca por título ou descrição
          search
            ? {
                OR: [{ title: { contains: search } }, { description: { contains: search } }],
              }
            : {},
          // Filtro por tipo
          type ? { type } : {},
          // Filtro por status
          status ? { status } : {},
          // Filtro por data
          startDate ? { startDate: { gte: startDate } } : {},
          endDate ? { endDate: { lte: endDate } } : {},
        ],
      }

      const [events, totalItems] = await Promise.all([
        prisma.event.findMany({
          where,
          include: {
            participants: {
              include: {
                member: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    image: true,
                  },
                },
              },
            },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: order },
        }),
        prisma.event.count({ where }),
      ])

      const totalPages = Math.ceil(totalItems / limit)
      const hasNextPage = page < totalPages
      const hasPreviousPage = page > 1

      return {
        data: events.map((event) =>
          parseEventResponse({
            ...event,
            participants: canViewParticipants ? event.participants : [],
          }),
        ),
        meta: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
      }
    },
  )
}
