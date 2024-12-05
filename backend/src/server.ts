import Fastify, { FastifyRequest, FastifyReply } from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'

import { authRoutes } from './routes/auth'
import { memberRoutes } from './routes/members'
import { systemRoutes } from './routes/system'
import { uploadRoutes } from './routes/uploads'
import { groupRoutes } from './routes/groups'
import { env } from './config/env'
// import { eventRoutes } from './routes/events'

import { writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Tipos do Fastify
declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string
      name: string
      email: string
      iat?: number
      exp?: number
    }
    user: {
      sub: string
      name: string
      email: string
    }
  }
}

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
        colorize: true
      },
    },
  },
  disableRequestLogging: false,
  ignoreTrailingSlash: true,
  ignoreDuplicateSlashes: true
}).withTypeProvider<ZodTypeProvider>()

// Plugins
await app.register(cors, {
  origin: true, // Permite qualquer origem durante testes
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
})

await app.register(jwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '7d'
  }
})

// Configurar compiladores Zod
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Swagger
await app.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Kairos API',
      description: 'API do sistema Kairos para gestão de membros, grupos e eventos',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  transform: jsonSchemaTransform
})

await app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

// Autenticação
app.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = await request.jwtVerify<{
      sub: string
      name: string
      email: string
    }>()

    request.user = {
      sub: payload.sub,
      name: payload.name,
      email: payload.email
    }
  } catch (err) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Token inválido ou expirado'
    })
  }
})

// Rotas
app.register(authRoutes, { prefix: '/auth' })
app.register(memberRoutes, { prefix: '/members' })
app.register(uploadRoutes, { prefix: '/uploads' })
app.register(systemRoutes, { prefix: '/system' })
app.register(groupRoutes, { prefix: '/groups' })
// app.register(eventRoutes, { prefix: '/events' })

// Start
try {
  await app.listen({ port: env.PORT })
  console.log(`🚀 Server running at http://localhost:${env.PORT}`)
  console.log(`📚 Documentation available at http://localhost:${env.PORT}/docs`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}

app.ready(() => {
  const swagger = app.swagger()
  try {
    writeFileSync(
      path.resolve(__dirname, '../swagger.json'),
      JSON.stringify(swagger, null, 2)
    )
  } catch (err) {
    console.error('Error writing swagger.json:', err)
  }
})