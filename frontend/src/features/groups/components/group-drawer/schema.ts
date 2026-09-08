import { z } from "zod"

export const groupFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  type: z.enum(["CELL", "MINISTRY", "DEPARTMENT", "OTHER"]),
  meetingDay: z.string().optional(),
  startTime: z.string().regex(/^$|^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Use o formato HH:mm").optional(),
  endTime: z.string().regex(/^$|^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Use o formato HH:mm").optional(),
  location: z.string().optional(),
})
