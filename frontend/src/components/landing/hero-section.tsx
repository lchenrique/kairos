"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Check, Target, Users2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero text-hero-foreground">
      <div className="paper-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border-[48px] border-accent/25" aria-hidden="true" />
      <div className="container relative grid min-h-[calc(100svh-4rem)] items-center gap-10 py-12 sm:py-14 lg:grid-cols-[0.95fr,1.05fr] lg:gap-12 lg:py-12 xl:py-14">
        <motion.div className="max-w-2xl space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-hero-border/20 bg-hero-foreground/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-hero-foreground/80"><span className="h-1.5 w-1.5 rounded-full bg-hero-accent" aria-hidden="true" />Sistema de cuidado comunitário</span>
            <h1 className="font-display text-4xl font-medium leading-[0.98] tracking-tight text-hero-foreground sm:text-5xl lg:text-6xl">Mais tempo para cuidar.<span className="mt-2 block text-hero-accent">Menos tempo procurando.</span></h1>
            <p className="max-w-xl text-sm leading-6 text-hero-muted sm:text-base">Membros, grupos, encontros e decisões importantes em um só lugar, com clareza para quem conduz e acolhimento para quem participa.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row"><Button size="lg" className="group bg-hero-accent text-hero-accent-foreground hover:bg-hero-accent/90" asChild><Link href="/login">Conhecer o Kairos<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link></Button><Button size="lg" variant="outline" className="border-hero-border/25 bg-transparent text-hero-foreground hover:bg-hero-foreground/10 hover:text-hero-foreground" asChild><Link href="#features">Ver como funciona</Link></Button></div>
          <div className="grid max-w-md grid-cols-3 gap-4 border-t border-hero-border/15 pt-6"><div><p className="font-display text-3xl font-medium">01</p><p className="mt-1 text-xs leading-5 text-hero-muted/75">Uma visão da semana</p></div><div><p className="font-display text-3xl font-medium">02</p><p className="mt-1 text-xs leading-5 text-hero-muted/75">Ações sem ruído</p></div><div><p className="font-display text-3xl font-medium">03</p><p className="mt-1 text-xs leading-5 text-hero-muted/75">Pessoas no centro</p></div></div>
        </motion.div>

        <motion.div className="relative lg:ml-auto lg:w-full lg:max-w-xl" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.12 }}>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-hero-border/20 bg-background p-2 shadow-2xl shadow-black/25 sm:p-3"><div className="flex items-center justify-between border-b border-border/70 px-3 pb-3 pt-1"><div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-accent" /><span className="h-2.5 w-2.5 rounded-full bg-primary/40" /><span className="h-2.5 w-2.5 rounded-full bg-foreground/15" /></div><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">kairos / visão geral</span></div><div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted"><Image src="/dashboard-exemple.png" alt="Prévia do painel Kairos" fill className="object-cover object-left-top" priority /></div></div>
          <div className="absolute -left-4 top-16 hidden items-center gap-3 rounded-2xl border border-background/15 bg-card p-3 text-card-foreground shadow-xl sm:flex xl:-left-10"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Users2 className="h-5 w-5" aria-hidden="true" /></div><div><p className="text-xs text-muted-foreground">Pessoas acompanhadas</p><p className="font-display text-2xl font-semibold">+28%</p></div></div>
          <div className="absolute -right-4 bottom-10 hidden items-center gap-3 rounded-2xl border border-background/15 bg-card p-3 text-card-foreground shadow-xl sm:flex xl:-right-10"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent-foreground"><Calendar className="h-5 w-5" aria-hidden="true" /></div><div><p className="text-xs text-muted-foreground">Próximo encontro</p><p className="font-display text-lg font-semibold">Domingo · 10h</p></div></div>
          <div className="absolute -bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-background/15 bg-card px-4 py-2 text-card-foreground shadow-xl sm:flex"><Check className="h-4 w-4 text-primary" aria-hidden="true" /><span className="text-xs font-semibold">Tudo que importa, em ritmo</span><Target className="h-4 w-4 text-accent" aria-hidden="true" /></div>
        </motion.div>
      </div>
    </section>
  )
}
