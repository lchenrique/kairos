import { z } from "zod";

export const eventFormSchema = z
  .object({
    title: z.string().min(3, "O título deve ter no mínimo 3 caracteres"),
    description: z.string().nullable().optional(),
    status: z
      .enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
      .optional(),
    startDate: z.string().min(1, "Informe a data de início"),
    endDate: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    participants: z.array(z.string()).optional(),
    recurrenceRule: z.enum(["WEEKLY", "MONTHLY"]).nullable().optional(),
    recurrenceEndDate: z.string().nullable().optional(),
    recurrenceExceptionsText: z.string().optional(),
    reminderMinutes: z.coerce.number().int().positive().nullable().optional(),
    type: z.enum(["SERVICE", "CELL", "MINISTRY", "OTHER"]),
  })
  .superRefine((data, context) => {
    if (data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "O fim deve ser posterior ao início",
      });
    }
    if (data.recurrenceRule && !data.recurrenceEndDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["recurrenceEndDate"],
        message: "Informe quando a série termina",
      });
    }
    if (
      data.recurrenceEndDate &&
      new Date(data.startDate) >
        new Date(`${data.recurrenceEndDate}T23:59:59.999`)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["recurrenceEndDate"],
        message: "O fim da série deve ser posterior ao início",
      });
    }
    const exceptions = data.recurrenceExceptionsText
      ?.split(/[\n,]/)
      .map((value) => value.trim())
      .filter(Boolean);
    if (
      exceptions?.some(
        (value) =>
          !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
          Number.isNaN(Date.parse(`${value}T00:00:00`)),
      )
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["recurrenceExceptionsText"],
        message: "Use datas válidas no formato AAAA-MM-DD",
      });
    }
  });
