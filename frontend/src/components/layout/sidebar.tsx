"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, LayoutDashboard, UserCircle, Church, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { NavItem } from "./nav-item"
import { ProfileSection } from "./profile-section"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Membros",
    href: "/members",
    icon: Users,
  },
  {
    title: "Grupos",
    href: "/groups",
    icon: UserCircle,
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  isCollapsed: boolean
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-card/50 backdrop-blur-lg border-r">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b p-6"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="flex items-center justify-center bg-primary/10 rounded-lg p-2"
          >
            <Church className="h-6 w-6 text-primary" />
          </motion.div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <motion.h2
                  className="text-2xl font-semibold tracking-tight"
                >
                  Kairos
                </motion.h2>
                <motion.p className="text-xs text-muted-foreground">
                  Gestão Eclesiástica
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="flex flex-col space-y-2">
          {sidebarNavItems.map((item, index) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={item.title}
              isActive={pathname === item.href}
              delay={0.4 + index * 0.1}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </ScrollArea>

      <ProfileSection isCollapsed={isCollapsed} />
    </div>
  )
}