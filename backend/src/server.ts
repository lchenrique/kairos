import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import rateLimit from '@fastify/rate-limit'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import Fastify, { type FastifyRequest, type FastifyReply } from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { env } from './config/env.js'
import { verifyAuthCentralJwt } from './lib/auth-central.js'
import { prisma } from './lib/prisma.js'
import { type TenantContext, loadTenantContext } from './lib/tenant.js'
import { authRoutes } from './routes/auth/index.js'
import { billingRoutes } from './routes/billing/index.js'
import { billingWebhookRoutes } from './routes/billing/webhooks.js'
import { dashboardRoutes } from './routes/dashboard/index.js'
import { eventRoutes } from './routes/events/index.js'
import { financeRoutes } from './routes/finance/index.js'
import { groupRoutes } from './routes/groups/index.js'
import { memberRoutes } from './routes/members/index.js'
import { reportRoutes } from './routes/reports/index.js'
import { healthRoutes } from './routes/system/health.js'
import { systemRoutes } from './routes/system/index.js'
import { uploadRoutes } from './routes/uploads/index.js'

import { randomUUID } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Tipos do Fastify
declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    loadTenant: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }

  export interface FastifyRequest {
    tenant: TenantContext
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string
      name: string
      email: string
      role: string
      organizationId: string | null
      sessionVersion: number
      iat?: number
      exp?: number
    }
    user: {
      sub: string
      name: string
      email: string
      role: string
      organizationId: string | null
      sessionVersion: number
    }
  }
}

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
        colorize: true,
      },
    },
  },
  disableRequestLogging: false,
  genReqId: (request) => {
    const receivedId = request.headers['x-request-id']
    if (typeof receivedId === 'string' && /^[A-Za-z0-9._:-]{1,128}$/.test(receivedId)) {
      return receivedId
    }
    return randomUUID()
  },
  ignoreTrailingSlash: true,
  ignoreDuplicateSlashes: true,
}).withTypeProvider<ZodTypeProvider>()

// Plugins
await app.register(cookie)
await app.register(helmet)
await app.register(rateLimit, {
  max: process.env.NODE_ENV === 'test' ? 1000 : 120,
  timeWindow: '1 minute',
  errorResponseBuilder: (_request, context) => ({
    statusCode: 429,
    error: 'Too Many Requests',
    message: `Muitas requisições. Tente novamente em ${context.after}.`,
  }),
})

const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [env.FRONTEND_URL]
    : Array.from(new Set([env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001']))

await app.register(cors, {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Church-Id',
    'X-Kairos-Client',
    'X-Request-Id',
  ],
  exposedHeaders: ['Authorization', 'X-Request-Id'],
})

await app.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
})

await app.register(jwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'token',
    signed: false,
  },
  sign: {
    expiresIn: '7d',
  },
})

