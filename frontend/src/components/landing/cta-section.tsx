"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Church, Users, Star, ArrowRight, Globe2, Sparkles } from "lucide-react"

const stats = [
  {
    value: "500+",
    label: "Igrejas & Unidades",
    icon: Church,
  },
  {
    value: "50k+",
    label: "Membros Ativos",
    icon: Users,
  },
  {
    value: "99.8%",
    label: "Presença Verificada",
    icon: Star,
  },
  {
    value: "100%",
    label: "Na Nuvem & Seguro",
    icon: Globe2,
  },
]

export function CTASection() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Signature Finnova Showcase Dark Container */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-800 bg-[#0c1222] p-8 text-white shadow-2xl shadow-primary/10 sm:p-12 lg:p-16">
          {/* Radiant Glows */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-4 py-1.5 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              Comece a Revolução na Sua Comunidade
            </span>

            <motion.h2
              className="mt-6 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Pronto para transformar a gestão e o cuidado da sua igreja?
            </motion.h2>

            <motion.p
              className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Junte-se a centenas de líderes pastorais que já organizam suas células,
              cultos e membros com mais leveza, proximidade e tecnologia.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Button
                size="lg"
                asChild
                className="h-12 rounded-full bg-white px-8 font-semibold text-slate-900 shadow-xl hover:bg-slate-100"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  Acessar Painel Kairos
                  <ArrowRight className="h-4 w-4 text-primary" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-full border-slate-700 bg-slate-800/80 px-8 text-white hover:bg-slate-700"
              >
                <Link href="#pricing">Ver Planos e Preços</Link>
              </Button>
            </motion.div>

            {/* Quick Metrics inside CTA */}
            <motion.div
              className="mt-14 border-t border-slate-800/80 pt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="flex flex-col items-center">
                      <Icon className="h-5 w-5 text-indigo-400" />
                      <p className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        {stat.value}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">{stat.label}</p>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
