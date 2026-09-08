import { access, copyFile, mkdir, open } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const prismaRoot = path.join(backendRoot, 'prisma')

function resolveDatabasePath() {
  const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db'
  if (!databaseUrl.startsWith('file:')) {
    throw new Error('A restauração local suporta apenas DATABASE_URL do SQLite iniciada por file:.')
  }

  const filePath = decodeURIComponent(databaseUrl.slice('file:'.length).split('?')[0])
  return path.isAbsolute(filePath) ? path.resolve(filePath) : path.resolve(prismaRoot, filePath)
}

const sourceArgument = process.argv.slice(2).find((argument) => !argument.startsWith('--'))
if (!sourceArgument || !process.argv.includes('--force')) {
  throw new Error('Uso: pnpm --filter @kairos/backend restore -- <backup.db> --force')
}

const source = path.resolve(sourceArgument)
const destination = resolveDatabasePath()
if (source === destination) throw new Error('O arquivo de backup não pode ser o banco de destino.')

await access(source)
const file = await open(source, 'r')
try {
  const header = Buffer.alloc(16)
  const { bytesRead } = await file.read(header, 0, header.length, 0)
  if (bytesRead !== header.length || header.toString('utf8') !== 'SQLite format 3\u0000') {
    throw new Error('O arquivo informado não é um banco SQLite válido.')
  }
} finally {
  await file.close()
}

await mkdir(path.dirname(destination), { recursive: true })
try {
  await access(destination)
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const safetyOutputIndex = process.argv.indexOf('--safety-output')
  const configuredSafetyOutput =
    safetyOutputIndex >= 0 ? process.argv[safetyOutputIndex + 1] : undefined
  if (safetyOutputIndex >= 0 && !configuredSafetyOutput) {
    throw new Error('Informe um caminho depois de --safety-output.')
  }
  const safetyCopy = configuredSafetyOutput
    ? path.resolve(configuredSafetyOutput)
    : path.join(backendRoot, 'backups', `pre-restore-${stamp}.db`)
  await mkdir(path.dirname(safetyCopy), { recursive: true })
  await copyFile(destination, safetyCopy)
  console.log(`Cópia de segurança anterior criada em ${safetyCopy}`)
} catch (error) {
  if (error?.code !== 'ENOENT') throw error
}

await copyFile(source, destination)
console.log(`Banco restaurado em ${destination}`)