app.addHook('onRequest', async (request, reply) => {
  reply.header('X-Request-Id', request.id)
  const mutatesState = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)
  const usesCookieSession = Boolean(request.cookies.token && !request.headers.authorization)

  if (mutatesState && usesCookieSession && request.headers['x-kairos-client'] !== 'web') {
    return reply.status(403).send({
      statusCode: 403,
      error: 'Forbidden',
      code: 'CSRF_HEADER_REQUIRED',
      message: 'Cabeçalho de segurança ausente.',
    })
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
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

await app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

// Autenticação
app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authorization = request.headers.authorization
    if (!authorization?.startsWith('Bearer ')) throw new Error('MISSING_BEARER_TOKEN')
    const payload = await verifyAuthCentralJwt(authorization.slice('Bearer '.length))

    let user: any = await (prisma.user as any).findUnique({
      where: { authCentralSubject: payload.sub },
      include: {
        organizations: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
    })
    // One-time, guarded transition for existing Kairos users. New sessions
    // always resolve by the immutable Auth Central subject afterwards.
    if (!user) {
      const existing: any = await prisma.user.findUnique({ where: { email: payload.email } })
      if (existing && !existing.authCentralSubject) {
        await (prisma.user as any).update({ where: { id: existing.id }, data: { authCentralSubject: payload.sub } })
        user = await (prisma.user as any).findUnique({
          where: { authCentralSubject: payload.sub },
          include: { organizations: { where: { status: 'ACTIVE' }, orderBy: { createdAt: 'asc' }, take: 1 } },
        })
      }
    }
    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            authCentralSubject: payload.sub,
            name: payload.name?.trim() || payload.email.split('@')[0],
            email: payload.email.trim().toLowerCase(),
            password: 'AUTH_CENTRAL_MANAGED',
            role: 'USER',
          },
          include: { organizations: { where: { status: 'ACTIVE' }, orderBy: { createdAt: 'asc' }, take: 1 } },
        })
      } catch {
        // A simultaneous first request can create the local projection first.
        // Reading it again makes provisioning idempotent without trusting email
        // as the long-term identity key.
        user = await (prisma.user as any).findUnique({
          where: { authCentralSubject: payload.sub },
          include: { organizations: { where: { status: 'ACTIVE' }, orderBy: { createdAt: 'asc' }, take: 1 } },
        })
      }
    }

    if (!user) throw new Error('SESSION_REVOKED')

    const membership = user.organizations[0]

    request.user = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: membership?.role || 'USER',
      organizationId: membership?.organizationId || null,
      sessionVersion: user.sessionVersion,
    }
  } catch (_err) {
    return reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      code: 'INVALID_OR_EXPIRED_SESSION',
      message: 'Sessão inválida, expirada ou encerrada',
    })
  }
})

app.decorateRequest('tenant')
app.decorate('loadTenant', loadTenantContext)

// Rotas
app.register(authRoutes, { prefix: '/auth' })
app.register(billingWebhookRoutes, { prefix: '/billing' })
app.register(billingRoutes, { prefix: '/billing' })
app.register(dashboardRoutes, { prefix: '/dashboard' })
app.register(memberRoutes, { prefix: '/members' })
app.register(uploadRoutes, { prefix: '/uploads' })
app.register(systemRoutes, { prefix: '/system' })
app.register(groupRoutes, { prefix: '/groups' })
app.register(eventRoutes, { prefix: '/events' })
app.register(reportRoutes, { prefix: '/reports' })
app.register(healthRoutes, { prefix: '/health' })
app.register(financeRoutes, { prefix: '/finance' })

const writeSwaggerFile = () => {
  const swagger = app.swagger()
  try {
    writeFileSync(path.resolve(__dirname, '../swagger.json'), JSON.stringify(swagger, null, 2))
  } catch (err) {
    app.log.error({ error: err }, 'Error writing swagger.json')
  }
}

export async function startServer() {
  await app.listen({ port: env.PORT, host: '0.0.0.0' })
  await app.ready()
  writeSwaggerFile()
  app.log.info(`🚀 Server running at http://localhost:${env.PORT}`)
  app.log.info(`📚 Documentation available at http://localhost:${env.PORT}/docs`)
}

let stopping = false

export async function stopServer(signal = 'manual') {
  if (stopping) return
  stopping = true
  app.log.info({ signal }, 'Encerrando servidor')

  try {
    await app.close()
  } finally {
    await prisma.$disconnect()
  }

  app.log.info({ signal }, 'Servidor encerrado com segurança')
}

export async function handleShutdown(signal: 'SIGINT' | 'SIGTERM') {
  try {
    await stopServer(signal)
  } catch (error) {
    app.log.error({ error, signal }, 'Falha ao encerrar servidor')
    process.exitCode = 1
  }
}

const isMainModule =
  Boolean(process.argv[1]) && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMainModule) {
  process.once('SIGINT', () => void handleShutdown('SIGINT'))
  process.once('SIGTERM', () => void handleShutdown('SIGTERM'))

  try {
    await startServer()
  } catch (error) {
    app.log.error(error)
    await prisma.$disconnect()
    process.exitCode = 1
  }
}
