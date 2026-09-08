import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const password = 'Kairos@2026!'
const adminEmail = 'admin@kairos.local'
const now = new Date()
const nextSunday = new Date(now)
nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7))
nextSunday.setHours(10, 0, 0, 0)

const members = [
  {
    id: 'demo-member-ana',
    name: 'Ana Carolina Souza',
    email: 'ana.souza@demo.kairos.local',
    phone: '(11) 98888-1001',
    birthDate: new Date('1991-05-12'),
  },
  {
    id: 'demo-member-bruno',
    name: 'Bruno Oliveira',
    email: 'bruno.oliveira@demo.kairos.local',
    phone: '(11) 98888-1002',
    birthDate: new Date('1986-08-23'),
  },
  {
    id: 'demo-member-carla',
    name: 'Carla Mendes',
    email: 'carla.mendes@demo.kairos.local',
    phone: '(11) 98888-1003',
    birthDate: new Date('1995-02-04'),
  },
  {
    id: 'demo-member-daniel',
    name: 'Daniel Ribeiro',
    email: 'daniel.ribeiro@demo.kairos.local',
    phone: '(11) 98888-1004',
    birthDate: new Date('1983-11-19'),
  },
  {
    id: 'demo-member-elisa',
    name: 'Elisa Martins',
    email: 'elisa.martins@demo.kairos.local',
    phone: '(11) 98888-1005',
    birthDate: new Date('1998-07-30'),
  },
  {
    id: 'demo-member-felipe',
    name: 'Felipe Costa',
    email: 'felipe.costa@demo.kairos.local',
    phone: '(11) 98888-1006',
    birthDate: new Date('1979-01-15'),
  },
]

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('O seed de demonstração é bloqueado em produção.')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.organization.upsert({
    where: { id: 'legacy-organization' },
    update: { name: 'Rede Kairos', slug: 'rede-kairos' },
    create: { id: 'legacy-organization', name: 'Rede Kairos', slug: 'rede-kairos' },
  })

  await prisma.church.upsert({
    where: { id: 'default' },
    update: {
      organizationId: 'legacy-organization',
      name: 'Igreja Kairos',
      slug: 'sede',
      isHeadquarters: true,
      address: 'Av. da Comunidade, 100',
      phone: '(11) 3000-2026',
      email: 'contato@igrejakairos.local',
    },
    create: {
      id: 'default',
      organizationId: 'legacy-organization',
      name: 'Igreja Kairos',
      slug: 'sede',
      isHeadquarters: true,
      address: 'Av. da Comunidade, 100',
      phone: '(11) 3000-2026',
      email: 'contato@igrejakairos.local',
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: 'Administrador Kairos', password: hashedPassword, role: 'ADMIN' },
    create: {
      name: 'Administrador Kairos',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  await prisma.organizationUser.upsert({
    where: {
      organizationId_userId: { organizationId: 'legacy-organization', userId: admin.id },
    },
    update: { role: 'ADMIN', defaultChurchId: 'default' },
    create: {
      organizationId: 'legacy-organization',
      userId: admin.id,
      role: 'ADMIN',
      defaultChurchId: 'default',
    },
  })

  await prisma.churchUser.upsert({
    where: { churchId_userId: { churchId: 'default', userId: admin.id } },
    update: { role: 'ADMIN' },
    create: { churchId: 'default', userId: admin.id, role: 'ADMIN' },
  })

  for (const member of members) {
    const data = { ...member, churchId: 'default' }
    await prisma.member.upsert({ where: { id: member.id }, update: data, create: data })
  }

  const groups = [
    {
      id: 'demo-group-celula',
      name: 'Célula Esperança',
      description: 'Encontro semanal para comunhão e estudo.',
      type: 'CELL',
      meetingDay: 'QUARTA',
      startTime: '19:30',
      endTime: '21:00',
      location: 'Sala 2',
    },
    {
      id: 'demo-group-louvor',
      name: 'Ministério de Louvor',
      description: 'Equipe responsável pela música nos cultos.',
      type: 'MINISTRY',
      meetingDay: 'SABADO',
      startTime: '16:00',
      endTime: '18:00',
      location: 'Auditório',
    },
  ] as const
  for (const group of groups) {
    const data = { ...group, churchId: 'default' }
    await prisma.group.upsert({ where: { id: group.id }, update: data, create: data })
  }

  const memberGroups = [
    { memberId: 'demo-member-ana', groupId: 'demo-group-celula', role: 'LEADER' },
    { memberId: 'demo-member-bruno', groupId: 'demo-group-celula', role: 'MEMBER' },
    { memberId: 'demo-member-carla', groupId: 'demo-group-celula', role: 'MEMBER' },
    { memberId: 'demo-member-daniel', groupId: 'demo-group-louvor', role: 'LEADER' },
    { memberId: 'demo-member-elisa', groupId: 'demo-group-louvor', role: 'MEMBER' },
    { memberId: 'demo-member-felipe', groupId: 'demo-group-louvor', role: 'MEMBER' },
  ] as const
  for (const relation of memberGroups) {
    await prisma.memberGroup.upsert({
      where: { memberId_groupId: { memberId: relation.memberId, groupId: relation.groupId } },
      update: { role: relation.role },
      create: relation,
    })
  }

  const serviceDate = new Date(nextSunday)
  const cellDate = new Date(nextSunday)
  cellDate.setDate(serviceDate.getDate() + 3)
  cellDate.setHours(19, 30, 0, 0)
  const events = [
    {
      id: 'demo-event-culto',
      title: 'Culto de celebração',
      description: 'Celebração semanal da comunidade.',
      startDate: serviceDate,
      endDate: new Date(serviceDate.getTime() + 2 * 60 * 60 * 1000),
      location: 'Auditório principal',
      type: 'SERVICE',
      status: 'SCHEDULED',
      recurrenceRule: 'WEEKLY',
      reminderMinutes: 60,
    },
    {
      id: 'demo-event-celula',
      title: 'Encontro da Célula Esperança',
      description: 'Noite de comunhão, palavra e oração.',
      startDate: cellDate,
      endDate: new Date(cellDate.getTime() + 90 * 60 * 1000),
      location: 'Sala 2',
      type: 'CELL',
      status: 'SCHEDULED',
      recurrenceRule: null,
      reminderMinutes: 1440,
    },
  ] as const
  for (const event of events) {
    const data = { ...event, churchId: 'default' }
    await prisma.event.upsert({ where: { id: event.id }, update: data, create: data })
  }

  const participants = [
    { eventId: 'demo-event-culto', memberId: 'demo-member-ana', status: 'CONFIRMED' },
    { eventId: 'demo-event-culto', memberId: 'demo-member-bruno', status: 'PENDING' },
    { eventId: 'demo-event-celula', memberId: 'demo-member-ana', status: 'CONFIRMED' },
    { eventId: 'demo-event-celula', memberId: 'demo-member-carla', status: 'PENDING' },
  ] as const
  for (const participant of participants) {
    await prisma.eventParticipant.upsert({
      where: { eventId_memberId: { eventId: participant.eventId, memberId: participant.memberId } },
      update: { status: participant.status },
      create: participant,
    })
  }

  const finances = [
    {
      id: 'demo-finance-tithes',
      type: 'INCOME',
      category: 'Dízimos',
      description: 'Dízimos do culto de domingo',
      amountCents: 185000,
      occurredAt: new Date(now.getFullYear(), now.getMonth(), 1),
      paymentMethod: 'PIX',
    },
    {
      id: 'demo-finance-rent',
      type: 'EXPENSE',
      category: 'Despesas fixas',
      description: 'Aluguel do espaço',
      amountCents: 72000,
      occurredAt: new Date(now.getFullYear(), now.getMonth(), 2),
      paymentMethod: 'TED',
    },
  ] as const
  for (const finance of finances) {
    const data = { ...finance, churchId: 'default' }
    await prisma.financeEntry.upsert({ where: { id: finance.id }, update: data, create: data })
  }

  console.log(`Seed demo concluído. Login: ${adminEmail} / ${password}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
