import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3333',
  validateStatus: () => true
})

let token: string
let userId: string
let memberId: string
let groupId: string

// Configura o token para todas as requisições após o login
const setupToken = (newToken: string) => {
  token = newToken
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Testes de Autenticação
describe('Auth Routes', () => {
  test('POST /auth/register - should register a new user', async () => {
    const response = await api.post('/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: '123456'
    })

    expect(response.status).toBe(201)
    expect(response.data).toHaveProperty('token')
    expect(response.data).toHaveProperty('user')
    expect(response.data.user).toHaveProperty('id')

    setupToken(response.data.token)
    userId = response.data.user.id
  })

  test('POST /auth/login - should authenticate user', async () => {
    const response = await api.post('/auth/login', {
      email: 'test@example.com',
      password: '123456'
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('token')
    expect(response.data).toHaveProperty('user')
    
    setupToken(response.data.token)
  })

  test('GET /auth/profile - should get user profile', async () => {
    const response = await api.get('/auth/profile')

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('id', userId)
  })

  test('PUT /auth/password/change - should change password', async () => {
    const response = await api.put('/auth/password/change', {
      currentPassword: '123456',
      newPassword: '1234567'
    })

    expect(response.status).toBe(204)
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
      email: 'church@example.com'
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('name', 'Test Church')
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
      status: 'ACTIVE'
    })

    expect(response.status).toBe(201)
    expect(response.data).toHaveProperty('id')
    memberId = response.data.id
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
      name: 'John Doe Updated'
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
      location: 'Test Location'
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

  test('POST /groups/:id/members - should add member to group', async () => {
    const response = await api.post(`/groups/${groupId}/members`, {
      memberId,
      role: 'MEMBER'
    })

    expect(response.status).toBe(201)
  })

  test('DELETE /groups/:id/members/:memberId - should remove member from group', async () => {
    const response = await api.delete(`/groups/${groupId}/members/${memberId}`)

    expect(response.status).toBe(204)
  })
})

// Testes de Limpeza
describe('Cleanup', () => {
  test('DELETE /groups/:id - should delete group', async () => {
    const response = await api.delete(`/groups/${groupId}`)

    expect(response.status).toBe(204)
  })

  test('DELETE /members/:id - should delete member', async () => {
    const response = await api.delete(`/members/${memberId}`)

    expect(response.status).toBe(204)
  })
})
