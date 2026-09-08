"use client"

import { Check } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Essencial",
    description: "Para comunidades que estão organizando a rotina.",
    price: "R$ 0",
    period: "para começar",
    features: ["Membros e grupos", "Agenda de encontros", "Acesso para até 3 pessoas"],
  },
  {
    name: "Comunidade",
    description: "Para equipes que querem acompanhar tudo com mais clareza.",
    price: "R$ 129",
    period: "por mês",
    features: ["Tudo do Essencial", "Financeiro e relatórios", "Check-in e equipe", "Acesso para até 15 pessoas"],
    popular: true,
  },
  {
    name: "Rede",
    description: "Para igrejas com sede e várias unidades conectadas.",
    price: "Sob consulta",
    period: "plano personalizado",
    features: ["Tudo do Comunidade", "Visão consolidada da rede", "Unidades e permissões por equipe", "Onboarding acompanhado"],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-20 border-y bg-muted/25 py-24">
      <div className="container space-y-12">
        <motion.div
          className="mx-auto max-w-2xl space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Preços claros</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Escolha o ritmo da sua comunidade</h2>
          <p className="text-muted-foreground">Comece sem complicação e avance quando sua equipe precisar de mais recursos.</p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className={plan.popular ? "relative h-full border-primary shadow-lg shadow-primary/10" : "relative h-full"}>
                {plan.popular && <Badge className="absolute right-5 top-5">Mais escolhido</Badge>}
                <CardHeader className="space-y-3">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="min-h-10">{plan.description}</CardDescription>
                  <div className="pt-2">
                    <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
                    <span className="ml-2 text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                    <Link href={plan.name === "Rede" ? "#contact" : "/login"}>
                      {plan.name === "Rede" ? "Falar com a equipe" : "Começar agora"}
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
