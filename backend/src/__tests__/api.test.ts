import { createHash, createPrivateKey, createSign } from 'node:crypto'
import axios from 'axios'
import { prisma } from '../lib/prisma.js'
import type { UserRole } from '../schemas/auth.js'

const baseURL = process.env.TEST_API_URL || 'http://localhost:3335'

const api = axios.create({
  baseURL,
  validateStatus: () => true,
  headers: { 'X-Kairos-Client': 'web' },
})

const privateKeyPem = process.env.CLERK_TEST_PRIVATE_KEY
if (!privateKeyPem) {
  throw new Error(
    'CLERK_TEST_PRIVATE_KEY ausente. Rode a suíte via pnpm test (scripts/test-api.mjs).',
  )
}
const clerkPrivateKey = createPrivateKey(privateKeyPem)

let userId: string
let memberId: string
let groupId: string
let eventId: string
let financeId: string
let firstChurchId: string
let secondChurchId: string
let secondChurchMemberId: string
let teamUserId: string

const adminIdentity = { sub: 'user_admin', email: 'test@example.com', name: 'Test User' }
const teamIdentity = { sub: 'user_team', email: 'team@example.com', name: 'Team User' }

function base64Url(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url')
}

let tokenSequence = 0

// Assina um JWT RS256 local aceito pelo CLERK_JWT_KEY de teste injetado pelo
// scripts/test-api.mjs. O servidor continua executando verifyToken de verdade;
// o teste controla apenas a chave que representa a fronteira externa do Clerk.
function signClerkToken(identity: { sub: string; email: string; name: string }) {
  const issuedAt = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT', kid: 'kairos-test-key' }
  const payload = {
    sub: identity.sub,
    email: identity.email,
    name: identity.name,
    sid: `session-${++tokenSequence}`,
    iat: issuedAt,
    nbf: issuedAt - 5,
    exp: issuedAt + 60 * 60,
  }
  const signingInput = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`
  const signature = createSign('RSA-SHA256').update(signingInput).sign(clerkPrivateKey)
  return `${signingInput}.${signature.toString('base64url')}`
}

function bearerFor(identity: { sub: string; email: string; name: string }) {
  return `Bearer ${signClerkToken(identity)}`
}

const inviteTokenFor = (email: string) =>
  createHash('sha256').update(`kairos-invite:${email}`).digest('hex')

async function createRoleClient(role: Exclude<UserRole, 'ADMIN'>) {
  const church = await prisma.church.findUniqueOrThrow({
    where: { id: firstChurchId },
    select: { organizationId: true },
  })
  const email = `${role.toLowerCase()}-matrix@example.com`
  const name = `${role} Matrix`
  const sub = `user_${role.toLowerCase()}_matrix`
  await prisma.user.create({
    data: {
      clerkUserId: sub,
      name,
      email,
      // O Clerk é dono da credencial; a coluna legada fica deliberadamente inutilizável.
      password: 'CLERK_MANAGED',
      // Deliberadamente diferente para provar que o papel da Rede é a fonte de verdade.
      role: 'USER',
      organizations: {
        create: {
          organizationId: church.organizationId,
          role,
          defaultChurchId: firstChurchId,
        },
      },
      churches: { create: { churchId: firstChurchId, role } },
    },
  })

  return axios.create({
    baseURL,
    validateStatus: () => true,
    headers: {
      Authorization: bearerFor({ sub, email, name }),
      'X-Kairos-Client': 'web',
      'X-Church-Id': firstChurchId,
    },
  })
}

beforeAll(async () => {
  const organization = await prisma.organization.create({
    data: { name: 'Test Network', slug: 'test-network' },
  })
  const church = await prisma.church.create({
    data: {
      organizationId: organization.id,
      name: 'Test Church',
      slug: 'sede',
      isHeadquarters: true,
    },
  })
  firstChurchId = church.id

  const admin = await prisma.user.create({
    data: {
      clerkUserId: adminIdentity.sub,
      name: adminIdentity.name,
      email: adminIdentity.email,
      password: 'CLERK_MANAGED',
      role: 'ADMIN',
      organizations: {
        create: { organizationId: organization.id, role: 'ADMIN', defaultChurchId: church.id },
      },
      churches: { create: { churchId: church.id, role: 'ADMIN' } },
    },
  })
  userId = admin.id

  await prisma.subscription.create({
    data: { organizationId: organization.id, plan: 'COMMUNITY', status: 'ACTIVE' },
  })

  api.defaults.headers.common.Authorization = bearerFor(adminIdentity)
  api.defaults.headers.common['X-Church-Id'] = church.id
})

describe('Health Routes', () => {
  test('GET /health - should report API and database status', async () => {
    const response = await api.get('/health', {
      headers: { 'X-Request-Id': 'health-api-test' },
    })

    expect(response.status).toBe(200)
    expect(response.data).toMatchObject({ status: 'ok', database: 'ok' })
    expect(response.headers['x-request-id']).toBe('health-api-test')
  })
})

// Testes de Autenticação
describe('Auth Routes', () => {
  test('GET /auth/setup/status - tenant setup is replaced by Clerk onboarding', async () => {
    const response = await api.get('/auth/setup/status')

    expect(response.status).toBe(200)
    expect(response.data).toEqual({ available: false })
  })

  test('POST /auth/setup - is closed and points to Clerk activation', async () => {
    const response = await api.post('/auth/setup', {
      organizationName: 'Test Network',
      churchName: 'Test Church',
      adminName: 'Test User',
      email: 'test@example.com',
      password: '12345678',
    })

    expect(response.status).toBe(410)
    expect(response.data).toHaveProperty('code', 'TENANT_SETUP_REPLACED')
    // A projeção local do tenant nasce do seed/ativação, não do setup legado.
    expect(await prisma.organization.count()).toBe(1)
    expect(await prisma.user.count()).toBe(1)
  })

  test('POST /auth/login - password login is disabled in favor of Clerk', async () => {
    const response = await api.post('/auth/login', {
      email: 'test@example.com',
      password: '12345678',
    })

    expect(response.status).toBe(410)
    expect(response.data).toHaveProperty('code', 'CLERK_REQUIRED')
  })

  test('GET /auth/profile - resolves the local projection from a Clerk bearer token', async () => {
    const response = await api.get('/auth/profile')

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('id', userId)
  })

  test('requests without a bearer token are rejected with 401', async () => {
    const anonymous = axios.create({
      baseURL,
      validateStatus: () => true,
      headers: { 'X-Kairos-Client': 'web' },
    })
    const response = await anonymous.get('/auth/profile')

    expect(response.status).toBe(401)
    expect(response.data).toHaveProperty('code', 'INVALID_OR_EXPIRED_SESSION')
  })

  test('an invalid bearer token is rejected with 401', async () => {
    const response = await api.get('/auth/profile', {
      headers: { Authorization: 'Bearer not-a-valid-clerk-jwt' },
    })

    expect(response.status).toBe(401)
    expect(response.data).toHaveProperty('code', 'INVALID_OR_EXPIRED_SESSION')
  })

  test('cookie-based mutations still require the CSRF request header', async () => {
    const untrustedClient = axios.create({
      baseURL,
      validateStatus: () => true,
    })
    const response = await untrustedClient.post(
      '/auth/invites',
      { name: 'Blocked Invite', email: 'blocked@example.com', role: 'USER' },
      { headers: { Cookie: 'token=legacy-cookie-value' } },
    )

    expect(response.status).toBe(403)
    expect(response.data).toHaveProperty('code', 'CSRF_HEADER_REQUIRED')
  })

  test('CORS should allow the tenant and CSRF headers from the frontend', async () => {
    const response = await api.options('/members', {
      headers: {
        Origin: 'http://localhost:3001',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'x-church-id,x-kairos-client',
      },
    })

    expect(response.status).toBe(204)
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3001')
    expect(response.headers['access-control-allow-headers'].toLowerCase()).toContain('x-church-id')
    expect(response.headers['access-control-allow-headers'].toLowerCase()).toContain(
      'x-kairos-client',
    )
  })

  test('team invitation should be auditable and never expose the raw token', async () => {
    const response = await api.post('/auth/invites', {
      name: 'Team User',
      email: 'team@example.com',
      role: 'SECRETARY',
    })

    expect(response.status).toBe(201)
    expect(response.data).toMatchObject({
      name: 'Team User',
      email: 'team@example.com',
      role: 'SECRETARY',
      status: 'PENDING',
    })
    expect(response.data).not.toHaveProperty('token')

    const rawToken = inviteTokenFor('team@example.com')
    const persisted = await prisma.userInvite.findUniqueOrThrow({
      where: { id: response.data.id },
    })
    expect(persisted.tokenHash).toBe(createHash('sha256').update(rawToken).digest('hex'))
    expect(persisted.tokenHash).not.toBe(rawToken)
    expect(persisted.invitedById).toBe(userId)
    expect(persisted.expiresAt.getTime()).toBeGreaterThan(Date.now())

    const invites = await api.get('/auth/invites')
    expect(invites.status).toBe(200)
    expect(invites.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: 'team@example.com', status: 'PENDING' }),
      ]),
    )
  })

  test('invite acceptance should reject expired tokens', async () => {
    const response = await api.post('/auth/invites', {
      name: 'Expired User',
      email: 'expired@example.com',
      role: 'USER',
    })
    expect(response.status).toBe(201)
    await prisma.userInvite.update({
      where: { id: response.data.id },
      data: { expiresAt: new Date(Date.now() - 1000) },
    })

    const expired = await api.post(
      '/auth/invites/accept',
      {
        token: inviteTokenFor('expired@example.com'),
        password: 'TeamPassword123',
      },
      {
        headers: {
          Authorization: bearerFor({
            sub: 'user_expired',
            email: 'expired@example.com',
            name: 'Expired User',
          }),
        },
      },
    )
    expect(expired.status).toBe(400)
    expect(expired.data).toHaveProperty('code', 'INVALID_INVITE')
  })

  test('an invited person with a Clerk session activates the same e-mail and uses the invite once', async () => {
    const rawToken = inviteTokenFor('team@example.com')
    const teamAuth = { Authorization: bearerFor(teamIdentity) }
    const accepted = await api.post(
      '/auth/invites/accept',
      { token: rawToken, password: 'TeamPassword123' },
      { headers: teamAuth },
    )
    expect(accepted.status).toBe(201)
    expect(accepted.data).toMatchObject({
      email: 'team@example.com',
      role: 'SECRETARY',
      status: 'ACTIVE',
    })
    teamUserId = accepted.data.id

    const reused = await api.post(
      '/auth/invites/accept',
      { token: rawToken, password: 'AnotherPassword123' },
      { headers: teamAuth },
    )
    expect(reused.status).toBe(400)

    const users = await api.get('/auth/users')
    expect(users.status).toBe(200)
    expect(users.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: 'team@example.com', status: 'ACTIVE' }),
      ]),
    )
  })

  test('invite acceptance requires a Clerk session', async () => {
    const invitation = await api.post('/auth/invites', {
      name: 'No Session User',
      email: 'no-session@example.com',
      role: 'USER',
    })
    expect(invitation.status).toBe(201)

    const anonymous = axios.create({
      baseURL,
      validateStatus: () => true,
      headers: { 'X-Kairos-Client': 'web' },
    })
    const response = await anonymous.post('/auth/invites/accept', {
      token: inviteTokenFor('no-session@example.com'),
      password: 'TeamPassword123',
    })
    expect(response.status).toBe(401)
    expect(response.data).toHaveProperty('code', 'CLERK_SESSION_REQUIRED')
  })

  test('invite acceptance rejects a Clerk identity with a different e-mail', async () => {
    const invitation = await api.post('/auth/invites', {
      name: 'Mismatch User',
      email: 'expected@example.com',
      role: 'USER',
    })
    expect(invitation.status).toBe(201)

    const response = await api.post(
      '/auth/invites/accept',
      { token: inviteTokenFor('expected@example.com'), password: 'TeamPassword123' },
      {
        headers: {
          Authorization: bearerFor({
            sub: 'user_mismatch',
            email: 'other@example.com',
            name: 'Other User',
          }),
        },
      },
    )
    expect(response.status).toBe(400)
    expect(response.data).toHaveProperty('code', 'INVITE_EMAIL_MISMATCH')
  })

  test('non-admin team member should not manage users or invitations', async () => {
    const teamApi = axios.create({
      baseURL,
      validateStatus: () => true,
      headers: {
        Authorization: bearerFor(teamIdentity),
        'X-Kairos-Client': 'web',
        'X-Church-Id': firstChurchId,
      },
    })

    const responses = await Promise.all([
      teamApi.get('/auth/users'),
      teamApi.get('/auth/invites'),
      teamApi.post('/auth/invites', {
        name: 'Unauthorized Invite',
        email: 'unauthorized@example.com',
        role: 'USER',
      }),
      teamApi.patch(`/auth/users/${userId}/role`, { role: 'USER' }),
      teamApi.patch(`/auth/users/${userId}/status`, { status: 'SUSPENDED' }),
      teamApi.delete(`/auth/users/${userId}`),
      teamApi.delete('/auth/invites/does-not-exist'),
    ])

    expect(responses.map((response) => response.status)).toEqual([
      403, 403, 403, 403, 403, 403, 403,
    ])
  })

  test('admin should revoke a pending invitation', async () => {
    const response = await api.post('/auth/invites', {
      name: 'Revoked User',
      email: 'revoked@example.com',
      role: 'USER',
    })
    expect(response.status).toBe(201)

    const revoked = await api.delete(`/auth/invites/${response.data.id}`)
    expect(revoked.status).toBe(204)

    const acceptance = await api.post('/auth/invites/accept', {
      token: inviteTokenFor('revoked@example.com'),
      password: 'TeamPassword123',
    })
    expect(acceptance.status).toBe(400)
  })

  test('network should always preserve one active administrator', async () => {
    const demote = await api.patch(`/auth/users/${userId}/role`, { role: 'USER' })
    expect(demote.status).toBe(400)
    expect(demote.data).toHaveProperty('code', 'LAST_ACTIVE_ADMIN')

    const suspend = await api.patch(`/auth/users/${userId}/status`, { status: 'SUSPENDED' })
    expect(suspend.status).toBe(400)
    expect(suspend.data).toHaveProperty('code', 'LAST_ACTIVE_ADMIN')

    const revoke = await api.delete(`/auth/users/${userId}`)
    expect(revoke.status).toBe(400)
    expect(revoke.data).toHaveProperty('code', 'LAST_ACTIVE_ADMIN')
  })

  test('admin should suspend and reactivate team access immediately', async () => {
    const suspended = await api.patch(`/auth/users/${teamUserId}/status`, {
      status: 'SUSPENDED',
    })
    expect(suspended.status).toBe(200)
    expect(suspended.data).toHaveProperty('status', 'SUSPENDED')

    // Sem vínculo ACTIVE, o Clerk ainda autentica, mas o tenant é negado.
    const denied = await api.get('/system/context', {
      headers: { Authorization: bearerFor(teamIdentity) },
    })
    expect(denied.status).toBe(403)
    expect(denied.data).toHaveProperty('code', 'ORGANIZATION_REQUIRED')

    const reactivated = await api.patch(`/auth/users/${teamUserId}/status`, {
      status: 'ACTIVE',
    })
    expect(reactivated.status).toBe(200)
    expect(reactivated.data).toHaveProperty('status', 'ACTIVE')

    const restored = await api.get('/system/context', {
      headers: { Authorization: bearerFor(teamIdentity) },
    })
    expect(restored.status).toBe(200)
  })

  test('admin should revoke team access without deleting the global user', async () => {
    const tempIdentity = {
      sub: 'user_temporary',
      email: 'temporary@example.com',
      name: 'Temporary Access',
    }
    const invitation = await api.post('/auth/invites', {
      name: 'Temporary Access',
      email: 'temporary@example.com',
      role: 'USER',
    })
    expect(invitation.status).toBe(201)

    const accepted = await api.post(
      '/auth/invites/accept',
      { token: inviteTokenFor('temporary@example.com'), password: 'TemporaryPassword123' },
      { headers: { Authorization: bearerFor(tempIdentity) } },
    )
    expect(accepted.status).toBe(201)

    const revoked = await api.delete(`/auth/users/${accepted.data.id}`)
    expect(revoked.status).toBe(204)

    const denied = await api.get('/system/context', {
      headers: { Authorization: bearerFor(tempIdentity) },
    })
    expect(denied.status).toBe(403)
    expect(await prisma.user.count({ where: { id: accepted.data.id } })).toBe(1)
    expect(
      await prisma.organizationUser.count({
        where: { userId: accepted.data.id },
      }),
    ).toBe(0)
  })

  test('password management routes are delegated to Clerk and return 410', async () => {
    const resetRequest = await api.post('/auth/password/reset-request', {
      email: 'test@example.com',
    })
    const reset = await api.post('/auth/password/reset', {
      token: '0123456789abcdef0123456789abcdef',
      password: 'Recovered123',
    })
    const change = await api.put('/auth/password/change', {
      currentPassword: 'Recovered123',
      newPassword: 'Changed123',
    })

    for (const response of [resetRequest, reset, change]) {
      expect(response.status).toBe(410)
      expect(response.data).toHaveProperty('code', 'CLERK_REQUIRED')
    }
  })

  test('POST /auth/logout - acknowledges the client-side Clerk sign-out', async () => {
    const response = await api.post('/auth/logout', {})
    expect(response.status).toBe(204)

    // O Clerk é dono da sessão; o endpoint local não revoga o bearer emitido.
    const stillAuthenticated = await api.get('/auth/profile')
    expect(stillAuthenticated.status).toBe(200)
  })
})

// Testes do Sistema
describe('System Routes', () => {
  test('GET /system/info - should get system info', async () => {
    const response = await api.get('/system/info')

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('version')
  })

  test('PUT /system/church - should update church settings', async () => {
    const response = await api.put('/system/church', {
      name: 'Test Church',
      address: 'Test Address',
      phone: '1234567890',
      email: 'church@example.com',
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('name', 'Test Church')
  })

  test('GET /system/context - should expose the organization and accessible churches', async () => {
    const response = await api.get('/system/context')

    expect(response.status).toBe(200)
    expect(response.data.organization).toHaveProperty('id')
    expect(response.data.churches).toHaveLength(1)
    firstChurchId = response.data.churches[0].id
    api.defaults.headers.common['X-Church-Id'] = firstChurchId
  })

  test('POST /system/churches - should add another church to the same organization', async () => {
    const response = await api.post('/system/churches', {
      name: 'Congregação Norte',
      address: 'Rua Norte, 100',
    })

    expect(response.status).toBe(201)
    expect(response.data).toMatchObject({ name: 'Congregação Norte', isHeadquarters: false })
    secondChurchId = response.data.id

    const context = await api.get('/system/context')
    expect(context.data.churches).toHaveLength(2)
  })

  test('tenant guard should reject a church from another organization', async () => {
    const externalOrganization = await prisma.organization.create({
      data: {
        name: 'Outra Rede',
        slug: 'outra-rede',
        churches: { create: { name: 'Unidade externa', slug: 'sede', isHeadquarters: true } },
      },
      include: { churches: true },
    })

    const response = await api.get('/members', {
      headers: { 'X-Church-Id': externalOrganization.churches[0].id },
    })
    expect(response.status).toBe(403)
    expect(response.data).toHaveProperty('code', 'CHURCH_ACCESS_DENIED')

    await prisma.church.deleteMany({ where: { organizationId: externalOrganization.id } })
    await prisma.organization.delete({ where: { id: externalOrganization.id } })
  })

  test('a restricted team user should not access an unassigned church', async () => {
    const response = await api.get('/members', {
      headers: {
        Authorization: bearerFor(teamIdentity),
        'X-Church-Id': secondChurchId,
      },
    })
    expect(response.status).toBe(403)
    expect(response.data).toHaveProperty('code', 'CHURCH_ACCESS_DENIED')
  })

  test('GET /reports/overview - should return real management indicators', async () => {
    const response = await api.get('/reports/overview')

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('membersTotal')
    expect(response.data).toHaveProperty('attendance.rate')
    expect(response.data.period).toMatchObject({ key: '90d' })
  })

  test('GET /reports/overview - should filter event indicators by period', async () => {
    const recent = await prisma.event.create({
      data: {
        churchId: firstChurchId,
        title: 'Evento recente do relatório',
        type: 'OTHER',
        startDate: new Date(),
      },
    })
    const old = await prisma.event.create({
      data: {
        churchId: firstChurchId,
        title: 'Evento antigo do relatório',
        type: 'OTHER',
        startDate: new Date('2020-01-01T12:00:00.000Z'),
      },
    })

    const recentPeriod = await api.get('/reports/overview?period=30d')
    const allPeriod = await api.get('/reports/overview?period=all')

    expect(recentPeriod.status).toBe(200)
    expect(recentPeriod.data.period).toMatchObject({ key: '30d' })
    expect(recentPeriod.data.period.from).toBeTruthy()
    expect(allPeriod.status).toBe(200)
    expect(allPeriod.data.period).toEqual({ key: 'all', from: null, to: null })
    expect(allPeriod.data.eventsTotal).toBe(recentPeriod.data.eventsTotal + 1)

    await prisma.event.deleteMany({ where: { id: { in: [recent.id, old.id] } } })
  })
})

describe('Finance Routes', () => {
  test('POST /finance - should create a finance entry', async () => {
    const response = await api.post('/finance', {
      type: 'INCOME',
      category: 'Dízimos',
      description: 'Culto de domingo',
      amountCents: 12500,
      occurredAt: '2030-06-15T12:00:00.000Z',
      paymentMethod: 'PIX',
    })

    expect(response.status).toBe(201)
    expect(response.data).toHaveProperty('amountCents', 12500)
    expect(response.data).toMatchObject({ createdById: userId, createdByName: 'Test User' })
    financeId = response.data.id
  })

  test('GET /finance - should return entries and summary', async () => {
    const response = await api.get('/finance')

    expect(response.status).toBe(200)
    expect(response.data.data).toHaveLength(1)
    expect(response.data.summary.incomeCents).toBe(12500)
    expect(response.data.categories).toContain('Dízimos')
  })

  test('PUT /finance/:id - should record who changed the entry', async () => {
    const response = await api.put(`/finance/${financeId}`, {
      category: 'Ofertas',
      description: 'Oferta do culto de domingo',
    })

    expect(response.status).toBe(200)
    expect(response.data).toMatchObject({
      category: 'Ofertas',
      updatedById: userId,
      updatedByName: 'Test User',
    })
  })
})

describe('Upload Routes', () => {
  test('POST /uploads - should reject unsupported files before calling storage', async () => {
    const form = new FormData()
    form.append('file', new Blob(['not-an-image'], { type: 'text/plain' }), 'avatar.txt')

    const response = await api.post('/uploads', form)

    expect(response.status).toBe(400)
    expect(response.data).toHaveProperty('code', 'INVALID_IMAGE_TYPE')
  })

  test('POST /uploads - should explain when image storage is not configured', async () => {
    const form = new FormData()
    form.append('file', new Blob(['small-image'], { type: 'image/png' }), 'avatar.png')

    const response = await api.post('/uploads', form)

    expect(response.status).toBe(503)
    expect(response.data).toHaveProperty('code', 'IMAGE_STORAGE_UNAVAILABLE')
  })

  test('POST /uploads - should reject images larger than 5 MB', async () => {
    const form = new FormData()
    form.append(
      'file',
      new Blob([new Uint8Array(5 * 1024 * 1024 + 1)], { type: 'image/png' }),
      'large.png',
    )

    const response = await api.post('/uploads', form)

    expect(response.status).toBe(413)
    expect(response.data).toHaveProperty('code', 'IMAGE_TOO_LARGE')
  })

  test('DELETE /uploads/:publicId - should reject an image outside the current tenant', async () => {
    const response = await api.delete(
      `/uploads/${encodeURIComponent('kairos/another-network/image')}`,
    )

    expect(response.status).toBe(400)
    expect(response.data).toHaveProperty('code', 'INVALID_IMAGE_ID')
  })
})

// Testes de Membros
describe('Member Routes', () => {
  test('POST /members - should create a new member', async () => {
    const response = await api.post('/members', {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      birthDate: '1990-01-01',
      status: 'ACTIVE',
    })

    expect(response.status).toBe(201)
    expect(response.data).toHaveProperty('id')
    memberId = response.data.id
  })

  test('church scope should isolate member reads and consolidated listings', async () => {
    const created = await api.post(
      '/members',
      { name: 'Member Second Church', status: 'ACTIVE' },
      { headers: { 'X-Church-Id': secondChurchId } },
    )
    expect(created.status).toBe(201)
    secondChurchMemberId = created.data.id

    const hiddenFromSecond = await api.get(`/members/${memberId}`, {
      headers: { 'X-Church-Id': secondChurchId },
    })
    expect(hiddenFromSecond.status).toBe(404)

    const hiddenFromFirst = await api.get(`/members/${secondChurchMemberId}`, {
      headers: { 'X-Church-Id': firstChurchId },
    })
    expect(hiddenFromFirst.status).toBe(404)

    const consolidated = await api.get('/members', { headers: { 'X-Church-Id': 'all' } })
    expect(consolidated.status).toBe(200)
    expect(consolidated.data.meta.totalItems).toBe(2)
  })

  test('GET /members - should list members', async () => {
    const response = await api.get('/members')

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('data')
    expect(response.data).toHaveProperty('meta')
  })

  test('GET /members/:id - should get member by id', async () => {
    const response = await api.get(`/members/${memberId}`)

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('id', memberId)
  })

  test('PUT /members/:id - should update member', async () => {
    const response = await api.put(`/members/${memberId}`, {
      name: 'John Doe Updated',
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('name', 'John Doe Updated')
  })
})

// Testes de Grupos
describe('Group Routes', () => {
  test('POST /groups - should create a new group', async () => {
    const response = await api.post('/groups', {
      name: 'Test Group',
      type: 'CELL',
      description: 'Test Description',
      meetingDay: 'MONDAY',
      startTime: '19:00',
      endTime: '21:00',
      location: 'Test Location',
    })

    expect(response.status).toBe(201)
    expect(response.data).toHaveProperty('id')
    groupId = response.data.id
  })

  test('GET /groups - should list groups', async () => {
    const response = await api.get('/groups')

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('data')
    expect(response.data).toHaveProperty('meta')
  })

  test('GET /groups/:id - should return members with normalized avatar field', async () => {
    const response = await api.get(`/groups/${groupId}`)

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('members')
  })

  test('GET /groups/:id - should return a safe 404 for an unknown group', async () => {
    const response = await api.get('/groups/does-not-exist')

    expect(response.status).toBe(404)
    expect(response.data).toEqual({
      statusCode: 404,
      error: 'Not Found',
      code: 'GROUP_NOT_FOUND',
      message: 'Grupo não encontrado',
    })
    expect(JSON.stringify(response.data)).not.toContain('P2025')
  })

  test('POST /groups/:id/members - should add member to group', async () => {
    const response = await api.post(`/groups/${groupId}/members`, {
      memberId,
      role: 'MEMBER',
    })

    expect(response.status).toBe(201)
  })

  test('DELETE /groups/:id/members/:memberId - should remove member from group', async () => {
    const response = await api.delete(`/groups/${groupId}/members/${memberId}`)

    expect(response.status).toBe(204)
  })
})

// Testes de Eventos
describe('Event Routes', () => {
  test('POST /events - should reject a participant from another church', async () => {
    const response = await api.post('/events', {
      title: 'Evento com participante inválido',
      startDate: '2030-06-15T19:00:00.000Z',
      type: 'SERVICE',
      participants: [secondChurchMemberId],
    })

    expect(response.status).toBe(400)
    expect(response.data).toHaveProperty('code', 'MEMBER_OUTSIDE_CHURCH')
  })

  test('POST /events - should create an event with participants', async () => {
    const response = await api.post('/events', {
      title: 'Culto de celebração',
      description: 'Encontro semanal da comunidade',
      startDate: '2030-06-15T19:00:00.000Z',
      endDate: '2030-06-15T21:00:00.000Z',
      type: 'SERVICE',
      location: 'Auditório principal',
      participants: [memberId],
      recurrenceRule: 'WEEKLY',
      recurrenceEndDate: '2030-08-15T19:00:00.000Z',
      recurrenceExceptions: ['2030-06-22T19:00:00.000Z'],
    })

    expect(response.status).toBe(201)
    expect(response.data).toHaveProperty('id')
    expect(response.data.participants).toHaveLength(1)
    expect(response.data).toMatchObject({
      recurrenceRule: 'WEEKLY',
      recurrenceEndDate: '2030-08-15T19:00:00.000Z',
      recurrenceExceptions: ['2030-06-22T19:00:00.000Z'],
    })
    eventId = response.data.id
  })

  test('GET /events - should list events', async () => {
    const response = await api.get('/events')

    expect(response.status).toBe(200)
    expect(response.data.meta.totalItems).toBeGreaterThanOrEqual(1)
  })

  test('PATCH /events/:eventId/participants/:memberId/status - should update attendance', async () => {
    const response = await api.patch(`/events/${eventId}/participants/${memberId}/status`, {
      status: 'CONFIRMED',
    })

    expect(response.status).toBe(200)
    expect(response.data.status).toBe('CONFIRMED')
  })

  test('GET /members/:id/participation - should expose attendance history', async () => {
    const response = await api.get(`/members/${memberId}/participation`)

    expect(response.status).toBe(200)
    expect(response.data[0]).toHaveProperty('status', 'CONFIRMED')
    expect(response.data[0]).toHaveProperty('changes', 2)
  })

  test('PUT /events/:id - should update the event', async () => {
    const response = await api.put(`/events/${eventId}`, {
      title: 'Culto de celebração atualizado',
    })

    expect(response.status).toBe(200)
    expect(response.data.title).toBe('Culto de celebração atualizado')
  })
})

describe('Role permission matrix', () => {
  test('should enforce every approved role at resource and mutation boundaries', async () => {
    const linkedMember = await api.post(`/groups/${groupId}/members`, {
      memberId,
      role: 'MEMBER',
    })
    expect(linkedMember.status).toBe(201)

    const [pastorApi, secretaryApi, leaderApi, userApi] = await Promise.all([
      createRoleClient('PASTOR'),
      createRoleClient('SECRETARY'),
      createRoleClient('LEADER'),
      createRoleClient('USER'),
    ])

    const profiles = await Promise.all([
      pastorApi.get('/auth/profile'),
      secretaryApi.get('/auth/profile'),
      leaderApi.get('/auth/profile'),
      userApi.get('/auth/profile'),
    ])
    expect(profiles.map((response) => response.data.role)).toEqual([
      'PASTOR',
      'SECRETARY',
      'LEADER',
      'USER',
    ])

    const statusesFor = async (client: typeof pastorApi, paths: string[]) =>
      Promise.all(paths.map(async (path) => (await client.get(path)).status))

    expect(
      await statusesFor(pastorApi, [
        '/dashboard/overview',
        '/members',
        '/groups',
        '/events',
        '/reports/overview',
        '/finance',
        '/system/church',
        '/system/context',
      ]),
    ).toEqual([200, 200, 200, 200, 200, 200, 200, 200])
    expect(await statusesFor(pastorApi, ['/auth/users', '/system/info'])).toEqual([403, 403])
    expect(
      (
        await pastorApi.post('/finance', {
          type: 'INCOME',
          category: 'Restrito',
          description: 'Pastor não altera financeiro',
          amountCents: 100,
          occurredAt: '2030-06-15T12:00:00.000Z',
        })
      ).status,
    ).toBe(403)

    expect(
      await statusesFor(secretaryApi, [
        '/dashboard/overview',
        '/members',
        '/groups',
        '/events',
        '/system/context',
      ]),
    ).toEqual([200, 200, 200, 200, 200])
    expect(
      await statusesFor(secretaryApi, [
        '/reports/overview',
        '/finance',
        '/system/church',
        '/system/info',
        '/auth/users',
      ]),
    ).toEqual([403, 403, 403, 403, 403])

    const secretaryMember = await secretaryApi.post('/members', {
      name: 'Cadastro da Secretaria',
      status: 'ACTIVE',
    })
    const secretaryGroup = await secretaryApi.post('/groups', {
      name: 'Grupo da Secretaria',
      type: 'OTHER',
      meetingDay: 'TUESDAY',
      startTime: '08:00',
      endTime: '09:00',
      location: 'Sala da Secretaria',
    })
    const secretaryEvent = await secretaryApi.post('/events', {
      title: 'Evento da Secretaria',
      type: 'OTHER',
      startDate: '2030-07-15T19:00:00.000Z',
    })
    expect([secretaryMember.status, secretaryGroup.status, secretaryEvent.status]).toEqual([
      201, 201, 201,
    ])
    expect((await secretaryApi.delete(`/events/${secretaryEvent.data.id}`)).status).toBe(204)
    expect((await secretaryApi.delete(`/groups/${secretaryGroup.data.id}`)).status).toBe(204)
    expect((await secretaryApi.delete(`/members/${secretaryMember.data.id}`)).status).toBe(204)

    expect(await statusesFor(leaderApi, ['/groups', '/events', '/system/context'])).toEqual([
      200, 200, 200,
    ])
    expect(
      await statusesFor(leaderApi, [
        '/dashboard/overview',
        '/members',
        '/reports/overview',
        '/finance',
        '/system/church',
        '/system/info',
        '/auth/users',
      ]),
    ).toEqual([403, 403, 403, 403, 403, 403, 403])
    const leaderGroup = await leaderApi.get(`/groups/${groupId}`)
    const leaderEvent = await leaderApi.get(`/events/${eventId}`)
    expect(leaderGroup.status).toBe(200)
    expect(leaderGroup.data.members).toEqual([])
    expect(leaderEvent.status).toBe(200)
    expect(leaderEvent.data.participants).toEqual([])
    expect(
      (
        await leaderApi.post('/groups', {
          name: 'Grupo não autorizado',
          type: 'OTHER',
        })
      ).status,
    ).toBe(403)
    expect(
      (
        await leaderApi.patch(`/events/${eventId}/participants/${memberId}/status`, {
          status: 'CONFIRMED',
        })
      ).status,
    ).toBe(403)

    expect(await statusesFor(userApi, ['/events', '/system/context'])).toEqual([200, 200])
    expect(
      await statusesFor(userApi, [
        '/dashboard/overview',
        '/members',
        '/groups',
        '/reports/overview',
        '/finance',
        '/system/church',
        '/system/info',
        '/auth/users',
      ]),
    ).toEqual([403, 403, 403, 403, 403, 403, 403, 403])
    const userEvent = await userApi.get(`/events/${eventId}`)
    expect(userEvent.status).toBe(200)
    expect(userEvent.data.participants).toEqual([])
    expect(
      (
        await userApi.post('/events', {
          title: 'Evento não autorizado',
          type: 'OTHER',
          startDate: '2030-07-15T19:00:00.000Z',
        })
      ).status,
    ).toBe(403)
  })
})

// Testes de Limpeza
describe('Cleanup', () => {
  test('DELETE /members/:id - should delete second church member in its own scope', async () => {
    const response = await api.delete(`/members/${secondChurchMemberId}`, {
      headers: { 'X-Church-Id': secondChurchId },
    })
    expect(response.status).toBe(204)
  })

  test('DELETE /finance/:id - should delete a finance entry', async () => {
    const response = await api.delete(`/finance/${financeId}`)

    expect(response.status).toBe(204)
    const persisted = await prisma.financeEntry.findUnique({ where: { id: financeId } })
    expect(persisted).toMatchObject({ deletedById: userId, deletedByName: 'Test User' })
    expect(persisted?.deletedAt).toBeInstanceOf(Date)

    const activeEntries = await api.get('/finance')
    expect(activeEntries.data.data).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: financeId })]),
    )
  })

  test('DELETE /events/:id - should delete event', async () => {
    const response = await api.delete(`/events/${eventId}`)

    expect(response.status).toBe(204)
  })

  test('DELETE /groups/:id - should delete group', async () => {
    const response = await api.delete(`/groups/${groupId}`)

    expect(response.status).toBe(204)
  })

  test('DELETE /groups/:id - should return a safe 404 for an unknown group', async () => {
    const response = await api.delete('/groups/does-not-exist')

    expect(response.status).toBe(404)
    expect(response.data).toEqual({
      statusCode: 404,
      error: 'Not Found',
      code: 'GROUP_NOT_FOUND',
      message: 'Grupo não encontrado',
    })
    expect(JSON.stringify(response.data)).not.toContain('P2025')
  })

  test('DELETE /members/:id - should delete member', async () => {
    const response = await api.delete(`/members/${memberId}`)

    expect(response.status).toBe(204)
  })
})
