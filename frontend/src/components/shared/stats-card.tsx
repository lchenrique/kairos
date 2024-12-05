"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import CountUp from "react-countup"

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  description?: string
  prefix?: string
  suffix?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "info"
}

function getColorClasses(color: StatsCardProps["color"] = "primary") {
  switch (color) {
    case "primary":
      return {
        background: "from-blue-600/20 to-blue-800/20",
        icon: "text-blue-500",
        iconBackground: "bg-blue-500/10",
      }
    case "secondary":
      return {
        background: "from-purple-600/20 to-purple-800/20",
        icon: "text-purple-500",
        iconBackground: "bg-purple-500/10",
      }
    case "success":
      return {
        background: "from-green-600/20 to-green-800/20",
        icon: "text-green-500",
        iconBackground: "bg-green-500/10",
      }
    case "warning":
      return {
        background: "from-yellow-600/20 to-yellow-800/20",
        icon: "text-yellow-500",
        iconBackground: "bg-yellow-500/10",
      }
    case "danger":
      return {
        background: "from-red-600/20 to-red-800/20",
        icon: "text-red-500",
        iconBackground: "bg-red-500/10",
      }
    case "info":
      return {
        background: "from-sky-600/20 to-sky-800/20",
        icon: "text-sky-500",
        iconBackground: "bg-sky-500/10",
      }
  }
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  prefix, 
  suffix, 
  trend = "neutral",
  trendValue,
  color = "primary" 
}: StatsCardProps) {
  const colors = getColorClasses(color)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="relative overflow-hidden">
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", colors.background)} />
        <div className={cn("absolute -right-8 -top-8 h-24 w-24 opacity-10", colors.icon)}>
          <Icon strokeWidth={1.5} />
        </div>
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -20 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className={cn("p-2 rounded-full", colors.iconBackground)}
            >
              <div className={cn("h-4 w-4", colors.icon)}>
                <Icon strokeWidth={2} />
              </div>
            </motion.div>
            <CardTitle className="text-sm font-medium group-hover:text-foreground/80 transition-colors">
              {title}
            </CardTitle>
          </div>
          {trendValue && (
            <div className={cn("flex items-center gap-1 text-xs", {
              "text-emerald-500": trend === "up",
              "text-rose-500": trend === "down",
              "text-muted-foreground": trend === "neutral"
            })}>
              {trendValue}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="relative">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-2xl font-bold group-hover:text-foreground/80 transition-colors"
          >
            {prefix}
            <CountUp end={value} duration={2} separator="." />
            {suffix}
          </motion.div>
          {description && (
            <motion.p 
              className="text-xs mt-1 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              {description}
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
