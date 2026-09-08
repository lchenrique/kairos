import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

interface PasswordResetEmail {
  name: string
  email: string
  token: string
}

interface TeamInvitationEmail {
  name: string
  email: string
  organizationName: string
  invitedByName: string
  token: string
}

export function createEmailTransport() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) {
    throw new Error('SMTP_NOT_CONFIGURED')
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  })
}

export async function sendPasswordResetEmail(input: PasswordResetEmail) {
  if (process.env.NODE_ENV === 'test') return

  const resetUrl = new URL('/reset-password', env.FRONTEND_URL)
  resetUrl.searchParams.set('token', input.token)

  await createEmailTransport().sendMail({
    from: env.MAIL_FROM || `Kairos <${env.SMTP_USER}>`,
    to: input.email,
    subject: 'Redefina sua senha do Kairos',
    text: [
      `Olá, ${input.name}.`,
      '',
      'Recebemos uma solicitação para redefinir sua senha no Kairos.',
      `Acesse este link em até 60 minutos: ${resetUrl.toString()}`,
      '',
      'Se você não fez esta solicitação, ignore este e-mail.',
    ].join('\n'),
  })
}

export async function sendTeamInvitationEmail(input: TeamInvitationEmail) {
  if (process.env.NODE_ENV === 'test') return

  const invitationUrl = new URL('/accept-invite', env.FRONTEND_URL)
  invitationUrl.searchParams.set('token', input.token)

  await createEmailTransport().sendMail({
    from: env.MAIL_FROM || `Kairos <${env.SMTP_USER}>`,
    to: input.email,
    subject: `Convite para a equipe da ${input.organizationName}`,
    text: [
      `Olá, ${input.name}.`,
      '',
      `${input.invitedByName} convidou você para acessar a ${input.organizationName} no Kairos.`,
      `Defina sua senha em até 72 horas: ${invitationUrl.toString()}`,
      '',
      'Se você não esperava este convite, ignore este e-mail.',
    ].join('\n'),
  })
}
