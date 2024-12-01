"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Church, Users, Star, ChevronRight, Globe2 } from "lucide-react"

const stats = [
  {
    value: "500+",
    label: "Igrejas",
    icon: Church,
  },
  {
    value: "50k+",
    label: "Membros",
    icon: Users,
  },
  {
    value: "4.9",
    label: "Avaliação",
    icon: Star,
  },
  {
    value: "12+",
    label: "Países",
    icon: Globe2,
  },
]

export function CTASection() {
  return (
    <section className="relative border-t">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5" />
      
      <div className="container relative">
        <div className="py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <motion.h2
                className="text-4xl font-bold tracking-tighter sm:text-5xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Transforme sua Igreja com{" "}
                <span className="text-primary">Kairos</span>
              </motion.h2>
              <motion.p
                className="mt-6 text-lg leading-8 text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Junte-se a centenas de igrejas que já utilizam o Kairos para
                fortalecer sua gestão ministerial e impactar mais vidas.
              </motion.p>
              <motion.div
                className="mt-10 flex items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Button size="lg" asChild className="group">
                  <Link href="/signup">
                    Começar Gratuitamente
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Falar com Consultor</Link>
                </Button>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              className="mt-16 sm:mt-24"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      className="flex flex-col items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="h-6 w-6 text-primary" />
                      <dt className="text-sm leading-6 text-muted-foreground">
                        {stat.label}
                      </dt>
                      <dd className="text-3xl font-semibold tracking-tight">
                        {stat.value}
                      </dd>
                    </motion.div>
                  )
                })}
              </dl>
            </motion.div>

            {/* Testimonial */}
            <motion.div
              className="mt-16 sm:mt-24 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <figure className="relative">
                {/* Quote marks decoration */}
                <svg
                  className="absolute -top-12 -left-12 h-24 w-24 text-primary/10"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                
                <div className="relative border bg-card/50 rounded-2xl p-10">
                  <blockquote className="text-center">
                    <p className="text-xl font-medium leading-8 text-card-foreground sm:text-2xl sm:leading-9">
                      "O Kairos revolucionou a forma como gerenciamos nossa igreja. 
                      <span className="block mt-2">
                        Agora temos mais tempo para focar no que realmente importa: as pessoas."
                      </span>
                    </p>
                  </blockquote>
                  <figcaption className="mt-8 flex items-center justify-center gap-x-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Church className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div className="text-base">
                      <div className="font-semibold text-card-foreground">Pastor João Silva</div>
                      <div className="mt-1 text-sm text-muted-foreground">Igreja Vida Nova • São Paulo, SP</div>
                    </div>
                  </figcaption>
                </div>
              </figure>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}