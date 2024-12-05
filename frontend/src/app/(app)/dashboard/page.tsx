'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/page-header"
import { UsersIcon, ChurchIcon, HomeIcon, CalendarIcon, TrendingUpIcon, HeartHandshakeIcon } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
  return (
    <motion.div 
      className="flex-1 space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div 
        className="flex items-center w-full"
        variants={item}
      >
        <PageHeader title="Dashboard" />
      </motion.div>

      <motion.div variants={item}>
        <DashboardStats />
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div 
          className="col-span-4"
          variants={item}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Crescimento de Membros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Gráfico de Crescimento
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="col-span-3"
          variants={item}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Culto de Celebração", date: "Hoje, 19:00" },
                  { name: "Encontro de Jovens", date: "Amanhã, 20:00" },
                  { name: "Escola Bíblica", date: "Domingo, 09:00" },
                ].map((event) => (
                  <div key={event.name} className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-primary mr-2" />
                    <div className="flex-1">
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div 
          className="col-span-1"
          variants={item}
        >
          <Card>
            <CardHeader>
              <CardTitle>Células por Região</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { region: "Zona Norte", count: 15 },
                  { region: "Zona Sul", count: 12 },
                  { region: "Centro", count: 8 },
                  { region: "Zona Leste", count: 10 },
                ].map((region) => (
                  <div key={region.region} className="flex items-center justify-between">
                    <div className="font-medium">{region.region}</div>
                    <div className="flex items-center">
                      <HomeIcon className="h-4 w-4 text-primary mr-2" />
                      <span>{region.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="col-span-1"
          variants={item}
        >
          <Card>
            <CardHeader>
              <CardTitle>Projetos Sociais Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sopão Solidário", status: "Em andamento" },
                  { name: "Curso de Informática", status: "Planejado" },
                  { name: "Apoio Escolar", status: "Em andamento" },
                  { name: "Cestas Básicas", status: "Em andamento" },
                ].map((project) => (
                  <div key={project.name} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {project.status}
                      </div>
                    </div>
                    <div className="bg-primary/10 px-2 py-1 rounded text-xs">
                      {project.status === "Em andamento" ? "Ativo" : "Planejado"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="col-span-1"
          variants={item}
        >
          <Card>
            <CardHeader>
              <CardTitle>Aniversariantes do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "João Silva", date: "Hoje" },
                  { name: "Maria Santos", date: "Em 3 dias" },
                  { name: "Pedro Oliveira", date: "Em 5 dias" },
                  { name: "Ana Costa", date: "Em 7 dias" },
                ].map((birthday) => (
                  <div key={birthday.name} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      {birthday.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{birthday.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {birthday.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
