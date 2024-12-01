"use client"

import { motion } from "framer-motion"
import { BookOpen, Heart, HandHeart, Users, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function AdditionalFeatures() {
  return (
    <section className="relative py-32">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container relative space-y-16">
        {/* Section Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Recursos que Transformam
          </h2>
          <p className="text-muted-foreground max-w-[600px] mx-auto">
            Ferramentas poderosas projetadas para impactar vidas e fortalecer sua igreja
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={item}>
            <div className="group relative overflow-hidden rounded-2xl border bg-background p-6 hover:border-primary transition-colors h-[280px] flex flex-col">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-primary/10 p-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Escola Bíblica</h3>
              </div>
              <p className="mt-3 text-muted-foreground flex-1">
                Gestão completa da Escola Bíblica Dominical com acompanhamento de frequência e progresso dos alunos.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">2.5k+ alunos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-muted-foreground">4.9/5</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="group relative overflow-hidden rounded-2xl border bg-background p-6 hover:border-primary transition-colors h-[280px] flex flex-col">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Células e Pequenos Grupos</h3>
              </div>
              <p className="mt-3 text-muted-foreground flex-1">
                Sistema inteligente para gestão de células, com relatórios de crescimento e acompanhamento pastoral.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">150+ células</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-muted-foreground">4.8/5</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="group relative overflow-hidden rounded-2xl border bg-background p-6 hover:border-primary transition-colors h-[280px] flex flex-col">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-primary/10 p-3">
                  <HandHeart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Ação Social</h3>
              </div>
              <p className="mt-3 text-muted-foreground flex-1">
                Gerencie projetos sociais, doações e voluntários com eficiência e transparência.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">500+ vidas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-muted-foreground">5.0/5</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Button asChild className="group">
            <Link href="/signup">
              Começar Agora
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}