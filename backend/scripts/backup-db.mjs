import { access, copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const prismaRoot = path.join(backendRoot, 'prisma')

function resolveDatabasePath() {
  const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db'
  if (!databaseUrl.startsWith('file:')) {
    throw new Error('O backup local suporta apenas DATABASE_URL do SQLite iniciada por file:.')
  }

  const filePath = decodeURIComponent(databaseUrl.slice('file:'.length).split('?')[0])
  return path.isAbsolute(filePath) ? path.resolve(filePath) : path.resolve(prismaRoot, filePath)
}

function resolveOutputPath() {
  const outputIndex = process.argv.indexOf('--output')
  if (outputIndex >= 0) {
    const configured = process.argv[outputIndex + 1]
    if (!configured) throw new Error('Informe um caminho depois de --output.')
    return path.resolve(configured)
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  return path.join(backendRoot, 'backups', `kairos-${stamp}.db`)
}

const source = resolveDatabasePath()
const destination = resolveOutputPath()
if (source === destination) throw new Error('O destino do backup não pode ser o próprio banco.')

await access(source)
await mkdir(path.dirname(destination), { recursive: true })
await copyFile(source, destination)
console.log(`Backup criado em ${destination}`)
