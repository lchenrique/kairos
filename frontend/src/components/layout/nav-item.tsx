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
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start relative group",
        isActive && "bg-secondary",
        isCollapsed && "justify-center"
      )}
      asChild
    >
      <Link href={href}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={cn("mr-2", isCollapsed && "mr-0")}
        >
          <Icon className="h-4 w-4" />
        </motion.div>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-medium"
            >
              {title}
            </motion.span>
          )}
        </AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="active-nav"
            className="absolute left-0 w-1 h-full bg-primary rounded-full"
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
            <TooltipContent side="right" sideOffset={20}>
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