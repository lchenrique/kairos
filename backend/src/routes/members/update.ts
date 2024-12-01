import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { type UpdateMemberInput, memberSchema, updateMemberSchema } from '../../schemas/members'
import { z } from 'zod'

export const update: FastifyPluginAsyncZod = async (app) => {
  app.put<{
    Params: { id: string }
    Body: UpdateMemberInput
  }>('/:id', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['members'],
      description: 'Atualiza um membro',
      params: z.object({
        id: z.string()
      }),
      body: updateMemberSchema,
      response: {
        200: memberSchema,
        404: z.object({
          statusCode: z.number(),
          error: z.string(),
          message: z.string()
        }),
        500: z.object({
          statusCode: z.number(),
          error: z.string(),
          message: z.string()
        })
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const { id } = request.params
    const { groups, ...memberData } = request.body

    const member = await prisma.member.findUnique({
      where: { id }
    })

    if (!member) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Membro não encontrado'
      })
    }

    const updatedMember = await prisma.member.update({
      where: { id },
      data: {
        ...memberData,
        groups: groups ? {
          deleteMany: {},
          create: groups.map(({ id }) => ({
            groupId: id
          }))
        } : undefined
      },
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

    return updatedMember
  })
}
