"use client"

import { Check } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Essencial",
    description: "Ideal para igrejas e células que querem organizar membros e presença.",
    price: "R$ 0",
    period: "para sempre grátis",
    features: ["Membros e famílias", "Agenda de cultos e eventos", "Check-in básico por lista", "Até 3 líderes na equipe"],
  },
  {
    name: "Comunidade Pro",
    description: "Para congregações em crescimento que exigem relatórios e QR check-in.",
    price: "R$ 129",
    period: "por mês",
    features: ["Tudo do Essencial", "QR Code Check-in em tempo real", "Células e pequenos grupos ilimitados", "Relatórios e inteligência de frequência", "Gestão financeira de dízimos/ofertas", "Até 15 líderes com permissões"],
    popular: true,
  },
  {
    name: "Rede & Sedes",
    description: "Para ministérios com sede e múltiplas congregações conectadas.",
    price: "Sob consulta",
    period: "plano personalizado",
    features: ["Tudo do Comunidade Pro", "Gestão multi-unidades e campus", "Painel executivo da presidência", "Suporte prioritário via WhatsApp", "Migração assistida de dados"],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-20 py-24 lg:py-32 relative overflow-hidden">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.div
          className="mx-auto max-w-2xl space-y-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">

            Planos Transparentes
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Escolha o ritmo ideal da sua comunidade
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Comece sem custo e evolua conforme o ministério cresce. Cancele quando quiser.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex"
            >
              <Card
                className={cn(
                  "relative flex flex-col justify-between w-full rounded-[2rem] border p-7 transition-all duration-300",
                  plan.popular
                    ? "border-primary bg-card shadow-xl shadow-primary/10 ring-1 ring-primary/30"
                    : "border-border/70 bg-card/60 hover:border-border hover:shadow-lg",
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground shadow-md shadow-primary/25">
                    Comunidade Pro
                  </Badge>
                )}

                <div>
                  <CardHeader className="p-0 space-y-2">
                    <CardTitle className="font-display text-xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm min-h-10 leading-relaxed">
                      {plan.description}
                    </CardDescription>

                    <div className="pt-3 pb-4 border-b border-border/60">
                      <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {plan.price}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground font-medium">
                        {plan.period}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 pt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      O que está incluso:
                    </p>
                    <ul className="space-y-2.5 text-xs sm:text-sm">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                          <span className="text-foreground/90">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>

                <CardFooter className="p-0 pt-7 mt-6">
                  <Button
                    asChild
                    className={cn(
                      "w-full h-11 rounded-full text-xs font-semibold shadow-sm transition-all",
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                        : "bg-muted text-foreground hover:bg-muted/80 border border-border/60",
                    )}
                  >
                    <Link href={plan.name === "Rede & Sedes" ? "#contact" : "/cadastro"}>
                      {plan.name === "Rede & Sedes" ? "Falar com Consultor" : "Começar Agora"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
