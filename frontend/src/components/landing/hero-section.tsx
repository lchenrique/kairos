"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  MapPin,
  QrCode,
  Sparkles,
  TrendingUp,
  Users2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-6 pb-20 sm:pb-28 lg:pt-12 lg:pb-32">
      {/* Radiant ambient glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-40 -z-10 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" aria-hidden="true" />
            <span>Nova Identidade Kairos · Finnova Design</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-6 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]"
          >
            O ritmo que sua igreja precisa.
            <span className="block mt-2 bg-gradient-to-r from-primary via-indigo-500 to-accent bg-clip-text text-transparent">
              O cuidado que sua comunidade merece.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed"
          >
            Cultos, células, membros e presenças em tempo real. Deixe as planilhas e mensagens
            dispersas no passado com um dashboard inteligente, ágil e acolhedor.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-12 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
              asChild
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                Abrir Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-border/80 bg-card/80 px-8 text-sm font-semibold backdrop-blur-sm hover:bg-muted"
              asChild
            >
              <Link href="/login">Fazer Login</Link>
            </Button>
          </motion.div>

          {/* Social Proof Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>+15.000 Vidas Acompanhadas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>98.4% Presença Confirmada</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Zero Ruído Operacional</span>
            </div>
          </motion.div>
        </div>

        {/* FINNOVA LIVE DASHBOARD HERO MOCKUP */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative mx-auto mt-14 max-w-5xl"
        >
          {/* Outer glow frame */}
          <div className="relative overflow-hidden rounded-[2.2rem] border border-border/70 bg-card/70 p-3 shadow-2xl shadow-primary/10 backdrop-blur-xl sm:p-5">
            {/* Top Mockup Header Bar */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                  kairos.app/dashboard · Finnova Pulse
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ao Vivo
                </span>
              </div>
            </div>

            {/* Mockup Dashboard Content Grid */}
            <div className="mt-4 space-y-4">
              {/* 3 Mini KPI Cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Membros Ativos
                    </span>
                    <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                      <Users2 className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-display text-2xl font-bold">1.284</span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                      +14.2%
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">Engajados este mês</p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Taxa de Presença
                    </span>
                    <div className="rounded-lg bg-indigo-500/10 p-1.5 text-indigo-600">
                      <TrendingUp className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-display text-2xl font-bold">94.8%</span>
                    <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                      Alta adesão
                    </span>
                  </div>
                  <div className="mt-2 flex items-end gap-1 h-3">
                    {[30, 45, 60, 80, 50, 95, 85].map((v, i) => (
                      <div
                        key={i}
                        style={{ height: `${v}%` }}
                        className={`flex-1 rounded-t-xs ${i === 5 ? "bg-primary" : "bg-primary/20"}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Células & Grupos
                    </span>
                    <div className="rounded-lg bg-accent/10 p-1.5 text-accent">
                      <Layers className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-display text-2xl font-bold">42 Ativas</span>
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                      Em ritmo
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">100% com relatórios</p>
                </div>
              </div>

              {/* Finnova Signature Dark Spotlight Bar inside Mockup */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0c1222] p-4 text-slate-100 sm:p-5 shadow-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-indigo-400/30 bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                        #CLT-DOMINGO
                      </span>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                        Culto de Celebração
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold text-white sm:text-lg">
                      Celebração & Ceia Comunitária
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-primary" />
                        Hoje · 19:30
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" />
                        Templo Sede
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right sm:block hidden">
                      <p className="font-display text-lg font-bold text-white">184 / 200</p>
                      <p className="text-[10px] text-emerald-400">92% presenças</p>
                    </div>
                    <Button
                      size="sm"
                      className="rounded-full bg-white px-5 text-xs font-semibold text-slate-900 shadow-md hover:bg-slate-100"
                      asChild
                    >
                      <Link href="/dashboard">
                        <QrCode className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        Check-in
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Pill Micro-Badges */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -left-4 hidden sm:flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card p-3 shadow-xl backdrop-blur-md"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">+48 Check-ins</p>
              <p className="text-[10px] text-muted-foreground">Nos últimos 15 minutos</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-5 -right-4 hidden sm:flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card p-3 shadow-xl backdrop-blur-md"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Célula Ágape</p>
              <p className="text-[10px] text-muted-foreground">100% de frequência confirmada</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
