import { create } from "zustand"
import { ReactNode } from "react"

interface DrawerStore {
  isOpen: boolean
  title: string
  subtitle?: string
  content: ReactNode | null
  open: (data: { title: string; subtitle?: string; content: ReactNode }) => void
  close: () => void
}

export const useDrawerStore = create<DrawerStore>((set) => ({
  isOpen: false,
  title: "",
  subtitle: undefined,
  content: null,
  open: (data) =>
    set({
      isOpen: true,
      title: data.title,
      subtitle: data.subtitle,
      content: data.content,
    }),
  close: () =>
    set({
      isOpen: false,
      title: "",
      subtitle: undefined,
      content: null,
    }),
}))
