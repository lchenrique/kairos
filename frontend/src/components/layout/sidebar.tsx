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
    <div className="flex h-full flex-col bg-gradient-to-b from-card/90 to-card/50 backdrop-blur-lg border-r">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-3 overflow-hidden">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-2 shadow-lg shadow-primary/20"
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
                  className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
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

      <div className="mt-auto">
        <div className="bg-gradient-to-t from-background/80 to-transparent py-4">
          <ProfileSection isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  )
}