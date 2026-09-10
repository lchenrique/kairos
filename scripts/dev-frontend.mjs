import { spawn } from 'node:child_process'
import { findFreePort } from './find-free-port.mjs'
import { terminateProcessTree } from './terminate-process-tree.mjs'

const pnpm = 'pnpm'
const turbo = process.argv.includes('--turbo')
const preferredPort = Number(process.env.FRONTEND_PORT) || 3001
const port = await findFreePort(preferredPort)

console.log(`[dev] Frontend disponível em http://localhost:${port}`)

const nextArgs = ['exec', 'next', 'dev']
if (turbo) {
  nextArgs.push('--turbo')
}
nextArgs.push('-p', String(port))

const child = spawn(pnpm, nextArgs, {
  cwd: process.cwd(),
  env: { ...process.env, FRONTEND_PORT: String(port) },
  stdio: 'inherit',
})

const shutdown = (signal) => {
  terminateProcessTree(child, signal)
}

process.once('SIGINT', () => shutdown('SIGINT'))
process.once('SIGTERM', () => shutdown('SIGTERM'))
child.once('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0)
})
