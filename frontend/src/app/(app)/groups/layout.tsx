import type { ReactNode } from "react"

export default function GroupsLayout({ children }: { children: ReactNode }) {
  return <div className="flex-1">{children}</div>
}
