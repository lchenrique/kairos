"use client"

import { motion } from "framer-motion"
import { useAuthStore } from "@/lib/stores/auth-store"

export function WelcomeMessage() {
  const user = useAuthStore((state) => state.user)
  const currentHour = new Date().getHours()

  const getGreeting = () => {
    if (currentHour < 12) return "Bom dia"
    if (currentHour < 18) return "Boa tarde"
    return "Boa noite"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-lg blur-2xl" />
      <div className="relative">
        <motion.h1 
          className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {getGreeting()}, {user?.name || "Administrador"}
        </motion.h1>
        <motion.p
          className="text-muted-foreground mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Bem-vindo ao seu painel de controle
        </motion.p>
      </div>
    </motion.div>
  )
}