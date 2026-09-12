import { z } from 'zod'

// Schemas para configuração do Swagger
export const swaggerContactSchema = z.object({
  name: z.string(),
  url: z.string().url(),
})

export const swaggerInfoSchema = z.object({
  title: z.string(),
  description: z.string(),
  version: z.string(),
  contact: swaggerContactSchema,
})

export const swaggerExternalDocsSchema = z.object({
  url: z.string().url(),
  description: z.string(),
})

export const swaggerTagSchema = z.object({
  name: z.string(),
  description: z.string(),
})

export const swaggerSecuritySchema = z.object({
  type: z.literal('http'),
  scheme: z.literal('bearer'),
  bearerFormat: z.literal('JWT'),
})

export const swaggerSchema = z.object({
  openapi: z.object({
    openapi: z.literal('3.0.0'),
    info: swaggerInfoSchema,
    externalDocs: swaggerExternalDocsSchema,
    tags: z.array(swaggerTagSchema),
    components: z.object({
      securitySchemes: z.object({
        bearerAuth: swaggerSecuritySchema,
      }),
    }),
    security: z.array(
      z.object({
        bearerAuth: z.array(z.string()),
      }),
    ),
  }),
})

// Schemas para configuração do ambiente
export const envSchema = z.object({
  PORT: z.number().int().positive(),
  JWT_SECRET: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1).optional(),
  CLERK_JWT_KEY: z.string().min(1).optional(),
  FRONTEND_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  COOKIE_DOMAIN: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.number().int().positive(),
  SMTP_SECURE: z.boolean(),
  SMTP_USER: z.union([z.literal('resend'), z.string().email()]).optional(),
  SMTP_PASSWORD: z.string().min(1).optional(),
  MAIL_FROM: z.string().min(1).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  ASAAS_API_KEY: z.string().min(1).optional(),
  ASAAS_WEBHOOK_TOKEN: z.string().min(32).optional(),
  ASAAS_API_URL: z.string().url(),
})

// Tipos gerados dos schemas
export type SwaggerConfig = z.infer<typeof swaggerSchema>
export type EnvConfig = z.infer<typeof envSchema>
