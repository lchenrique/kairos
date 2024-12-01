import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { systemRoutes } from './routes/system'
import { authRoutes } from './routes/auth'
import { memberRoutes } from './routes/members'
import { groupRoutes } from './routes/groups'
import { env } from './config/env'

export async function buildApp() {
  const app = fastify({
    logger: true,
  })

  // Plugins
  await app.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })

  await app.register(jwt, {
    secret: env.JWT_SECRET,
  })

  // OpenAPI
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Kairos API',
        description: 'API do sistema de gestão de igrejas Kairos',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3333',
          description: 'Local server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'auth', description: 'Autenticação' },
        { name: 'members', description: 'Membros' },
        { name: 'groups', description: 'Grupos' },
        { name: 'system', description: 'Sistema' },
      ],
    },
  })

  await app.register(swaggerUI, {
    routePrefix: '/docs',
  })

  // Routes
  await app.register(systemRoutes, { prefix: '/api/system' })
  await app.register(authRoutes, { prefix: '/api/auth' })
  await app.register(memberRoutes, { prefix: '/api/members' })
  await app.register(groupRoutes, { prefix: '/api/groups' })

  app.get('/', async () => {
    return { message: 'Hello World' }
  })

  app.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  // Generate swaggeron
  app.ready().then(() => {
    app.swagger({ yaml: false })
  })

  return app
}
