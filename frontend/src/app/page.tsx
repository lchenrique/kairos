"use client"

import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { AdditionalFeatures } from "@/components/landing/additional-features"
import { CTASection } from "@/components/landing/cta-section"
import { Church, Github, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <motion.header 
        className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container flex h-16 items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Church className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Kairos
            </h1>
          </motion.div>

          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Navigation - Hidden on Mobile */}
            <motion.nav 
              className="hidden md:flex items-center gap-4 mr-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link 
                href="#features" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Recursos
              </Link>
              <Link 
                href="#pricing" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Preços
              </Link>
              <Link 
                href="#about" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Sobre
              </Link>
              <Link 
                href="#contact" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Contato
              </Link>
            </motion.nav>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Alternar tema</span>
            </Button>
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link href="https://github.com">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <main className="flex-1">
        <HeroSection />
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <FeaturesSection />
        </div>
        <AdditionalFeatures />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}