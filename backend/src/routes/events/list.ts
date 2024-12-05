import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { type ListEventsQuery, listEventsSchema, paginatedEventsSchema } from '../../schemas/events'
import { errorResponseSchema } from '../../schemas/shared'

export const list: FastifyPluginAsyncZod = async (app) => {
  app.get<{
    Querystring: ListEventsQuery
  }>('/', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['events'],
      description: 'Lista eventos com paginação e filtros',
      querystring: listEventsSchema,
      response: {
        200: paginatedEventsSchema,
        500: errorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request) => {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      type, 
      status, 
      startDate, 
      endDate,
      sortBy = 'startDate',
      order = 'asc'
    } = request.query as ListEventsQuery

    const where = {
      AND: [
        // Busca por título ou descrição
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        // Filtro por tipo
        type ? { type } : {},
        // Filtro por status
        status ? { status } : {},
        // Filtro por data
        startDate ? { startDate: { gte: startDate } } : {},
        endDate ? { endDate: { lte: endDate } } : {}
      ]
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
                  image: true
                }
              }
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order }
      }),
      prisma.event.count({ where })
    ])

    const totalPages = Math.ceil(totalItems / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return {
      data: events,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage,
        hasPreviousPage
      }
    }
  })
}
