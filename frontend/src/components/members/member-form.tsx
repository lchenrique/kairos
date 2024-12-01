"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { DatePicker } from "@/components/ui/date-picker"
import { ImageUpload } from "@/components/ui/image-upload"
import { Textarea } from "@/components/ui/textarea"
import { MaskedInput } from "@/components/ui/masked-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { usePostMembers, usePutMembersId, getGetMembersQueryKey } from "@/lib/api/generated/members/members"
import type { GetMembers200MembersItem, PostMembersBody } from "@/lib/api/generated/model"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useDrawerStore } from "@/store/use-drawer-store"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }).nullable(),
  phone: z.string().nullable(),
  birthDate: z.string().datetime().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  baptismDate: z.string().datetime().nullable(),
  address: z.string().nullable(),
  notes: z.string().optional(),
  image: z.string().optional(),
})

interface MemberFormProps {
  initialData?: GetMembers200MembersItem
  id?: string
}

export function MemberForm({ initialData, id }: MemberFormProps) {
  const queryclient = useQueryClient()
  const closeDrawer = useDrawerStore((state) => state.close)

  const createMember = usePostMembers({
    mutation: {
      onSuccess: () => {
        toast.success("Membro criado com sucesso")
        queryclient.invalidateQueries({ queryKey: getGetMembersQueryKey() })
        closeDrawer()
      }
    }
  })

  const updateMember = usePutMembersId({
    mutation: {
      onSuccess: () => {
        toast.success("Membro atualizado com sucesso")
        queryclient.invalidateQueries({ queryKey: getGetMembersQueryKey() })
        closeDrawer()
      }
    }
  })

  const form = useForm<PostMembersBody>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name,
      email: initialData?.email?? "",
      phone: initialData?.phone ?? "",
      status: "ACTIVE",
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
    } catch (error) {
      toast.error("Erro ao salvar o membro")
    }
  }

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
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date?.toISOString() ?? undefined)}
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
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date?.toISOString() ?? undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Rua, número, bairro, cidade"
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="ACTIVE" />
                      </FormControl>
                      <FormLabel className="font-normal">Ativo</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="INACTIVE" />
                      </FormControl>
                      <FormLabel className="font-normal">Inativo</FormLabel>
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Adicione observações sobre o membro..."
                  className="h-32"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || createMember.isPending || updateMember.isPending}
          >
            {(form.formState.isSubmitting || createMember.isPending || updateMember.isPending) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
