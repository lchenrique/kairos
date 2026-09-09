"use client"

import { motion } from "framer-motion"
import { QrCode, HeartHandshake, Layers, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const bentoItems = [
  {
    title: "Check-in Inteligente por QR Code",
    tag: "Presença Viva",
    description: "Os membros e visitantes realizam o check-in na entrada do culto em segundos apontando a câmera do celular ou na mesa de recepção.",
    icon: QrCode,
    highlight: "Zero filas na entrada do culto",
    gradient: "from-indigo-500/10 via-primary/5 to-transparent",
    colSpan: "lg:col-span-2",
  },
  {
    title: "Células & Pequenos Grupos",
    tag: "Discipulado",
    description: "Acompanhe a frequência semanal de cada célula, receba relatórios de reuniões e monitore multiplicações de grupo.",
    icon: Layers,
    highlight: "Visão em tempo real de liderança",
    gradient: "from-purple-500/10 via-pink-500/5 to-transparent",
    colSpan: "lg:col-span-1",
  },
  {
    title: "Acompanhamento Pastoral 360°",
    tag: "Cuidado Comunitário",
    description: "Identifique automaticamente membros que faltaram 3 semanas consecutivas para agir com carinho e oração antes que se afastem.",
    icon: HeartHandshake,
    highlight: "Nenhuma ovelha esquecida",
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    colSpan: "lg:col-span-1",
  },
  {
    title: "Permissões Seguras por Papel",
    tag: "Governança",
    description: "Controle refinado de acessos: Administrador, Pastor, Líder de Célula, Secretaria e Membro. Cada um visualiza somente o necessário.",
    icon: ShieldCheck,
    highlight: "Proteção total de dados e LGPD",
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    colSpan: "lg:col-span-2",
  },
]

export function AdditionalFeatures() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <motion.div 
          className="mx-auto max-w-2xl text-center space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Ecossistema Completo
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Tudo que sua liderança precisa em um só ritmo
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Projetado de ponta a ponta para reduzir a burocracia das planilhas e elevar o tempo com pessoas.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {bentoItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                className={item.colSpan}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="group relative h-full overflow-hidden rounded-[2rem] border border-border/70 bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl flex flex-col justify-between">
                  {/* Subtle Background Glow */}
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-40 transition-opacity group-hover:opacity-80`} />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full border border-border/60 bg-muted/60 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {item.tag}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground/90 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      {item.highlight}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground group-hover:text-primary" asChild>
                      <Link href="/dashboard">
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
