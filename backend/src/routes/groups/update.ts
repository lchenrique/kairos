import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { 
  type UpdateGroupInput, 
  type AddGroupMemberInput,
  updateGroupSchema, 
  getGroupParamsSchema, 
  groupSchema
} from '../../schemas/groups'
import { errorResponseSchema } from '../../schemas/auth'

export const update: FastifyPluginAsyncZod = async (app) => {
  app.put<{
    Params: { id: string }
    Body: UpdateGroupInput
  }>('/:id', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['groups'],
      description: 'Atualiza um grupo',
      params: getGroupParamsSchema,
      body: updateGroupSchema,
      response: {
        200: groupSchema,
        401: errorResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const { id } = request.params
    const { members, ...groupData } = request.body as UpdateGroupInput

    // Verifica se o grupo existe
    const exists = await prisma.group.findUnique({
      where: { id }
    })

    if (!exists) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Grupo não encontrado'
      })
    }

    const group = await prisma.group.update({
      where: { id },
      data: {
        ...groupData,
        members: members ? {
          deleteMany: {},
          create: members.map(({ memberId, role }: AddGroupMemberInput) => ({
            memberId,
            role
          }))
        } : undefined
      },
      include: {
        members: {
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
      }
    })

    // Mapear o resultado para corresponder ao schema
    return {
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
    }
  })
}
