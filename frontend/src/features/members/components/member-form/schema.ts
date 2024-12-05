import * as z from "zod"

const dateSchema = z.string().refine((date) => {
  if (!date) return true
  const parsedDate = new Date(date)
  return !isNaN(parsedDate.getTime())
}, {
  message: "Data inválida"
}).nullable()

const birthDateSchema = dateSchema.refine((date) => {
  if (!date) return true
  const parsedDate = new Date(date)
  const now = new Date()
  return parsedDate <= now
}, {
  message: "A data de nascimento não pode ser no futuro"
})

const baptismDateSchema = dateSchema.refine((date) => {
  if (!date) return true
  const parsedDate = new Date(date)
  const now = new Date()
  return parsedDate <= now
}, {
  message: "A data de batismo não pode ser no futuro"
})

export const memberFormSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }).nullable(),
  phone: z.string().nullable(),
  birthDate: birthDateSchema,
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  baptismDate: baptismDateSchema,
  address: z.string().nullable(),
  notes: z.string().optional(),
  image: z.string().optional(),
})
