import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { type ListMembersQuery, listMembersQuerySchema, paginatedMembersSchema } from '../../schemas/members'
import { z } from 'zod'

export const list: FastifyPluginAsyncZod = async (app) => {
  app.get<{
    Querystring: ListMembersQuery
  }>('/', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['members'],
      description: 'Lista membros com paginação e filtros',
      querystring: listMembersQuerySchema,
      response: {
        200: paginatedMembersSchema,
        500: z.object({
          statusCode: z.number(),
          error: z.string(),
          message: z.string()
        })
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request) => {
    const { page = 1, limit = 10, search, status, sortBy = 'name', order = 'asc' } = request.query

    // Construir o where baseado nos filtros
    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } }
          ]
        } : {},
        status ? { status } : {}
      ]
    }

    // Buscar total de registros
    const totalItems = await prisma.member.count({ where })
    const totalPages = Math.ceil(totalItems / limit)

    // Buscar membros com paginação
    const members = await prisma.member.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
      include: {
        groups: {
          include: {
            group: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    return {
      data: members.map(member => ({
        ...member,
        groups: member.groups.map(({ group }) => ({
          id: group.id,
          name: group.name
        }))
      })),
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }
  })
}
