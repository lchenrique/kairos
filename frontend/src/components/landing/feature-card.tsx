"use client"

import { Card, CardContent } from "@/components/ui/card"
import { icons } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"

interface FeatureCardProps {
  icon: keyof typeof icons
  title: string
  description: string
  stats?: string
  color?: "blue" | "purple" | "orange" | "green"
}

const colorStyles = {
  blue: {
    bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    gradient: "from-indigo-500/10 to-primary/5",
    border: "group-hover:border-indigo-500/40",
    badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
  },
  purple: {
    bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    gradient: "from-purple-500/10 to-pink-500/5",
    border: "group-hover:border-purple-500/40",
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-300",
  },
  orange: {
    bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    gradient: "from-amber-500/10 to-orange-500/5",
    border: "group-hover:border-amber-500/40",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  },
  green: {
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    gradient: "from-emerald-500/10 to-teal-500/5",
    border: "group-hover:border-emerald-500/40",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  },
}

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function FeatureCard({
  icon,
  title,
  description,
  stats,
  color = "blue",
}: FeatureCardProps) {
  const theme = colorStyles[color]

  return (
    <motion.div variants={item}>
      <Card className={cn(
        "group relative h-full overflow-hidden rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        theme.border
      )}>
        {/* Soft Background Gradient */}
        <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-100", theme.gradient)} />

        <CardContent className="relative flex h-full flex-col justify-between p-0">
          <div className="space-y-4">
            <div className={cn("inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105", theme.bg)}>
              <Icon name={icon} className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                {title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {description}
              </p>
            </div>
          </div>

          {stats && (
            <div className="mt-5 border-t border-border/60 pt-4">
              <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold", theme.badge)}>
                {stats}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}