import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'
import { usePostAuthLogin, usePostAuthLogout } from '@/lib/api/generated/auth/auth'
import type { PostAuthLogin200User } from '@/lib/api/generated/model'

// Função para converter o usuário da API para o formato do store
function mapApiUserToStoreUser(apiUser: PostAuthLogin200User) {
  if (!apiUser.id || !apiUser.name || !apiUser.email) {
    throw new Error('Dados do usuário incompletos')
  }

  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
  }
}

export function useAuth() {
  const router = useRouter()
  const { login: setAuth, logout: clearAuth } = useAuthStore()

  const { mutateAsync: loginMutation } = usePostAuthLogin({
    mutation: {
      onError: () => {
        toast.error('Erro ao realizar login. Verifique suas credenciais.')
      }
    }
  })

  const { mutateAsync: logoutMutation } = usePostAuthLogout({
    mutation: {
      onError: () => {
        toast.error('Erro ao realizar logout')
      }
    }
  })

  const login = async (email: string, password: string) => {
    try {
      const response = await loginMutation({ data: { email, password }})
      
      if (!response.user) {
        throw new Error('Usuário não encontrado')
      }

      const user = mapApiUserToStoreUser(response.user)
      setAuth(user, response.token!)
      router.push('/dashboard')
      toast.success('Login realizado com sucesso!')
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutMutation()
      clearAuth()
      router.push('/login')
      toast.success('Logout realizado com sucesso!')
    } catch (error) {
      throw error
    }
  }

  return { login, logout }
}