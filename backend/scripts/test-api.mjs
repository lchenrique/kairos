import { spawn, spawnSync } from 'node:child_process'
import { generateKeyPairSync } from 'node:crypto'
import http from 'node:http'
import path from 'node:path'

const isWindows = process.platform === 'win32'
const testPort = process.env.TEST_PORT || '3335'

// Executa as ferramentas locais diretamente pelo Node, sem depender de um
// `pnpm exec` recursivo (que pode ser bloqueado por checagens de store no host).
const localBin = (relativePath) => path.resolve(process.cwd(), 'node_modules', relativePath)

// A fronteira externa do Clerk é substituída por um par de chaves de teste:
// o servidor recebe apenas a chave pública (CLERK_JWT_KEY) e continua rodando a
// verificação real do verifyToken; o Jest recebe a chave privada para assinar
// JWTs RS256 determinísticos.
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
const clerkPrivateKey = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
const clerkPublicKey = publicKey.export({ type: 'spki', format: 'pem' }).toString()

const testEnv = {
  ...process.env,
  NODE_ENV: 'test',
  PORT: testPort,
  TEST_API_URL: `http://localhost:${testPort}`,
  DATABASE_URL: 'file:./test.db',
  JWT_SECRET: 'kairos-test-secret',
  CLERK_JWT_KEY: clerkPublicKey,
  CLERK_TEST_PRIVATE_KEY: clerkPrivateKey,
  TEST_PASSWORD_RESET_TOKEN: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  TEST_INVITE_TOKENS: 'deterministic',
}

const runNode = (script, args) => {
  const result = spawnSync(process.execPath, [localBin(script), ...args], {
    cwd: process.cwd(),
    env: testEnv,
    stdio: 'inherit',
  })
  if (result.error || result.status !== 0) {
    throw result.error ?? new Error(`Comando falhou: node ${script} ${args.join(' ')}`)
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
  runNode('prisma/build/index.js', ['db', 'push', '--force-reset'])
  server = spawn(process.execPath, [localBin('tsx/dist/cli.mjs'), 'src/server.ts'], {
    cwd: process.cwd(),
    env: testEnv,
    stdio: 'inherit',
  })
  await waitForHealth()
  const jest = spawn(process.execPath, [localBin('jest/bin/jest.js'), '--runInBand'], {
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
