import { spawn } from 'node:child_process'
import { findFreePort } from './find-free-port.mjs'
import { terminateProcessTree } from './terminate-process-tree.mjs'

const pnpm = 'pnpm'
const preferredPort = Number(process.env.FRONTEND_PORT) || 3001
const frontendPort = await findFreePort(preferredPort)
const frontendUrl = `http://localhost:${frontendPort}`

console.log(`[dev] Frontend disponível em ${frontendUrl}`)

const children = []
let shuttingDown = false

const shutdown = (signal = 'SIGTERM') => {
  if (shuttingDown) {
    return
  }

  shuttingDown = true
  for (const child of children) {
    terminateProcessTree(child, signal)
  }
}

const backend = spawn(pnpm, ['--dir', 'backend', 'run', 'dev'], {
  env: { ...process.env, FRONTEND_URL: frontendUrl },
  stdio: 'inherit',
})

const frontend = spawn(pnpm, ['--dir', 'frontend', 'exec', 'next', 'dev', '-p', String(frontendPort)], {
  env: { ...process.env, FRONTEND_PORT: String(frontendPort) },
  stdio: 'inherit',
})

children.push(backend, frontend)

process.once('SIGINT', () => shutdown('SIGINT'))
process.once('SIGTERM', () => shutdown('SIGTERM'))

for (const child of children) {
  child.once('error', (error) => {
    console.error(`[dev] Falha ao iniciar processo: ${error.message}`)
    shutdown()
  })

  child.once('exit', (code, signal) => {
    if (shuttingDown) {
      return
    }

    shuttingDown = true
    const exitCode = code ?? (signal ? 1 : 0)
    for (const otherChild of children) {
      if (otherChild !== child) {
        terminateProcessTree(otherChild)
      }
    }
    process.exitCode = exitCode
  })
}
