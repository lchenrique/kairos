import { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Login | Kairos",
  description: "Faça login no sistema"
}

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children
}
