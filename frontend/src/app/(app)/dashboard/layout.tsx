'use client'

import { type ReactNode } from "react"

interface MembersLayoutProps {
  children: ReactNode
}

function DahsboardLayout({ children }: MembersLayoutProps) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {children}
    </div>
  )
}

export default DahsboardLayout
