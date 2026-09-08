import { env } from '../dist/config/env.js'
import { createEmailTransport } from '../dist/lib/mailer.js'

const args = process.argv.slice(2).filter((argument) => argument !== '--')

function readRecipient() {
  const inline = args.find((argument) => argument.startsWith('--to='))
  if (inline) return inline.slice('--to='.length).trim()

  const index = args.indexOf('--to')
  return index >= 0 ? args[index + 1]?.trim() : undefined
}

function printUsage() {
  console.log('Uso: pnpm --filter @kairos/backend email:verify [--to destinatario@exemplo.com]')
  console.log('Sem --to, o comando apenas autentica no SMTP e não envia mensagem.')
}

if (args.includes('--help') || args.includes('-h')) {
  printUsage()
  process.exit(0)
}

const recipient = readRecipient()
if (
  args.some(
    (argument) =>
      argument.startsWith('-') && argument !== '--to' && !argument.startsWith('--to='),
  )
) {
  printUsage()
  process.exit(1)
}

if (args.includes('--to') && !recipient) {
  console.error('O argumento --to exige um destinatário.')
  process.exit(1)
}

if (recipient && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
  console.error('Destinatário inválido. Informe um e-mail completo em --to.')
  process.exit(1)
}

const missingVariables = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD'].filter(
  (key) => !env[key],
)
if (missingVariables.length > 0) {
  console.error(`SMTP não configurado. Variáveis ausentes: ${missingVariables.join(', ')}.`)
  process.exit(1)
}

const transport = createEmailTransport()

try {
  await transport.verify()
  console.log(
    `SMTP autenticado com sucesso em ${env.SMTP_HOST}:${env.SMTP_PORT} como ${env.SMTP_USER}.`,
  )

  if (recipient) {
    const info = await transport.sendMail({
      from: env.MAIL_FROM || `Kairos <${env.SMTP_USER}>`,
      to: recipient,
      subject: 'Teste de entrega do Kairos',
      text: [
        'Este é um teste de entrega do e-mail transacional do Kairos.',
        '',
        `Ambiente de origem: ${env.FRONTEND_URL}`,
        `Enviado em: ${new Date().toISOString()}`,
      ].join('\n'),
    })
    console.log(`Mensagem de teste aceita pelo SMTP para ${recipient}. ID: ${info.messageId}`)
  } else {
    console.log('Nenhuma mensagem foi enviada. Use --to para executar o smoke test de entrega.')
  }
} catch (error) {
  const message = error instanceof Error ? error.message : 'falha desconhecida'
  console.error(`Falha ao validar o SMTP: ${message}`)
  process.exitCode = 1
} finally {
  transport.close()
}
