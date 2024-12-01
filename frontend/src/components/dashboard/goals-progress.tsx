"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Target, Users, CalendarCheck, TrendingUp } from "lucide-react"

const goals = [
  {
    id: 1,
    title: "Crescimento de Membros",
    target: "3,000",
    current: "2,853",
    progress: 95,
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 2,
    title: "Participação em Eventos",
    target: "95%",
    current: "89%",
    progress: 89,
    icon: CalendarCheck,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: 3,
    title: "Engajamento em Grupos",
    target: "80%",
    current: "72%",
    progress: 72,
    icon: TrendingUp,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
]

export function GoalsProgress() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Metas</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-6">
          {goals.map((goal, index) => {
            const Icon = goal.icon
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`${goal.bgColor} ${goal.color} p-1.5 rounded-full`}>
                      <Icon className="h-3 w-3" />
                    </div>
                    <p className="text-sm font-medium">{goal.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {goal.current} / {goal.target}
                  </p>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </motion.div>
            )
          })}
        </CardContent>
      </Card>
    </motion.div>
  )
}
