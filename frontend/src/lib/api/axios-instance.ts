import axios, { AxiosRequestConfig } from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333',
})

// Função para pegar o valor de um cookie pelo nome
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

// Adiciona o token de autenticação em todas as requisições
axiosInstance.interceptors.request.use((config) => {
  const token = getCookie('token')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// Intercepta todas as respostas e retorna apenas o data
axiosInstance.interceptors.response.use(
  (response) => response.data
)

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance(config)
}
