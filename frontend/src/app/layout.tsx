import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { QueryProvider } from "@/lib/api/query-client"
import { Providers } from '@/components/providers/providers'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kairos",
  description: "Sistema de Gestão para Igrejas",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <QueryProvider>
          <Providers>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </Providers>
        </QueryProvider>
      </body>
    </html>
  )
}