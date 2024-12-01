"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Calendar, MapPin, Clock } from "lucide-react"

const events = [
  {
    id: "1",
    title: "Culto de Jovens",
    date: "15 de Abril",
    time: "19:30",
    location: "Templo Principal",
    type: "culto",
  },
  {
    id: "2",
    title: "Encontro de Líderes",
    date: "17 de Abril",
    time: "15:00",
    location: "Sala 204",
    type: "reuniao",
  },
  {
    id: "3",
    title: "Escola Bíblica",
    date: "18 de Abril",
    time: "09:00",
    location: "Salas de Estudo",
    type: "estudo",
  },
]

const typeColors = {
  culto: "bg-primary/10 text-primary hover:bg-primary/20",
  reuniao: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  estudo: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
}

export function UpcomingEvents() {
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
            <Calendar className="h-4 w-4 text-primary" />
          </motion.div>
          <CardTitle className="text-xl font-bold">Próximos Eventos</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative overflow-auto h-[calc(100%-6rem)]">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
          >
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/5 transition-all group relative">
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium leading-none group-hover:text-primary transition-colors">
                    {event.title}
                  </p>
                  <Badge variant="outline" className={typeColors[event.type as keyof typeof typeColors]}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{event.date}, {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}