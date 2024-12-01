"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import CountUp from "react-countup"

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  delay?: number
  trend?: "up" | "down"
  secondaryValue?: string | number
  secondaryLabel?: string
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  description, 
  delay = 0,
  trend,
  secondaryValue,
  secondaryLabel
}: StatsCardProps) {
  const isNumber = !isNaN(Number(value.toString().replace(/[^0-9.-]+/g,"")))
  const isSecondaryNumber = secondaryValue ? !isNaN(Number(secondaryValue.toString().replace(/[^0-9.-]+/g,""))) : false
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
      <Card className="relative backdrop-blur-sm border-primary/10 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-primary/10 text-primary"
          >
            {icon}
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: delay + 0.2 }}
            className="text-2xl font-bold"
          >
            {isNumber ? (
              <CountUp
                end={Number(value.toString().replace(/[^0-9.-]+/g,""))}
                duration={2}
                separator=","
                decimals={value.toString().includes(".") ? 1 : 0}
                suffix={value.toString().match(/[^0-9.-]+$/)?.[0] || ""}
              />
            ) : (
              value
            )}
          </motion.div>
          
          {description && (
            <motion.p 
              className={`text-xs mt-1 flex items-center gap-1 ${
                trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: delay + 0.4 }}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : ""} {description}
            </motion.p>
          )}

          {secondaryValue && secondaryLabel && (
            <motion.div
              className="mt-3 pt-3 border-t border-border/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: delay + 0.5 }}
            >
              <div className="text-sm font-medium">
                {isSecondaryNumber ? (
                  <CountUp
                    end={Number(secondaryValue.toString().replace(/[^0-9.-]+/g,""))}
                    duration={2}
                    separator=","
                    decimals={secondaryValue.toString().includes(".") ? 1 : 0}
                    suffix={secondaryValue.toString().match(/[^0-9.-]+$/)?.[0] || ""}
                  />
                ) : (
                  secondaryValue
                )}
              </div>
              <p className="text-xs text-muted-foreground">{secondaryLabel}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}