"use client"

import { CalendarDays, HeartHandshake, UsersRound, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const pillars = [
  {
    icon: UsersRound,
    title: "Pessoas no Centro",
    text: "Membros, novos convertidos e visitantes acolhidos com histórico claro para que ninguém passe desapercebido.",
  },
  {
    icon: CalendarDays,
    title: "Ritmo Litúrgico & Pastoral",
    text: "Uma agenda sincronizada para cultos, reuniões de liderança, escalas de ministério e eventos especiais.",
  },
  {
    icon: HeartHandshake,
    title: "Cuidado Comunitário",
    text: "Decisões ministeriais baseadas na realidade viva da comunidade, e não em suposições ou anotações perdidas.",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 py-24 lg:py-32 relative overflow-hidden">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-[0.85fr,1.15fr] lg:items-center">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Propósito & Essência
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Menos burocracia. Muito mais presença.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
            O Kairos foi concebido para reunir toda a operação da igreja em um espaço leve e
            intuitivo, para que pastores e líderes gastem menos tempo alimentando planilhas e mais
            tempo cuidando das pessoas.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                className="group rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {pillar.text}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
