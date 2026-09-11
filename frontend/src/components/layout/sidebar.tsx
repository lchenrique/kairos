"use client"

import { useCallback, useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, LayoutDashboard, UsersRound, Settings, CalendarDays, BarChart3, WalletCards, HeartHandshake, LockKeyhole, ChevronRight } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { usePathname } from "next/navigation"
import { NavItem } from "./nav-item"
import { ProfileSection } from "./profile-section"
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ChurchSwitcher } from './church-switcher'
import { hasPermission, type AppPermission } from '@/lib/permissions'
import { KairosMark } from '@/components/brand/kairos-mark'

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

const SECTION_STORAGE_KEY = "kairos:sidebar:sections"

type SectionState = Record<string, boolean>

function readCollapsedSections(): SectionState {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(SECTION_STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === "object") return parsed as SectionState
  } catch {
    // ignore malformed storage
  }
  return {}
}

interface SidebarProps {
  isCollapsed: boolean
  isPreview?: boolean
}

export function Sidebar({ isCollapsed, isPreview = false }: SidebarProps) {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const role = user?.role ?? 'USER'
  const shouldReduceMotion = useReducedMotion()

  const [collapsedSections, setCollapsedSections] = useState<SectionState>({})
  const [isSectionStateReady, setIsSectionStateReady] = useState(false)

  useEffect(() => {
    setCollapsedSections(readCollapsedSections())
    setIsSectionStateReady(true)
  }, [])

  useEffect(() => {
    if (!isSectionStateReady) return
    try {
      window.localStorage.setItem(SECTION_STORAGE_KEY, JSON.stringify(collapsedSections))
    } catch {
      // ignore storage write failures
    }
  }, [collapsedSections, isSectionStateReady])

  const visibleItems = isPreview
    ? sidebarNavItems
    : sidebarNavItems.filter((item) => hasPermission(role, item.permission as AppPermission))
  const sections = Array.from(new Set(visibleItems.map((item) => item.section)))

  const isItemActive = useCallback(
    (href: string) =>
      isPreview
        ? pathname === "/onboarding" && href === "/dashboard"
        : pathname === href || pathname.startsWith(`${href}/`),
    [isPreview, pathname],
  )

  const activeSection = visibleItems.find((item) => isItemActive(item.href))?.section

  const toggleSection = useCallback((section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }, [])

  return (
    <MotionConfig reducedMotion="user">
    <div className="sidebar-surface flex h-full flex-col border-r border-sidebar-border">
      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
        className="relative overflow-hidden border-b border-sidebar-border px-4 py-4"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <motion.div
            initial={shouldReduceMotion ? undefined : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="brand-mark-frame relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          >
            <KairosMark className="brand-mark-image h-8 w-8 object-contain" />
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-sidebar bg-accent" aria-hidden="true" />
          </motion.div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
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

      <div className="border-b border-sidebar-border py-3">
        {isPreview ? (
          <div className={cn("px-2", isCollapsed && "px-0")}>
            {!isCollapsed && (
              <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-muted">
                Espaço da comunidade
              </p>
            )}
            <div
              title="Ative uma assinatura para criar sua primeira igreja"
              className={cn(
                "flex h-9 w-full items-center gap-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 px-2.5 text-sm text-sidebar-foreground",
                isCollapsed && "mx-auto w-10 justify-center p-0",
              )}
            >
              <LockKeyhole className="h-4 w-4 shrink-0" aria-hidden="true" />
              {!isCollapsed && <span className="truncate text-xs">Explorando o produto</span>}
            </div>
          </div>
        ) : <ChurchSwitcher isCollapsed={isCollapsed} />}
      </div>

      <ScrollArea className="flex-1">
        <nav
          className={cn("flex flex-col px-2 py-4", isCollapsed ? "gap-2" : "gap-3")}
          aria-label="Navegação principal"
        >
          {sections.map((section, sectionIndex) => {
            const items = visibleItems.filter((item) => item.section === section)
            const contentId = `sidebar-section-${sectionIndex}`
            const isOpen = section === activeSection || !collapsedSections[section]

            if (isCollapsed) {
              return (
                <div key={section} className="flex flex-col gap-1">
                  {sectionIndex > 0 && (
                    <div className="mx-auto my-1 h-px w-6 bg-sidebar-border" aria-hidden="true" />
                  )}
                  {items.map((item, index) => (
                    <NavItem
                      key={item.href}
                      href={isPreview ? "/onboarding" : item.href}
                      icon={item.icon}
                      title={item.title}
                      isActive={isItemActive(item.href)}
                      delay={0.05 + index * 0.03}
                      isCollapsed
                    />
                  ))}
                </div>
              )
            }

            return (
              <section key={section} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleSection(section)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  className="group flex w-full items-center gap-1.5 rounded-md px-2.5 py-1 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-sidebar-muted transition-colors hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                >
                  <ChevronRight
                    className={cn("h-3 w-3 shrink-0 transition-transform duration-150", isOpen && "rotate-90")}
                    aria-hidden="true"
                  />
                  <span>{section}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={contentId}
                      id={contentId}
                      initial={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-0.5 pt-0.5">
                        {items.map((item, index) => (
                          <NavItem
                            key={item.href}
                            href={isPreview ? "/onboarding" : item.href}
                            icon={item.icon}
                            title={item.title}
                            isActive={isItemActive(item.href)}
                            delay={0.05 + index * 0.03}
                            isCollapsed={false}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="mt-auto border-t border-sidebar-border py-3">
        <div>
          <ProfileSection isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
    </MotionConfig>
  )
}
