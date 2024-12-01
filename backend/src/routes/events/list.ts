import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { type ListEventsQuery, listEventsSchema, paginatedEventsSchema } from '../../schemas/events'

export const list: FastifyPluginAsyncZod = async (app) => {
  app.get('/', {
    schema: {
      tags: ['events'],
      description: 'Lista eventos com paginação e filtros',
      querystring: listEventsSchema,
      response: {
        200: paginatedEventsSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request) => {
    const { page = 1, limit = 10, search, type, status, startDate, endDate } = request.query as ListEventsQuery

    const where = {
      AND: [
        // Busca por título ou descrição
        search ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } }
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

    const [events, total] = await Promise.all([
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
        orderBy: { startDate: 'desc' }
      }),
      prisma.event.count({ where })
    ])

    const pages = Math.ceil(total / limit)

    return {
      items: events,
      total,
      page,
      limit,
      pages
    }
  })
}
