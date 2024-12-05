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
import { useDrawerStore } from "@/store/use-drawer-store"
import { groupFormSchema } from "./schema"
import type { GetGroups200GroupsItem } from "@/lib/api/generated/model"
import { useCreateGroup } from "../../hooks/use-create-group"
import { useUpdateGroup } from "../../hooks/use-update-group"
import type { z } from "zod"

interface GroupFormProps {
  initialData?: GetGroups200GroupsItem
  id?: string
}

type FormData = z.infer<typeof groupFormSchema>

export function GroupForm({ initialData, id }: GroupFormProps) {
  const close = useDrawerStore((state) => state.close)
  const { mutate: createGroup, isPending: isCreating } = useCreateGroup()
  const { mutate: updateGroup, isPending: isUpdating } = useUpdateGroup(id ?? "")

  const form = useForm<FormData>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      status: initialData?.status ?? "ACTIVE",
      meetingDay: initialData?.meetingDay ?? "",
      meetingTime: initialData?.meetingTime ?? "",
      meetingLocation: initialData?.meetingLocation ?? "",
      leader: initialData?.leader ?? "",
    },
  })

  const onSubmit = (data: FormData) => {
    if (initialData) {
      updateGroup(data)
    } else {
      createGroup(data)
    }
    close()
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="INACTIVE">Inativo</SelectItem>
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
          name="meetingTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horário da reunião</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 19:30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meetingLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local da reunião</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Sala 101" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leader"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Líder</FormLabel>
              <FormControl>
                <Input placeholder="Nome do líder" {...field} />
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
