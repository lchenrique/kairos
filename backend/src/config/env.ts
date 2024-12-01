import { type EnvConfig, envSchema } from '../schemas/config.js'

export const env = envSchema.parse({
  PORT: Number(process.env.PORT) || 3333,
  JWT_SECRET: process.env.JWT_SECRET || 'supersecret_change_this_in_production',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/kairos?schema=public',
}) satisfies EnvConfig
