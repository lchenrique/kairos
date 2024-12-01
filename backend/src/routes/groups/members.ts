import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { 
  type AddGroupMemberInput, 
  addGroupMemberSchema, 
  getGroupParamsSchema, 
  groupMemberSchema
} from '../../schemas/groups'
import { errorResponseSchema, noContentResponseSchema } from '../../schemas/shared'
import { z } from 'zod'

export const members: FastifyPluginAsyncZod = async (app) => {
  // Adicionar membro ao grupo
  app.post<{
    Params: { id: string }
    Body: AddGroupMemberInput
  }>('/:id/members', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['groups'],
      description: 'Adiciona um membro ao grupo',
      params: getGroupParamsSchema,
      body: addGroupMemberSchema,
      response: {
        201: groupMemberSchema,
        400: errorResponseSchema,
        401: errorResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const { id } = request.params
    const { memberId, role } = request.body

    // Verifica se o grupo existe
    const group = await prisma.group.findUnique({
      where: { id }
    })

    if (!group) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Grupo não encontrado'
      })
    }

    // Verifica se o membro existe
    const member = await prisma.member.findUnique({
      where: { id: memberId }
    })

    if (!member) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Membro não encontrado'
      })
    }

    // Verifica se o membro já está no grupo
    const exists = await prisma.memberGroup.findUnique({
      where: {
        memberId_groupId: {
          groupId: id,
          memberId
        }
      }
    })

    if (exists) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Membro já está no grupo'
      })
    }

    const groupMember = await prisma.memberGroup.create({
      data: {
        groupId: id,
        memberId,
        role
      },
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
    })

    // Mapear o resultado para corresponder ao schema
    return reply.status(201).send({
      member: {
        id: groupMember.member.id,
        name: groupMember.member.name,
        email: groupMember.member.email || '',
        phone: groupMember.member.phone,
        avatar: groupMember.member.image
      },
      groupId: groupMember.groupId,
      memberId: groupMember.memberId,
      role: groupMember.role,
      joinedAt: groupMember.createdAt,
      updatedAt: groupMember.updatedAt
    })
  })

  // Remover membro do grupo
  app.delete<{
    Params: { id: string, memberId: string }
  }>('/:id/members/:memberId', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['groups'],
      description: 'Remove um membro do grupo',
      params: z.object({
        id: z.string(),
        memberId: z.string()
      }),
      response: {
        204: noContentResponseSchema,
        401: errorResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const { id, memberId } = request.params

    // Verifica se o membro está no grupo
    const exists = await prisma.memberGroup.findUnique({
      where: {
        memberId_groupId: {
          groupId: id,
          memberId
        }
      }
    })

    if (!exists) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Membro não está no grupo'
      })
    }

    await prisma.memberGroup.delete({
      where: {
        memberId_groupId: {
          groupId: id,
          memberId
        }
      }
    })

    return reply.status(204).send()
  })
}
