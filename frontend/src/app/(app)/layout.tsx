'use client'

import { Sidebar } from "@/components/layout/sidebar"
import { useState, useEffect } from "react"
import { ChevronLeft, Bell, Search, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Toaster } from "@/components/ui/toaster"
import { Modal } from "@/components/modal"
import { Drawer } from "@/components/drawer"
import { useModalStore } from "@/lib/stores/modal-store"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Só redireciona se estiver montado para evitar redirecionamentos durante SSR
    if (mounted && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, mounted, router])

  // Mostra nada durante SSR ou loading
  if (!mounted) {
    return null
  }

  // Se não estiver autenticado, não mostra nada mas permite o redirecionamento acontecer
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <div className={cn(
        "fixed top-0 left-0 z-30 h-full transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <Sidebar isCollapsed={isCollapsed} />
      </div>
      
      <div className={cn(
        "flex-1 transition-all duration-300",
        isCollapsed ? "ml-20" : "ml-64"
      )}>
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex h-16 items-center gap-4 px-6">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.div>
            </Button>

            <div className="flex-1 flex items-center gap-4">
              <div className="relative max-w-md flex-1 hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  className="pl-9 bg-background/50 w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="relative"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">
                  3
                </span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 p-8 pt-6">
          {children}
        </div>
      
      </div>
    </div>
  )
}