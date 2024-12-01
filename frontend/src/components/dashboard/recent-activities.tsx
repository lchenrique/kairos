"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { UserPlus, Users, CalendarCheck, Settings, Activity } from "lucide-react"

const activities = [
  {
    id: 1,
    title: "Novo membro adicionado",
    description: "João Silva foi adicionado ao grupo de Jovens",
    time: "2 minutos atrás",
    icon: UserPlus,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: 2,
    title: "Evento concluído",
    description: "Culto de Domingo teve 245 participantes",
    time: "1 hora atrás",
    icon: CalendarCheck,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 3,
    title: "Grupo atualizado",
    description: "3 novos membros adicionados ao Ministério de Louvor",
    time: "3 horas atrás",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: 4,
    title: "Configurações alteradas",
    description: "Permissões de acesso atualizadas",
    time: "5 horas atrás",
    icon: Settings,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
]

export function RecentActivities() {
  return (
    <Card className="h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent opacity-50" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -20 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="p-2 rounded-full bg-primary/10"
          >
            <Activity className="h-4 w-4 text-primary" />
          </motion.div>
          <CardTitle className="text-xl font-bold">Atividades Recentes</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative overflow-auto h-[calc(100%-6rem)]">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-primary/5 transition-all group">
                <div className={`${activity.bgColor} ${activity.color} p-2 rounded-full`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </CardContent>
    </Card>
  )
}
