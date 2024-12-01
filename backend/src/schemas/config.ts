import { z } from 'zod'

// Schemas para configuração do Swagger
export const swaggerContactSchema = z.object({
  name: z.string(),
  url: z.string().url()
})

export const swaggerInfoSchema = z.object({
  title: z.string(),
  description: z.string(),
  version: z.string(),
  contact: swaggerContactSchema
})

export const swaggerExternalDocsSchema = z.object({
  url: z.string().url(),
  description: z.string()
})

export const swaggerTagSchema = z.object({
  name: z.string(),
  description: z.string()
})

export const swaggerSecuritySchema = z.object({
  type: z.literal('http'),
  scheme: z.literal('bearer'),
  bearerFormat: z.literal('JWT')
})

export const swaggerSchema = z.object({
  openapi: z.object({
    openapi: z.literal('3.0.0'),
    info: swaggerInfoSchema,
    externalDocs: swaggerExternalDocsSchema,
    tags: z.array(swaggerTagSchema),
    components: z.object({
      securitySchemes: z.object({
        bearerAuth: swaggerSecuritySchema
      })
    }),
    security: z.array(z.object({
      bearerAuth: z.array(z.string())
    }))
  })
})

// Schemas para configuração do ambiente
export const envSchema = z.object({
  PORT: z.number().int().positive(),
  JWT_SECRET: z.string().min(1),
  FRONTEND_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
})

// Tipos gerados dos schemas
export type SwaggerConfig = z.infer<typeof swaggerSchema>
export type EnvConfig = z.infer<typeof envSchema>
