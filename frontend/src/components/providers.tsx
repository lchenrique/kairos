"use client"

import { Drawer } from "@/components/ui/drawer"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Drawer />
    </>
  )
}
