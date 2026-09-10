"use client"

import Link from "next/link"
import { ArrowRight, Mail, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-20 border-t py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-hidden border-primary/20 bg-primary text-primary-foreground shadow-xl shadow-primary/10">
            <CardContent className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">Vamos conversar</p>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Sua igreja merece uma rotina mais leve.</h2>
                <p className="text-primary-foreground/80">Conte como sua equipe trabalha hoje. A gente mostra o caminho mais simples para começar.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild size="lg" className="bg-hero-accent text-hero-accent-foreground hover:bg-hero-accent/90">
                  <a href="mailto:contato@kairos.app">
                    <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                    contato@kairos.app
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  <Link href="/auth?mode=login">
                    Acessar plataforma
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <div className="hidden items-center gap-2 text-sm text-primary-foreground/70 lg:flex">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Resposta em horário comercial
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
