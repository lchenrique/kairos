import type { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from './prisma.js'

export interface TenantContext {
  organizationId: string
  organizationName: string
  churchId: string | null
  churchIds: string[]
  accessibleChurchIds: string[]
  allChurches: boolean
}

function sendTenantError(
  reply: FastifyReply,
  statusCode: 400 | 403,
  code: string,
  message: string,
) {
  return reply.status(statusCode).send({
    statusCode,
    error: statusCode === 403 ? 'Forbidden' : 'Bad Request',
    code,
    message,
  })
}

export async function loadTenantContext(request: FastifyRequest, reply: FastifyReply) {
  const organizationId = request.user.organizationId
  if (!organizationId) {
    return sendTenantError(
      reply,
      403,
      'ORGANIZATION_REQUIRED',
      'Sua sessão não está vinculada a uma Rede. Entre novamente.',
    )
  }

  const membership = await prisma.organizationUser.findUnique({
    where: { organizationId_userId: { organizationId, userId: request.user.sub } },
    select: {
      role: true,
      defaultChurchId: true,
      organization: { select: { name: true } },
    },
  })

  if (!membership) {
    return sendTenantError(
      reply,
      403,
      'ORGANIZATION_ACCESS_DENIED',
      'Você não possui acesso a esta Rede.',
    )
  }

  const churches =
    membership.role === 'ADMIN'
      ? await prisma.church.findMany({
          where: { organizationId, status: 'ACTIVE' },
          select: { id: true },
          orderBy: [{ isHeadquarters: 'desc' }, { name: 'asc' }],
        })
      : await prisma.churchUser.findMany({
          where: {
            userId: request.user.sub,
            church: { organizationId, status: 'ACTIVE' },
          },
          select: { churchId: true },
          orderBy: { church: { name: 'asc' } },
        })

  const churchIds = churches.map((church) => ('churchId' in church ? church.churchId : church.id))
  if (churchIds.length === 0) {
    return sendTenantError(
      reply,
      403,
      'CHURCH_ACCESS_REQUIRED',
      'Você ainda não possui acesso a uma igreja ou unidade ativa.',
    )
  }

  const rawChurchId = request.headers['x-church-id']
  const requestedChurchId = Array.isArray(rawChurchId) ? rawChurchId[0] : rawChurchId
  const allChurches = requestedChurchId === 'all'
  const churchId = allChurches
    ? null
    : requestedChurchId ||
      (membership.defaultChurchId && churchIds.includes(membership.defaultChurchId)
        ? membership.defaultChurchId
        : churchIds[0])

  if (churchId && !churchIds.includes(churchId)) {
    return sendTenantError(
      reply,
      403,
      'CHURCH_ACCESS_DENIED',
      'Você não possui acesso à igreja ou unidade selecionada.',
    )
  }

  request.tenant = {
    organizationId,
    organizationName: membership.organization.name,
    churchId,
    churchIds: allChurches ? churchIds : [churchId as string],
    accessibleChurchIds: churchIds,
    allChurches,
  }
}

export function requireCurrentChurch(request: FastifyRequest, reply: FastifyReply) {
  if (request.tenant.churchId) return request.tenant.churchId

  sendTenantError(
    reply,
    400,
    'CHURCH_SELECTION_REQUIRED',
    'Selecione uma igreja ou unidade específica para realizar esta ação.',
  )
  return null
}
