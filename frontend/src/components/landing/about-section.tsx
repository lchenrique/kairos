"use client"

import { CalendarDays, HeartHandshake, UsersRound } from "lucide-react"
import { motion } from "framer-motion"

const pillars = [
  { icon: UsersRound, title: "Pessoas", text: "Informações organizadas para que ninguém fique sem acompanhamento." },
  { icon: CalendarDays, title: "Ritmo", text: "Uma agenda compartilhada para encontros, tarefas e próximos passos." },
  { icon: HeartHandshake, title: "Cuidado", text: "Decisões mais próximas da realidade da sua comunidade." },
]

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 py-24">
      <div className="container grid gap-12 lg:grid-cols-[0.85fr,1.15fr] lg:items-center">
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Sobre o Kairos</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Menos planilhas. Mais presença.</h2>
          <p className="text-lg leading-8 text-muted-foreground">O Kairos reúne a rotina da igreja em um espaço simples, para que líderes e equipes encontrem o que precisam e voltem a estar perto das pessoas.</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                className="rounded-2xl border bg-card p-5 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{pillar.text}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
