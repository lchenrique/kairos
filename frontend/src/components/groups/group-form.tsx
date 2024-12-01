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
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { usePostGroups, usePutGroupsId, getGetGroupsQueryKey } from "@/lib/api/generated/groups/groups"
import type { GetGroups200GroupsItem, PostGroupsBody } from "@/lib/api/generated/model"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useDrawerStore } from "@/store/use-drawer-store"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }).nullable(),
  type: z.enum(["CELL", "MINISTRY", "DEPARTMENT"], {
    required_error: "O tipo é obrigatório.",
  }),
  meetingDay: z.string().nullable(),
  meetingTime: z.string().nullable(),
  location: z.string().nullable(),
})

type FormValues = z.infer<typeof formSchema>

interface GroupFormProps {
  initialData?: GetGroups200GroupsItem
  id?: string
}

const groupTypes = [
  { value: "CELL", label: "Célula" },
  { value: "MINISTRY", label: "Ministério" },
  { value: "DEPARTMENT", label: "Departamento" },
]

const weekDays = [
  { value: "sunday", label: "Domingo" },
  { value: "monday", label: "Segunda" },
  { value: "tuesday", label: "Terça" },
  { value: "wednesday", label: "Quarta" },
  { value: "thursday", label: "Quinta" },
  { value: "friday", label: "Sexta" },
  { value: "saturday", label: "Sábado" },
]

export function GroupForm({ initialData, id }: GroupFormProps) {
  const queryClient = useQueryClient()
  const closeDrawer = useDrawerStore((state) => state.close)

  const createGroup = usePostGroups({
    mutation: {
      onSuccess: () => {
        toast.success("Grupo criado com sucesso")
        queryClient.invalidateQueries({ queryKey: getGetGroupsQueryKey() })
        closeDrawer()
      }
    }
  })

  const updateGroup = usePutGroupsId({
    mutation: {
      onSuccess: () => {
        toast.success("Grupo atualizado com sucesso")
        queryClient.invalidateQueries({ queryKey: getGetGroupsQueryKey() })
        closeDrawer()
      }
    }
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      type: initialData?.type ?? "CELL",
      meetingDay: initialData?.meetingDay ?? null,
      meetingTime: initialData?.meetingTime ?? null,
      location: initialData?.location ?? null,
    },
  })

  const onSubmit = async (values: PostGroupsBody) => {
    try {
      if (initialData) {
        await updateGroup.mutateAsync({
          id: initialData.id,
          data: values
        })
      } else {
        await createGroup.mutateAsync({
          data: values
        })
      }
    } catch (error) {
      toast.error("Erro ao salvar o grupo")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Jovens" {...field} />
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
                  placeholder="Descreva o propósito e atividades do grupo..."
                  className="h-32"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
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
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  {groupTypes.map((type) => (
                    <FormItem key={type.value} className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={type.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {type.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="meetingDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia da Reunião</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value || null)}
                    defaultValue={field.value ?? undefined}
                    className="grid grid-cols-2 gap-4"
                  >
                    {weekDays.map((day) => (
                      <FormItem key={day.value} className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={day.value} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {day.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
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
                <FormLabel>Horário</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
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
                  <Input 
                    placeholder="Ex: Sala 101" 
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={createGroup.isPending || updateGroup.isPending}
          >
            {(createGroup.isPending || updateGroup.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {initialData ? "Atualizar" : "Criar"} Grupo
          </Button>
        </div>
      </form>
    </Form>
  )
}
