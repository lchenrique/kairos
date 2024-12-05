import { useAuthStore } from "@/lib/stores/auth-store"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function useAuth() {
  const router = useRouter()
  const { user, token, logout } = useAuthStore()

  const signOut = useCallback(() => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    logout()
    router.push("/login")
  }, [router, logout])

  return {
    user,
    token,
    isAuthenticated: !!token,
    signOut
  }
}
