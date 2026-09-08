'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const hasLocalStagger = pathname === '/dashboard' || pathname === '/members'

  return (
    <motion.div
      key={pathname}
      className={hasLocalStagger ? 'min-w-0' : 'page-stagger min-w-0'}
      initial={hasLocalStagger && !prefersReducedMotion ? { opacity: 0, y: 10 } : false}
      animate={hasLocalStagger ? { opacity: 1, y: 0 } : undefined}
      transition={hasLocalStagger ? (prefersReducedMotion ? { duration: 0 } : { duration: 0.28, ease: [0.2, 0, 0, 1] }) : undefined}
    >
      {children}
    </motion.div>
  )
}
