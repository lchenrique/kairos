import { z } from "zod"

export const groupFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  meetingDay: z.string().optional(),
  meetingTime: z.string().optional(),
  meetingLocation: z.string().optional(),
  leader: z.string().optional(),
})
