"use client"

import { ReactNode } from "react"
import CountUp from "react-countup"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: number
  icon: ReactNode
  description?: string
  prefix?: string
  suffix?: string
  color?: "primary" | "green" | "orange" | "blue" | "purple"
}

function getColorClasses(color: string) {
  switch (color) {
    case "primary":
      return {
        background: "from-primary/20 via-primary/10 to-transparent",
        icon: "text-primary",
        iconBackground: "bg-primary/10"
      }
    case "green":
      return {
        background: "from-green-500/20 via-green-500/10 to-transparent",
        icon: "text-green-500",
        iconBackground: "bg-green-500/10"
      }
    case "orange":
      return {
        background: "from-orange-500/20 via-orange-500/10 to-transparent",
        icon: "text-orange-500",
        iconBackground: "bg-orange-500/10"
      }
    case "blue":
      return {
        background: "from-blue-500/20 via-blue-500/10 to-transparent",
        icon: "text-blue-500",
        iconBackground: "bg-blue-500/10"
      }
    case "purple":
      return {
        background: "from-purple-500/20 via-purple-500/10 to-transparent",
        icon: "text-purple-500",
        iconBackground: "bg-purple-500/10"
      }
    default:
      return {
        background: "from-primary/20 via-primary/10 to-transparent",
        icon: "text-primary",
        iconBackground: "bg-primary/10"
      }
  }
}

function StatsCard({ 
  title, 
  value, 
  icon, 
  description, 
  prefix, 
  suffix, 
  color = "primary" 
}: StatsCardProps) {
  const colors = getColorClasses(color)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="h-full relative overflow-hidden group">
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", colors.background)} />
        <div className={cn("absolute -right-8 -top-8 h-24 w-24 opacity-10", colors.icon)}>
          {icon}
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
                {icon}
              </div>
            </motion.div>
            <CardTitle className="text-sm font-medium group-hover:text-foreground/80 transition-colors">{title}</CardTitle>
          </div>
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

interface StatsCardsProps {
  data: StatsCardProps[]
}

export function StatsCards({ data }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {data.map((stat, index) => (
        <StatsCard 
          key={index} 
          {...stat} 
        />
      ))}
    </div>
  )
}
