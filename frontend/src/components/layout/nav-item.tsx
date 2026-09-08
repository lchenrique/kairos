"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface NavItemProps {
  href: string
  icon: LucideIcon
  title: string
  isActive: boolean
  delay?: number
  isCollapsed?: boolean
}

export function NavItem({ 
  href, 
  icon: Icon, 
  title, 
  isActive, 
  delay = 0,
  isCollapsed = false 
}: NavItemProps) {
  const NavButton = (
    <Button
      variant="ghost"
      className={cn(
        "group relative h-11 w-full justify-start gap-3 overflow-hidden rounded-xl px-3 text-sidebar-muted hover:bg-white/[0.07] hover:text-sidebar-foreground",
        isActive && "bg-primary text-primary-foreground shadow-md shadow-black/20 hover:bg-primary/90 hover:text-primary-foreground",
        isCollapsed && "justify-center px-0"
      )}
      aria-label={isCollapsed ? title : undefined}
      aria-current={isActive ? "page" : undefined}
      asChild
    >
      <Link href={href}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "relative z-10 flex shrink-0 items-center justify-center transition-colors",
            isActive ? "text-primary-foreground" : "text-sidebar-muted group-hover:text-sidebar-foreground"
          )}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.25 : 1.8} aria-hidden="true" />
        </motion.div>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className={cn(
                "font-medium transition-colors",
                isActive ? "text-primary-foreground" : "text-sidebar-muted group-hover:text-sidebar-foreground"
              )}
            >
              {title}
            </motion.span>
          )}
        </AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="active-nav"
            className="absolute left-0 top-2 h-7 w-1 rounded-r-full bg-accent"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    </Button>
  )

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {NavButton}
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={16} className="border-sidebar-border bg-sidebar text-sidebar-foreground">
              {title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {NavButton}
    </motion.div>
  )
}
