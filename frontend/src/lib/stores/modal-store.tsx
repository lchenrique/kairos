import { create } from "zustand"
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"

interface ModalStore {
  isOpen: boolean
  title: string
  subtitle?: string
  content: ReactNode | null
  open: (data: { title: string; subtitle?: string; content: ReactNode }) => void
  close: () => void
  confirm: (data: {
    title: string
    subtitle?: string
    confirmText?: string
    cancelText?: string
    variant?: 'default' | 'destructive'
    onConfirm: () => void
    onCancel?: () => void
    loading?: boolean
  }) => void
}

export const useModalStore = create<ModalStore>((set, get) => ({
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
  confirm: ({
    title,
    subtitle,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'default',
    onConfirm,
    onCancel,
    loading = false,
  }) => {
    const close = get().close
    get().open({
      title,
      subtitle,
      content: (
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onCancel?.()
              close()
            }}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={() => {
              onConfirm()
            }}
            disabled={loading}
          >
            {loading ? "Carregando..." : confirmText}
          </Button>
        </DialogFooter>
      ),
    })
  },
}))
