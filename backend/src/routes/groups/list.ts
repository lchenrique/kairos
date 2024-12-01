import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { type ListGroupsQuery, listGroupsQuerySchema, paginatedGroupsSchema } from '../../schemas/groups'
import { errorResponseSchema } from '../../schemas/auth'
import { z } from 'zod'

export const list: FastifyPluginAsyncZod = async (app) => {
  app.get<{
    Querystring: ListGroupsQuery
  }>('/', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['groups'],
      description: 'Lista grupos com paginação e filtros',
      querystring: listGroupsQuerySchema,
      response: {
        200: paginatedGroupsSchema,
        401: errorResponseSchema,
        500: errorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request) => {
    const { page = 1, limit = 10, search, type, sortBy = 'name', order = 'asc' } = request.query

    // Construir o where baseado nos filtros
    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } }
          ]
        } : {},
        type ? { type } : {}
      ]
    }

    // Buscar total de registros
    const totalItems = await prisma.group.count({ where })
    const totalPages = Math.ceil(totalItems / limit)

    // Buscar grupos com paginação
    const groups = await prisma.group.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
      include: {
        members: {
          include: {
            member: true
          }
        }
      }
    })

    // Mapear os grupos para corresponder ao schema
    const mappedGroups = groups.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      type: group.type,
      meetingDay: group.meetingDay,
      startTime: group.startTime,
      endTime: group.endTime,
      location: group.location,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      members: group.members.map(memberGroup => ({
        member: {
          id: memberGroup.member.id,
          name: memberGroup.member.name,
          email: memberGroup.member.email || '',
          phone: memberGroup.member.phone,
          avatar: memberGroup.member.image
        },
        groupId: memberGroup.groupId,
        memberId: memberGroup.memberId,
        role: memberGroup.role,
        joinedAt: memberGroup.createdAt,
        updatedAt: memberGroup.updatedAt
      }))
    }))

    return {
      data: mappedGroups,
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
