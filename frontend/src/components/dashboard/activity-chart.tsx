"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

const data = [
  { name: "Jan", value: 45, previous: 40 },
  { name: "Fev", value: 52, previous: 45 },
  { name: "Mar", value: 49, previous: 48 },
  { name: "Abr", value: 63, previous: 51 },
  { name: "Mai", value: 58, previous: 54 },
  { name: "Jun", value: 71, previous: 58 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/80 backdrop-blur-sm p-4 border rounded-lg shadow-lg">
        <p className="text-sm font-medium mb-1">{label}</p>
        <p className="text-sm text-primary flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary inline-block" />
          Atual: {payload[0].value}
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-muted-foreground inline-block" />
          Anterior: {payload[1].value}
        </p>
      </div>
    )
  }
  return null
}

export function ActivityChart() {
  const { theme } = useTheme()
  const textColor = theme === "dark" ? "#888888" : "#666666"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="col-span-4"
    >
      <Card className="overflow-hidden">
        <CardHeader>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CardTitle className="flex items-center justify-between">
              <span>Atividade Mensal</span>
              <span className="text-sm font-normal text-muted-foreground">
                Últimos 6 meses
              </span>
            </CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={textColor} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={textColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={textColor} opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  stroke={textColor} 
                  tick={{ fill: textColor }}
                />
                <YAxis 
                  stroke={textColor}
                  tick={{ fill: textColor }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="previous"
                  stroke={textColor}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrevious)"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}