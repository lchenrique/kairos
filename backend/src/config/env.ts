import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { type EnvConfig, envSchema } from '../schemas/config.js'

function loadLocalEnvFile() {
  const envPath = path.resolve(process.cwd(), '.env')

  if (!existsSync(envPath)) {
    return
  }

  for (const rawLine of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) {
      continue
    }

    const separatorIndex = line.indexOf('=')
    if (separatorIndex <= 0) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadLocalEnvFile()

const jwtSecret =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production'
    ? (() => {
        throw new Error('JWT_SECRET precisa ser definido em produção')
      })()
    : 'supersecret_change_this_in_production')

export const env = envSchema.parse({
  PORT: Number(process.env.PORT) || 3333,
  JWT_SECRET: jwtSecret,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || undefined,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.hostinger.com',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 465,
  SMTP_SECURE: process.env.SMTP_SECURE !== 'false',
  SMTP_USER: process.env.SMTP_USER || 'kairos@codebycarlos.dev',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || undefined,
  MAIL_FROM: process.env.MAIL_FROM || 'Kairos <kairos@codebycarlos.dev>',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || undefined,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || undefined,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || undefined,
}) satisfies EnvConfig

if (
  process.env.NODE_ENV === 'production' &&
  (env.JWT_SECRET.length < 32 ||
    ['supersecret_change_this_in_production', 'troque-por-um-segredo-longo-e-aleatorio'].includes(
      env.JWT_SECRET,
    ))
) {
  throw new Error('JWT_SECRET precisa ter ao menos 32 caracteres aleatórios em produção')
}

if (process.env.NODE_ENV === 'production' && (!env.SMTP_USER || !env.SMTP_PASSWORD)) {
  throw new Error('SMTP_USER e SMTP_PASSWORD precisam ser definidos em produção')
}
