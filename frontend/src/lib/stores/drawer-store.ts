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

export const useDrawerStore = create<DrawerStore>((set, get) => ({
  isOpen: false,
  title: "",
  subtitle: undefined,
  content: null,
  open: (data) => {
    // Se já estiver aberto, fecha primeiro
    const currentState = get()
    if (currentState.isOpen) {
      set({
        isOpen: false,
        title: "",
        subtitle: undefined,
        content: null
      })
    }

    // Pequeno delay para garantir que o drawer anterior feche
    setTimeout(() => {
      set({
        isOpen: true,
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
      })
    }, 50)
  },
  close: () =>
    set({
      isOpen: false,
      title: "",
      subtitle: undefined,
      content: null,
    }),
}))
