import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import bcrypt from 'bcrypt'
import { type RegisterInput, registerSchema, authResponseSchema, errorResponseSchema } from '../../schemas/auth'

export const register: FastifyPluginAsyncZod = async (app) => {
  app.post('/', {
    schema: {
      tags: ['auth'],
      description: 'Registra um novo usuário',
      body: registerSchema,
      response: {
        201: authResponseSchema,
        400: errorResponseSchema
      }
    }
  }, async (request, reply) => {
    const { name, email, password } = request.body as RegisterInput

    const userExists = await prisma.user.findUnique({
      where: { email }
    })

    if (userExists) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'USER_EXISTS',
        message: 'Email já cadastrado'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    const token = await app.jwt.sign({ 
      sub: user.id,
      name: user.name,
      email: user.email
    })

    return reply.status(201).send({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
  })
}
