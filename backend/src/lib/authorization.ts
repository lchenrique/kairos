import type { FastifyReply, FastifyRequest } from 'fastify'
import type { UserRole } from '../schemas/auth.js'

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  PASTOR: 'Pastor',
  LEADER: 'Líder',
  SECRETARY: 'Secretário',
  USER: 'Usuário',
}

export const ROLE_PERMISSIONS = {
  DASHBOARD_VIEW: ['ADMIN', 'PASTOR', 'SECRETARY'],
  MEMBERS_VIEW: ['ADMIN', 'PASTOR', 'SECRETARY'],
  MEMBERS_MANAGE: ['ADMIN', 'PASTOR', 'SECRETARY'],
  GROUPS_VIEW: ['ADMIN', 'PASTOR', 'SECRETARY', 'LEADER'],
  GROUPS_MANAGE: ['ADMIN', 'PASTOR', 'SECRETARY'],
  EVENTS_VIEW: ['ADMIN', 'PASTOR', 'SECRETARY', 'LEADER', 'USER'],
  EVENTS_MANAGE: ['ADMIN', 'PASTOR', 'SECRETARY'],
  REPORTS_VIEW: ['ADMIN', 'PASTOR'],
  FINANCE_VIEW: ['ADMIN', 'PASTOR'],
  FINANCE_MANAGE: ['ADMIN'],
  CHURCH_SETTINGS_VIEW: ['ADMIN', 'PASTOR'],
  CHURCH_SETTINGS_MANAGE: ['ADMIN', 'PASTOR'],
  NETWORK_MANAGE: ['ADMIN'],
  TEAM_MANAGE: ['ADMIN'],
  SYSTEM_INFO_VIEW: ['ADMIN'],
  UPLOADS_MANAGE: ['ADMIN', 'PASTOR', 'SECRETARY'],
} as const satisfies Record<string, readonly UserRole[]>

export type Permission = keyof typeof ROLE_PERMISSIONS

export function hasPermission(role: string | undefined, permission: Permission) {
  return (ROLE_PERMISSIONS[permission] as readonly string[]).includes(role || 'USER')
}

export function requireRoles(...allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const role = (request.user?.role || 'USER') as UserRole
    if (!allowedRoles.includes(role)) {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        code: 'FORBIDDEN',
        message: 'Você não tem permissão para realizar esta ação.',
      })
    }
  }
}

export function requirePermission(permission: Permission) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!hasPermission(request.user?.role, permission)) {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        code: 'FORBIDDEN',
        message: 'Você não tem permissão para realizar esta ação.',
      })
    }
  }
}
