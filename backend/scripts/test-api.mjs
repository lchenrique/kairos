import { spawn, spawnSync } from 'node:child_process'
import http from 'node:http'

const isWindows = process.platform === 'win32'
const pnpm = process.env.PNPM_BIN || 'pnpm'
const testPort = process.env.TEST_PORT || '3335'
const testEnv = {
  ...process.env,
  NODE_ENV: 'test',
  PORT: testPort,
  TEST_API_URL: `http://localhost:${testPort}`,
  DATABASE_URL: 'file:./test.db',
  JWT_SECRET: 'kairos-test-secret',
  TEST_PASSWORD_RESET_TOKEN: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  TEST_INVITE_TOKENS: 'deterministic',
}

const run = (args) => {
  const result = spawnSync(pnpm, args, {
    cwd: process.cwd(),
    env: testEnv,
    stdio: 'inherit',
  })
  if (result.error || result.status !== 0) {
    throw result.error ?? new Error(`Comando falhou: pnpm ${args.join(' ')}`)
  }
}

const waitForHealth = () =>
  new Promise((resolve, reject) => {
    const startedAt = Date.now()
    const check = () => {
        const request = http.get(`http://localhost:${testPort}/health`, (response) => {
        response.resume()
        if (response.statusCode === 200) return resolve()
        retry()
      })
      request.on('error', retry)
      request.setTimeout(1000, () => {
        request.destroy()
        retry()
      })
    }
    const retry = () => {
      if (Date.now() - startedAt > 30000) return reject(new Error('Servidor de testes não iniciou em 30 segundos'))
      setTimeout(check, 250)
    }
    check()
  })

const stop = (child) => {
  if (!child || child.killed) return
  if (isWindows) {
    spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
  } else {
    child.kill('SIGTERM')
  }
}

let server
try {
  run(['exec', 'prisma', 'db', 'push', '--force-reset'])
  server = spawn(pnpm, ['exec', 'tsx', 'src/server.ts'], {
    cwd: process.cwd(),
    env: testEnv,
    stdio: 'inherit',
  })
  await waitForHealth()
  const jest = spawn(pnpm, ['exec', 'jest', '--runInBand'], {
    cwd: process.cwd(),
    env: testEnv,
    stdio: 'inherit',
  })
  const exitCode = await new Promise((resolve, reject) => {
    jest.on('error', reject)
    jest.on('exit', (code, signal) => resolve(code ?? (signal ? 1 : 0)))
  })
  process.exitCode = exitCode
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  stop(server)
}
