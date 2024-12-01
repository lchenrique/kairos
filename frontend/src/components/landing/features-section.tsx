"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FeatureCard } from "./feature-card"
import { Icon } from "@/components/ui/icon"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export function FeaturesSection() {
  return (
    <section className="relative py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      </div>

      <div className="container space-y-12">
        {/* Section Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Recursos para sua Igreja
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground">
            Ferramentas poderosas para fortalecer o ministério e expandir o Reino de Deus através da tecnologia.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <FeatureCard
            icon="Users"
            title="Gestão de Membros"
            description="Cadastro completo de membros, visitantes e acompanhamento pastoral personalizado."
            stats="+ 150 membros cadastrados este mês"
            color="blue"
          />
          <FeatureCard
            icon="Heart"
            title="Ministérios"
            description="Organize equipes, escalas e atividades dos ministérios com eficiência e clareza."
            stats="12 ministérios ativos"
            color="purple"
          />
          <FeatureCard
            icon="Calendar"
            title="Eventos e Cultos"
            description="Agenda integrada de cultos, células e eventos especiais com controle de presença."
            stats="48 eventos programados"
            color="orange"
          />
          <FeatureCard
            icon="BarChart"
            title="Relatórios"
            description="Estatísticas detalhadas de crescimento, frequência e desempenho ministerial."
            stats="95% de precisão nos dados"
            color="green"
          />
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            variant="ghost"
            className="group text-muted-foreground hover:text-foreground"
            onClick={() => window.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' })}
          >
            Ver mais recursos
            <Icon name="ChevronDown" className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}