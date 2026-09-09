"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, LayoutDashboard, UsersRound, Church, Settings, CalendarDays, BarChart3, WalletCards, HeartHandshake, LockKeyhole } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { usePathname } from "next/navigation"
import { NavItem } from "./nav-item"
import { ProfileSection } from "./profile-section"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ChurchSwitcher } from './church-switcher'
import { hasPermission, type AppPermission } from '@/lib/permissions'

const sidebarNavItems = [
  {
    section: "Visão geral",
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: "DASHBOARD_VIEW",
  },
  {
    section: "Cuidar",
    title: "Membros",
    href: "/members",
    icon: Users,
    permission: "MEMBERS_VIEW",
  },
  {
    section: "Cuidar",
    title: "Grupos",
    href: "/groups",
    icon: UsersRound,
    permission: "GROUPS_VIEW",
  },
  {
    section: "Cuidar",
    title: "Portal",
    href: "/portal",
    icon: HeartHandshake,
    permission: "PORTAL_VIEW",
  },
  {
    section: "Organizar",
    title: "Eventos",
    href: "/events",
    icon: CalendarDays,
    permission: "EVENTS_VIEW",
  },
  {
    section: "Organizar",
    title: "Calendário",
    href: "/calendar",
    icon: CalendarDays,
    permission: "CALENDAR_VIEW",
  },
  {
    section: "Organizar",
    title: "Relatórios",
    href: "/reports",
    icon: BarChart3,
    permission: "REPORTS_VIEW",
  },
  {
    section: "Organizar",
    title: "Financeiro",
    href: "/finance",
    icon: WalletCards,
    permission: "FINANCE_VIEW",
  },
  {
    section: "Sistema",
    title: "Configurações",
    href: "/settings",
    icon: Settings,
    permission: "SETTINGS_VIEW",
  },
]

interface SidebarProps {
  isCollapsed: boolean
  isPreview?: boolean
}

export function Sidebar({ isCollapsed, isPreview = false }: SidebarProps) {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const role = user?.role ?? 'USER'

  const visibleItems = isPreview
    ? sidebarNavItems
    : sidebarNavItems.filter((item) => hasPermission(role, item.permission as AppPermission))
  const sections = Array.from(new Set(visibleItems.map((item) => item.section)))

  return (
    <div className="sidebar-surface flex h-full flex-col border-r border-sidebar-border">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden border-b border-sidebar-border px-5 py-6"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-black/20"
          >
            <Church className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-sidebar bg-accent" aria-hidden="true" />
          </motion.div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex min-w-0 flex-col"
              >
                <motion.h2
                  className="font-display text-2xl font-semibold tracking-tight text-sidebar-foreground"
                >
                  KAIROS
                </motion.h2>
                <motion.p className="truncate text-[11px] uppercase tracking-[0.18em] text-sidebar-muted">
                  Ritmo da comunidade
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="border-b border-sidebar-border py-4">
        {isPreview ? (
          <div className={cn("flex items-center gap-2 px-3 text-xs text-sidebar-muted", isCollapsed && "justify-center px-0")} title="Ative uma assinatura para criar sua primeira igreja">
            <LockKeyhole className="h-4 w-4 shrink-0" aria-hidden="true" />
            {!isCollapsed && <span className="truncate">Explorando o produto</span>}
          </div>
        ) : <ChurchSwitcher isCollapsed={isCollapsed} />}
      </div>
      
      <ScrollArea className="flex-1 px-3 py-5">
        <nav className="flex flex-col gap-6" aria-label="Navegação principal">
          {sections.map((section) => {
            const items = visibleItems.filter((item) => item.section === section)
            return (
              <div key={section} className="space-y-1.5">
                {!isCollapsed && <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-sidebar-muted">{section}</p>}
                {items.map((item, index) => (
                  <NavItem
                    key={item.href}
                    href={isPreview ? "/onboarding" : item.href}
                    icon={item.icon}
                    title={item.title}
                    isActive={isPreview ? pathname === "/onboarding" && item.href === "/dashboard" : pathname === item.href || pathname.startsWith(`${item.href}/`)}
                    delay={0.15 + index * 0.05}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="mt-auto border-t border-sidebar-border py-4">
        <div>
          <ProfileSection isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  )
}
