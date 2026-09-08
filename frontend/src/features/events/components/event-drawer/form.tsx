"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  GetEvents200DataItem,
  PostEventsBody,
} from "@/lib/api/generated/model";
import { useDrawerStore } from "@/lib/stores/drawer-store";
import { useCreateEvent } from "../../hooks/use-create-event";
import { useUpdateEvent } from "../../hooks/use-update-event";
import { eventFormSchema } from "./schema";

interface EventFormProps {
  initialData?: GetEvents200DataItem;
  id?: string;
}

type FormData = z.infer<typeof eventFormSchema>;

const eventTypes = [
  { value: "SERVICE", label: "Culto" },
  { value: "CELL", label: "Célula" },
  { value: "MINISTRY", label: "Ministério" },
  { value: "OTHER", label: "Outro" },
];

const toDateTimeInput = (date?: string | null) =>
  date ? new Date(date).toISOString().slice(0, 16) : "";

const toDateInput = (date?: string | null) =>
  date ? new Date(date).toISOString().slice(0, 10) : "";

export function EventForm({ initialData, id }: EventFormProps) {
  const close = useDrawerStore((state) => state.close);
  const { mutate: createEvent, isPending: isCreating } = useCreateEvent();
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent(
    id ?? "",
  );
  const form = useForm<FormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      status: initialData?.status ?? "SCHEDULED",
      startDate: toDateTimeInput(initialData?.startDate),
      endDate: toDateTimeInput(initialData?.endDate),
      location: initialData?.location ?? "",
      type: initialData?.type ?? "OTHER",
      participants:
        initialData?.participants.map((participant) => participant.memberId) ??
        [],
      recurrenceRule: initialData?.recurrenceRule ?? null,
      recurrenceEndDate: toDateInput(initialData?.recurrenceEndDate),
      recurrenceExceptionsText:
        initialData?.recurrenceExceptions
          .map((exception) => toDateInput(exception))
          .join("\n") ?? "",
      reminderMinutes: initialData?.reminderMinutes ?? null,
    },
  });
  const recurrenceRule = form.watch("recurrenceRule");

  const onSubmit = (values: FormData) => {
    const { recurrenceExceptionsText, ...fields } = values;
    const recurrenceExceptions = recurrenceExceptionsText
      ?.split(/[\n,]/)
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => new Date(`${value}T00:00:00`).toISOString());

    const data: PostEventsBody = {
      ...fields,
      description: values.description || null,
      endDate: values.endDate || null,
      location: values.location || null,
      recurrenceEndDate:
        values.recurrenceRule && values.recurrenceEndDate
          ? new Date(`${values.recurrenceEndDate}T23:59:59.999`).toISOString()
          : null,
      recurrenceExceptions: values.recurrenceRule ? recurrenceExceptions : [],
    };

    if (initialData) updateEvent(data);
    else createEvent({ data });
    close();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Nome do evento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="O que sua equipe precisa saber?"
                  className="resize-none"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SCHEDULED">Agendado</SelectItem>
                    <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
                    <SelectItem value="COMPLETED">Concluído</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Início</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fim</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local</FormLabel>
              <FormControl>
                <Input
                  placeholder="Auditório, sala ou endereço"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="recurrenceRule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recorrência</FormLabel>
                <Select
                  value={field.value ?? "NONE"}
                  onValueChange={(value) =>
                    field.onChange(value === "NONE" ? null : value)
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NONE">Não se repete</SelectItem>
                    <SelectItem value="WEEKLY">Toda semana</SelectItem>
                    <SelectItem value="MONTHLY">Todo mês</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reminderMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lembrete</FormLabel>
                <Select
                  value={field.value ? String(field.value) : "NONE"}
                  onValueChange={(value) =>
                    field.onChange(value === "NONE" ? null : Number(value))
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NONE">Sem lembrete</SelectItem>
                    <SelectItem value="60">1 hora antes</SelectItem>
                    <SelectItem value="1440">1 dia antes</SelectItem>
                    <SelectItem value="10080">1 semana antes</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {recurrenceRule && (
          <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
            <FormField
              control={form.control}
              name="recurrenceEndDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repetir até</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recurrenceExceptionsText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Datas que não terão encontro</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={"2026-12-25\n2027-01-01"}
                      className="min-h-20 resize-y font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Use uma data por linha no formato AAAA-MM-DD.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            {initialData ? "Salvar alterações" : "Criar evento"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
