import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations/pt-BR";
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { QueryProvider } from "@/lib/api/query-client"
import { Providers } from '@/components/providers/providers'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Kairos | cuidado que continua",
    template: "%s | Kairos",
  },
  description: "Uma plataforma simples para cuidar melhor da sua comunidade.",
  icons: {
    icon: "/brand/kairos-mark.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ClerkProvider localization={ptBR}>
          <QueryProvider>
            <Providers>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </Providers>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
