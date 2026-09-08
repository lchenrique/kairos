import { z } from 'zod'

export const UserRoleEnum = z.enum(['ADMIN', 'PASTOR', 'LEADER', 'SECRETARY', 'USER'])

// Schema base do usuário (com senha)
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: UserRoleEnum,
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Schema do usuário sem senha para respostas
export const userResponseSchema = userSchema.omit({ password: true })

// Schema da resposta de autenticação
export const authResponseSchema = z.object({
  user: userResponseSchema,
})

export const setupStatusSchema = z.object({
  available: z.boolean(),
})

export const initialSetupSchema = z.object({
  organizationName: z.string().trim().min(3).max(120),
  churchName: z.string().trim().min(3).max(120),
  adminName: z.string().trim().min(3).max(120),
  email: z.string().trim().toLowerCase().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  address: z.string().trim().max(240).optional(),
  phone: z.string().trim().max(30).optional(),
  timezone: z.string().trim().min(3).default('America/Sao_Paulo'),
})

// Schema de erro
export const errorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
  code: z.string(),
})

// Schema de registro
export const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

// Criação de usuários da equipe por um administrador
export const createUserSchema = registerSchema.extend({
  role: UserRoleEnum.default('USER'),
})

// Schema de login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

// Schema de alteração de senha
export const changePasswordSchema = z.object({
  current_password: z.string().min(6, 'Senha atual deve ter pelo menos 6 caracteres'),
  new_password: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
})

// Schema de solicitação de reset de senha
export const resetPasswordRequestSchema = z.object({
  email: z.string().email('Email inválido'),
})

// Schema de reset de senha
export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
})

// Tipos gerados dos schemas
export type RegisterInput = z.infer<typeof registerSchema>
export type InitialSetupInput = z.infer<typeof initialSetupSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type User = z.infer<typeof userSchema>
export type UserResponse = z.infer<typeof userResponseSchema>
export type UserRole = z.infer<typeof UserRoleEnum>
export type AuthResponse = z.infer<typeof authResponseSchema>
export type ErrorResponse = z.infer<typeof errorResponseSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
