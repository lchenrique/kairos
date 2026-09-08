import { prisma } from '../lib/prisma.js'

const databaseUrl = process.env.DATABASE_URL ?? ''
if (process.env.NODE_ENV !== 'test' || !databaseUrl.includes('test.db')) {
  throw new Error(
    `Testes abortados por segurança. Use uma base isolada (DATABASE_URL=file:./test.db); recebido: ${databaseUrl || 'não definido'}`,
  )
}

// Aumenta o timeout dos testes para 10 segundos
const originalTimeout = 10000
beforeAll(() => {
  jest.setTimeout(originalTimeout)
})

// Limpa o banco de dados antes de todos os testes
beforeAll(async () => {
  // Desativa as foreign key constraints temporariamente
  await prisma.$executeRaw`PRAGMA foreign_keys = OFF;`

  // Limpa todas as tabelas na ordem correta
  await prisma.eventParticipant.deleteMany()
  await prisma.event.deleteMany()
  await prisma.attendanceHistory.deleteMany()
  await prisma.financeEntry.deleteMany()
  await prisma.memberGroup.deleteMany()
  await prisma.group.deleteMany()
  await prisma.member.deleteMany()
  await prisma.userInvite.deleteMany()
  await prisma.churchUser.deleteMany()
  await prisma.organizationUser.deleteMany()
  await prisma.user.deleteMany()
  await prisma.church.deleteMany()
  await prisma.organization.deleteMany()

  // Reativa as foreign key constraints
  await prisma.$executeRaw`PRAGMA foreign_keys = ON;`
})

afterAll(async () => {
  await prisma.$disconnect()
})
