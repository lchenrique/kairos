import { z } from 'zod'

// Schema base do usuário (com senha)
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

// Schema do usuário sem senha para respostas
export const userResponseSchema = userSchema.omit({ password: true })

// Schema da resposta de autenticação
export const authResponseSchema = z.object({
  token: z.string(),
  user: userResponseSchema
})

// Schema de erro
export const errorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
  code: z.string()
})

// Schema de registro
export const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
})

// Schema de login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
})

// Schema de alteração de senha
export const changePasswordSchema = z.object({
  current_password: z.string().min(6, 'Senha atual deve ter pelo menos 6 caracteres'),
  new_password: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres')
})

// Schema de solicitação de reset de senha
export const resetPasswordRequestSchema = z.object({
  email: z.string().email('Email inválido')
})

// Schema de reset de senha
export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres')
})

// Tipos gerados dos schemas
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type User = z.infer<typeof userSchema>
export type UserResponse = z.infer<typeof userResponseSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
export type ErrorResponse = z.infer<typeof errorResponseSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
