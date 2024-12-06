"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DatePickerInput } from "@/components/ui/date-picker"
import { ImageUpload } from "@/components/ui/image-upload"
import { Textarea } from "@/components/ui/textarea"
import { MaskedInput } from "@/components/ui/masked-input"
import { Loader2 } from "lucide-react"
import type { GetMembers200DataItem, PostMembersBody } from "@/lib/api/generated/model"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import { memberFormSchema } from "./schema"
import { useCreateMember } from "../../hooks/use-create-member"
import { useUpdateMember } from "../../hooks/use-update-member"
import { CalendarDate, parseDate } from "@internationalized/date"
import { useQueryClient } from "@tanstack/react-query"
import { getGetMembersQueryKey } from "@/lib/api/generated/members/members"

interface MemberFormProps {
  initialData?: GetMembers200DataItem
  id?: string

}

export function MemberForm({ initialData, id }: MemberFormProps) {
  const queryClient = useQueryClient()

  const closeDrawer = useDrawerStore((state) => state.close)
  const createMember = useCreateMember()
  const updateMember = useUpdateMember()

  console.log(initialData)

  const form = useForm<PostMembersBody>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: initialData?.name,
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      status: initialData?.status ?? "ACTIVE",
      address: initialData?.address ?? "",
      notes: initialData?.notes ?? "",
      image: initialData?.image ?? "",
      birthDate: initialData?.birthDate ?? "",
      baptismDate: initialData?.baptismDate ?? "",
    },
  })

  const onSubmit = async (values: PostMembersBody) => {
    try {
      if (initialData) {
        await updateMember.mutateAsync({
          id: initialData.id,
          data: values
        })
      } else {
        await createMember.mutateAsync({
          data: values
        })
      }

      await queryClient.invalidateQueries({ queryKey: getGetMembersQueryKey() })
    
      closeDrawer()
    } catch {
      // Error já é tratado nos hooks
    }
  }

  const isLoading = createMember.isPending || updateMember.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormControl>
                <ImageUpload
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  onRemove={() => field.onChange(null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do membro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@exemplo.com"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <MaskedInput
                    mask="(00) 00000-0000"
                    placeholder="(00) 00000-0000"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <DatePickerInput
                    value={field.value ? parseDate(field.value.split('T')[0]) : undefined}
                    onChange={(date) => {
                      if (date instanceof CalendarDate) {
                        const isoDate = new Date(date.year, date.month - 1, date.day).toISOString()
                        field.onChange(isoDate)
                      } else {
                        field.onChange(undefined)
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="baptismDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Batismo</FormLabel>
                <FormControl>
                  <DatePickerInput
                    value={field.value ? parseDate(field.value.split('T')[0]) : undefined}
                    onChange={(date) => {
                      if (date instanceof CalendarDate) {
                        const isoDate = new Date(date.year, date.month - 1, date.day).toISOString()
                        field.onChange(isoDate)
                      } else {
                        field.onChange(undefined)
                      }
                    }}
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
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="ACTIVE" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Ativo
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="INACTIVE" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Inativo
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input
                  placeholder="Endereço completo"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observações sobre o membro"
                  className="resize-none"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Salvar alterações" : "Criar membro"}
        </Button>
      </form>
    </Form>
  )
}
