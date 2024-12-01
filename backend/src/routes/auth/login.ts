import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import bcrypt from 'bcrypt'
import { type LoginInput, loginSchema, authResponseSchema, errorResponseSchema } from '../../schemas/auth'

export const login: FastifyPluginAsyncZod = async (app) => {
  app.post('/', {
    schema: {
      tags: ['auth'],
      description: 'Autentica um usuário',
      body: loginSchema,
      response: {
        200: authResponseSchema,
        401: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    const { email, password } = request.body as LoginInput

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        code: 'INVALID_CREDENTIALS',
        message: 'Credenciais inválidas'
      })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        code: 'INVALID_CREDENTIALS',
        message: 'Credenciais inválidas'
      })
    }

    const token = await app.jwt.sign({ 
      sub: user.id,
      name: user.name,
      email: user.email
    })

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  })
}
