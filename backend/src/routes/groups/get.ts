import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { getGroupParamsSchema, groupSchema } from '../../schemas'

export const get: FastifyPluginAsyncZod = async (app) => {
  app.get<{
    Params: { id: string }
  }>('/:id', {
    schema: {
      tags: ['groups'],
      description: 'Obtém um grupo por ID',
      params: getGroupParamsSchema,
      response: {
        200: groupSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request) => {
    const { id } = request.params

    const group = await prisma.group.findUniqueOrThrow({
      where: { id },
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

    return group
  })
}
