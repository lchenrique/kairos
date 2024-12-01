"use client"

import { icons } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  name: keyof typeof icons
  className?: string
}

export function Icon({ name, className, ...props }: IconProps) {
  const LucideIcon = icons[name]

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in Lucide icons`)
    return null
  }

  return (
    <div {...props}>
      <LucideIcon className={cn("h-4 w-4", className)} />
    </div>
  )
}
