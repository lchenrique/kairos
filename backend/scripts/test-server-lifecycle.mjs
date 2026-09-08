import assert from 'node:assert/strict'

process.env.NODE_ENV = 'test'
process.env.PORT = process.env.LIFECYCLE_TEST_PORT || '3336'
process.env.DATABASE_URL ||= 'file:./test.db'
process.env.JWT_SECRET ||= 'kairos-lifecycle-test-secret-with-32-characters'
process.env.FRONTEND_URL ||= 'http://localhost:3013'

const { app, handleShutdown, startServer } = await import('../dist/server.js')
const baseUrl = `http://localhost:${process.env.PORT}`

assert.equal(app.server.listening, false, 'importar server.js não deve abrir uma porta')

try {
  await startServer()
  assert.equal(app.server.listening, true, 'startServer deve abrir a porta configurada')

  const response = await fetch(`${baseUrl}/health`, {
    headers: { 'X-Request-Id': 'lifecycle-test' },
  })
  assert.equal(response.status, 200, 'health check deve responder 200')
  assert.equal(response.headers.get('x-request-id'), 'lifecycle-test')
  const health = await response.json()
  assert.equal(health.status, 'ok')
  assert.equal(health.database, 'ok')
  assert.ok(Number.isFinite(health.uptimeSeconds), 'health deve informar o uptime')
  assert.ok(!Number.isNaN(Date.parse(health.timestamp)), 'health deve informar um timestamp válido')
} finally {
  await handleShutdown('SIGTERM')
}

assert.equal(app.server.listening, false, 'stopServer deve fechar a porta')
