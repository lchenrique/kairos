import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Importante para enviar cookies
})

function getToken() {
  try {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1]
  } catch {
    return null
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    console.log('Token na requisição:', !!token)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Resposta bem sucedida:', response.config.url)
    return response.data
  },
  (error) => {
    console.error('Erro na requisição:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message
    })
    return Promise.reject(error)
  }
)

export const customInstance = <T>({
  url,
  method,
  params,
  data,
  ...rest
}: Parameters<typeof axiosInstance.request>[0]) => {
  return axiosInstance.request<any, T>({
    url,
    method,
    params,
    data,
    ...rest,
  })
}
