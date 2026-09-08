"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import { groupFormSchema } from "./schema"
import type { GetGroups200DataItem } from "@/lib/api/generated/model"
import { useCreateGroup } from "../../hooks/use-create-group"
import { useUpdateGroup } from "../../hooks/use-update-group"
import type { z } from "zod"

interface GroupFormProps {
  initialData?: GetGroups200DataItem
  id?: string
}

type FormData = z.infer<typeof groupFormSchema>

export function GroupForm({ initialData, id }: GroupFormProps) {
  const close = useDrawerStore((state) => state.close)
  const { mutateAsync: createGroup, isPending: isCreating } = useCreateGroup()
  const { mutateAsync: updateGroup, isPending: isUpdating } = useUpdateGroup(id ?? "")

  const form = useForm<FormData>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      type: initialData?.type ?? "CELL",
      meetingDay: initialData?.meetingDay ?? "",
      startTime: initialData?.startTime ?? "",
      endTime: initialData?.endTime ?? "",
      location: initialData?.location ?? "",
    },
  })

  const onSubmit = async (data: FormData) => {
    const normalizedData = {
      ...data,
      description: data.description || undefined,
      meetingDay: data.meetingDay || undefined,
      startTime: data.startTime || undefined,
      endTime: data.endTime || undefined,
      location: data.location || undefined,
    }

    try {
      if (initialData) {
        await updateGroup(normalizedData)
      } else {
        await createGroup({ data: normalizedData })
      }
      close()
    } catch {
      // O hook mantém o formulário aberto e apresenta o erro ao usuário.
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do grupo" {...field} />
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
                  placeholder="Descrição do grupo"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de grupo</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger aria-label="Tipo de grupo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CELL">Célula</SelectItem>
                  <SelectItem value="MINISTRY">Ministério</SelectItem>
                  <SelectItem value="DEPARTMENT">Departamento</SelectItem>
                  <SelectItem value="OTHER">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meetingDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dia da reunião</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Segunda-feira" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Início</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fim</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Sala 101" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            {initialData ? "Salvar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
