import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { type CreateMemberInput, createMemberSchema, memberSchema } from '../../schemas/members'
import { z } from 'zod'

export const create: FastifyPluginAsyncZod = async (app) => {
  app.post<{
    Body: CreateMemberInput
  }>('/', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['members'],
      description: 'Cria um novo membro',
      body: createMemberSchema,
      response: {
        201: memberSchema,
        400: z.object({
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
    const { groups, ...memberData } = request.body

    const member = await prisma.member.create({
      data: {
        ...memberData,
        groups: groups ? {
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

    return reply.status(201).send(member)
  })
}
