export const APP_ROLES = ['ADMIN', 'PASTOR', 'LEADER', 'SECRETARY', 'USER'] as const

export type AppRole = (typeof APP_ROLES)[number]

export const APP_PERMISSIONS = {
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
  SETTINGS_VIEW: ['ADMIN', 'PASTOR'],
  NETWORK_MANAGE: ['ADMIN'],
  PORTAL_VIEW: ['ADMIN', 'PASTOR', 'SECRETARY', 'LEADER', 'USER'],
  CALENDAR_VIEW: ['ADMIN', 'PASTOR', 'SECRETARY', 'LEADER', 'USER'],
} as const satisfies Record<string, readonly AppRole[]>

export type AppPermission = keyof typeof APP_PERMISSIONS

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === 'string' && (APP_ROLES as readonly string[]).includes(value)
}

export function hasPermission(role: AppRole | string | null | undefined, permission: AppPermission) {
  return (APP_PERMISSIONS[permission] as readonly string[]).includes(role || '')
}

const routeRules: Array<{
  matches: (pathname: string) => boolean
  permission: AppPermission
}> = [
  {
    matches: (pathname) => /^\/events\/[^/]+\/check-in(?:\/|$)/.test(pathname),
    permission: 'EVENTS_MANAGE',
  },
  { matches: (pathname) => pathname.startsWith('/dashboard'), permission: 'DASHBOARD_VIEW' },
  { matches: (pathname) => pathname.startsWith('/members'), permission: 'MEMBERS_VIEW' },
  { matches: (pathname) => pathname.startsWith('/groups'), permission: 'GROUPS_VIEW' },
  { matches: (pathname) => pathname.startsWith('/portal'), permission: 'PORTAL_VIEW' },
  { matches: (pathname) => pathname.startsWith('/events'), permission: 'EVENTS_VIEW' },
  { matches: (pathname) => pathname.startsWith('/calendar'), permission: 'CALENDAR_VIEW' },
  { matches: (pathname) => pathname.startsWith('/reports'), permission: 'REPORTS_VIEW' },
  { matches: (pathname) => pathname.startsWith('/finance'), permission: 'FINANCE_VIEW' },
  { matches: (pathname) => pathname.startsWith('/settings'), permission: 'SETTINGS_VIEW' },
]

export function canAccessPath(role: AppRole | string | null | undefined, pathname: string) {
  const rule = routeRules.find((candidate) => candidate.matches(pathname))
  return rule ? hasPermission(role, rule.permission) : true
}

export function defaultPathForRole(role: AppRole | string | null | undefined) {
  return hasPermission(role, 'DASHBOARD_VIEW') ? '/dashboard' : '/portal'
}
