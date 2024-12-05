import { z } from "zod"

export const eventFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  startDate: z.string(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  organizer: z.string().optional(),
  maxParticipants: z.number().optional(),
  type: z.enum(["WORSHIP", "PRAYER", "STUDY", "FELLOWSHIP", "OTHER"]),
  notes: z.string().optional(),
})
