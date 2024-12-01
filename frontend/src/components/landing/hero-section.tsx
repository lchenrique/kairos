"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { 
  ArrowRight, 
  PlayCircle, 
  Users2, 
  Calendar, 
  ChevronDown, 
  Target,
  Heart,
  BookOpen,
  Home
} from "lucide-react"
import { useRef } from "react"

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <motion.section 
      ref={ref}
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?auto=format&fit=crop&q=80"
          alt="Igreja Background"
          fill
          className="object-cover brightness-[0.2]"
          priority
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background z-[1]" />

      {/* Content */}
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-[1fr,1.1fr] gap-16 items-center">
          <motion.div 
            className="space-y-10 text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                <span className="px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium">
                  Sistema de Gestão Ministerial
                </span>
              </motion.div>

              <motion.h1 
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Transforme a gestão da sua
                <span className="block mt-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Igreja Digital
                </span>
              </motion.h1>

              <motion.p 
                className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Simplifique a administração da sua igreja com uma plataforma moderna
                e intuitiva para gestão de membros, ministérios e eventos.
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button size="lg" className="group" asChild>
                <Link href="/login">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group">
                <PlayCircle className="mr-2 h-4 w-4" />
                Ver Demo
              </Button>
            </motion.div>

            <motion.div
              className="flex items-center gap-8 justify-center lg:justify-start text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-muted-foreground">Igrejas Ativas</div>
              </div>
              <div className="h-12 w-[1px] bg-border" />
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">50k+</div>
                <div className="text-muted-foreground">Membros</div>
              </div>
              <div className="h-12 w-[1px] bg-border" />
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">99%</div>
                <div className="text-muted-foreground">Satisfação</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative lg:ml-auto hidden lg:block w-full max-w-5xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative aspect-[16/9] rounded-xl border shadow-2xl bg-primary">
              <Image
                src="/dashboard-exemple.png"
                alt="Dashboard Preview"
                fill
                className="object-contain rounded-xl"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent rounded-xl" />
            </div>
              
            {/* Floating Cards */}
            <motion.div 
              className="absolute -right-10 top-12 p-4 rounded-xl bg-card border shadow-lg"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Novos Membros</div>
                  <div className="text-2xl font-bold text-primary">+28%</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -left-10 top-12 p-4 rounded-xl bg-card border shadow-lg"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Eventos do Mês</div>
                  <div className="text-2xl font-bold text-primary">48</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute left-1/2 -translate-x-1/2 -bottom-6 p-4 rounded-xl bg-card border shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Meta Mensal</div>
                  <div className="text-2xl font-bold text-primary">95%</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-50"
        initial={{ y: 0 }}
        animate={{ y: 10 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          })
        }}
      >
        <div className="p-4 hover:opacity-70 transition-opacity">
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </motion.div>
    </motion.section>
  )
}