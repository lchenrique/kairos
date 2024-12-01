"use client"

import { motion } from "framer-motion"
import { Church, Facebook, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"

const navigation = {
  links: [
    { name: 'Recursos', href: '/recursos' },
    { name: 'Preços', href: '/precos' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Contato', href: '/contato' },
  ],
  social: [
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      icon: Facebook,
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: Instagram,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: Linkedin,
    },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="container py-16">
        <div className="flex flex-col items-center gap-8">
          {/* Brand */}
          <motion.div
            className="flex items-center gap-2 text-primary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Church className="h-6 w-6" />
            <span className="text-2xl font-bold">Kairos</span>
          </motion.div>

          {/* Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {navigation.links.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Social */}
          <motion.div
            className="flex space-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {navigation.social.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <Icon className="h-5 w-5" />
                </Link>
              )
            })}
          </motion.div>

          {/* Copyright */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Kairos. Todos os direitos reservados.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
