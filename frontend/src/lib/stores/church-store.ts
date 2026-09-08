import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ChurchState {
  activeChurchId: string | null
  setActiveChurchId: (churchId: string) => void
  clearActiveChurch: () => void
}

export const useChurchStore = create<ChurchState>()(
  persist(
    (set) => ({
      activeChurchId: null,
      setActiveChurchId: (activeChurchId) => set({ activeChurchId }),
      clearActiveChurch: () => set({ activeChurchId: null }),
    }),
    { name: 'kairos-church-context' },
  ),
)

