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
    description: "Para uma igreja que quer trocar planilhas por uma rotina simples e organizada.",
    price: "R$ 49",
    period: "por mês",
    features: ["1 igreja", "Membros, grupos e eventos", "Presença e calendário", "Equipe com permissões"],
  },
  {
    name: "Comunidade",
    description: "Para redes, sedes e congregações que precisam enxergar tudo sem misturar dados.",
    price: "R$ 99",
    period: "por mês",
    features: ["Tudo do Essencial", "Igrejas e unidades ilimitadas", "Visão consolidada da rede", "Relatórios e financeiro", "Permissões por unidade"],
    popular: true,
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

            Dois planos. Sem versão gratuita.
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Escolha o ritmo ideal da sua comunidade
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Crie sua conta, conheça o produto e ative a comunidade quando estiver pronto para usar dados reais.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2 items-stretch max-w-4xl mx-auto">
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
                    Para redes e sedes
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
                    <Link href="/auth?mode=signup">
                      Criar conta
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
