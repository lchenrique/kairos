import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setAuthCookie, removeAuthCookie } from '@/lib/utils/cookies'

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        setAuthCookie(token)
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        removeAuthCookie()
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)