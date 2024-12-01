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

const gradients = {
  blue: "from-blue-600 to-cyan-500",
  purple: "from-purple-600 to-pink-500",
  orange: "from-orange-600 to-yellow-500",
  green: "from-green-600 to-emerald-500"
}

const iconColors = {
  blue: "text-blue-600",
  purple: "text-purple-600",
  orange: "text-orange-600",
  green: "text-green-600"
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function FeatureCard({
  icon,
  title,
  description,
  stats,
  color = "blue"
}: FeatureCardProps) {
  return (
    <motion.div 
      variants={item}
      whileHover={{ 
        scale: 1.02,
        transition: { type: "spring", stiffness: 300 }
      }}
    >
      <Card className="relative overflow-hidden group">
        <CardContent className="relative p-6 space-y-4">
          {/* Background Gradient */}
          <div className={`absolute inset-0 -m-6 bg-gradient-to-br ${gradients[color]} opacity-[0.08] group-hover:opacity-[0.12] transition-opacity`} />
          
          {/* Icon with gradient background */}
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[color]} blur-2xl opacity-20`} />
            <div className="relative h-12 w-12 flex items-center justify-center">
              <Icon name={icon} className={cn("h-8 w-8", iconColors[color])} />
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <h3 className="font-bold text-xl">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground">
                {stats}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}