'use client'

import { type ReactNode } from "react"

interface MembersLayoutProps {
  children: ReactNode
}

function DahsboardLayout({ children }: MembersLayoutProps) {
  return (
    <div className="flex-1">
      {children}
    </div>
  )
}

export default DahsboardLayout
