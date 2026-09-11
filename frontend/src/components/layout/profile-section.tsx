"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/lib/stores/auth-store"
import { LogOut, Settings, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProfileSectionProps {
  isCollapsed?: boolean
}

export function ProfileSection({ isCollapsed = false }: ProfileSectionProps) {
  const user = useAuthStore((state) => state.user)
  const { signOut } = useAuth()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="px-2"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "relative h-auto min-h-11 w-full overflow-hidden rounded-lg border border-sidebar-border bg-white/[0.04] px-2.5 py-2 text-sidebar-foreground hover:bg-white/[0.08] hover:text-sidebar-foreground focus:text-sidebar-foreground data-[state=open]:text-sidebar-foreground",
              isCollapsed ? "justify-center" : "justify-start gap-2.5"
            )}
          >
            <div className="relative shrink-0">
              <Avatar className="relative h-9 w-9 border border-sidebar-border">
                <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                  {user?.name?.[0] || "A"}
                </AvatarFallback>
              </Avatar>
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex flex-col items-start overflow-hidden"
                >
                  <p className="max-w-[150px] truncate text-left text-sm font-medium">{user?.name || "Administrador"}</p>
                  <p className="max-w-[150px] truncate text-left text-xs text-sidebar-foreground/70">{user?.email || "admin@exemplo.com"}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 border-border/80 bg-card" align="end" side="right">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2">
            <User className="h-4 w-4 text-primary" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="gap-2 text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}
