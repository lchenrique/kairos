"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Gift, Cake, PartyPopper } from "lucide-react"

const birthdays = [
  {
    id: "1",
    name: "Maria Silva",
    date: "15 de Abril",
    avatar: "https://avatar.vercel.sh/maria",
    age: 28,
  },
  {
    id: "2",
    name: "João Santos",
    date: "18 de Abril",
    avatar: "https://avatar.vercel.sh/joao",
    age: 32,
  },
  {
    id: "3",
    name: "Ana Oliveira",
    date: "22 de Abril",
    avatar: "https://avatar.vercel.sh/ana",
    age: 25,
  },
]

export function BirthdaysCard() {
  return (
    <Card className="h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent opacity-50" />
      <div className="absolute -right-8 -top-8">
        <PartyPopper className="h-24 w-24 text-primary opacity-10" />
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -20 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="p-2 rounded-full bg-primary/10"
          >
            <Gift className="h-4 w-4 text-primary" />
          </motion.div>
          <CardTitle className="text-xl font-bold">Aniversariantes do Mês</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative overflow-auto h-[calc(100%-6rem)]">
        {birthdays.map((birthday, index) => (
          <motion.div
            key={birthday.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
          >
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/5 transition-all group relative">
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={birthday.avatar} />
                  <AvatarFallback>{birthday.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                  <Cake className="h-3 w-3" />
                </div>
              </motion.div>
              
              <div className="flex-1 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium leading-none group-hover:text-primary transition-colors">
                    {birthday.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">{birthday.date}</p>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {birthday.age} anos
                    </span>
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