"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTheme } from "next-themes"
import * as z from "zod"
import { useGetSystemChurch, usePutSystemChurch } from "@/lib/api/generated/system/system"
import { getGetSystemChurchQueryKey } from "@/lib/api/generated/system/system"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Loader2, Save, Settings2 } from "lucide-react"
import { useChurchStore } from '@/lib/stores/church-store'

const settingsSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Digite um e-mail válido.").optional().or(z.literal("")),
  theme: z.enum(["light", "dark"]),
  timezone: z.string(),
  dateFormat: z.string(),
  timeFormat: z.string(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

const defaults: SettingsFormValues = { name: "Igreja Exemplo", address: "", phone: "", email: "", theme: "light", timezone: "America/Sao_Paulo", dateFormat: "DD/MM/YYYY", timeFormat: "HH:mm" }

export function SettingsForm() {
  const queryClient = useQueryClient()
  const { setTheme } = useTheme()
  const activeChurchId = useChurchStore((state) => state.activeChurchId)
  const { data, isLoading } = useGetSystemChurch({ query: { refetchOnWindowFocus: false, enabled: activeChurchId !== 'all' } })
  const updateChurch = usePutSystemChurch({ mutation: { onSuccess: (saved) => { queryClient.invalidateQueries({ queryKey: getGetSystemChurchQueryKey() }); if (saved.theme) setTheme(saved.theme); toast.success("Configurações salvas com sucesso!") }, onError: () => toast.error("Não foi possível salvar as configurações.") } })
  const form = useForm<SettingsFormValues>({ resolver: zodResolver(settingsSchema), defaultValues: defaults })

  useEffect(() => {
    if (data) form.reset({ ...defaults, ...data, email: data.email ?? "", address: data.address ?? "", phone: data.phone ?? "" })
  }, [data, form])

  const onSubmit = (values: SettingsFormValues) => updateChurch.mutate({ data: values })

  if (activeChurchId === 'all') {
    return <Card><CardHeader><CardTitle>Preferências da unidade</CardTitle><CardDescription>Selecione uma igreja ou unidade na barra lateral para editar sua identidade e preferências.</CardDescription></CardHeader></Card>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card><CardHeader><div className="flex items-start gap-3"><div className="rounded-xl bg-primary/10 p-2.5 text-primary"><Settings2 className="h-5 w-5" aria-hidden="true" /></div><div><CardTitle>Identidade da igreja</CardTitle><CardDescription>Essas informações aparecem nos espaços administrativos do Kairos.</CardDescription></div></div></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2">
          <FormField control={form.control} name="name" render={({ field }) => <FormItem className="sm:col-span-2"><FormLabel>Nome da igreja</FormLabel><FormControl><Input placeholder="Ex: Igreja da Esperança" {...field} /></FormControl><FormMessage /></FormItem>} />
          <FormField control={form.control} name="email" render={({ field }) => <FormItem><FormLabel>E-mail</FormLabel><FormControl><Input type="email" placeholder="contato@igreja.com" {...field} /></FormControl><FormMessage /></FormItem>} />
          <FormField control={form.control} name="phone" render={({ field }) => <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input placeholder="(11) 99999-9999" {...field} /></FormControl><FormMessage /></FormItem>} />
          <FormField control={form.control} name="address" render={({ field }) => <FormItem className="sm:col-span-2"><FormLabel>Endereço</FormLabel><FormControl><Input placeholder="Rua, número, bairro e cidade" {...field} /></FormControl><FormDescription>Usado para localizar encontros e eventos.</FormDescription><FormMessage /></FormItem>} />
        </CardContent></Card>

        <Card><CardHeader><CardTitle>Preferências do sistema</CardTitle><CardDescription>Defina como datas e horários devem aparecer para sua equipe.</CardDescription></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2"><FormField control={form.control} name="theme" render={({ field }) => <FormItem><FormLabel>Tema padrão</FormLabel><Select value={field.value} onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="light">Claro</SelectItem><SelectItem value="dark">Escuro</SelectItem></SelectContent></Select><FormMessage /></FormItem>} /><FormField control={form.control} name="timezone" render={({ field }) => <FormItem><FormLabel>Fuso horário</FormLabel><Select value={field.value} onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="America/Sao_Paulo">Brasília (GMT−3)</SelectItem><SelectItem value="America/Manaus">Manaus (GMT−4)</SelectItem><SelectItem value="America/Rio_Branco">Rio Branco (GMT−5)</SelectItem></SelectContent></Select><FormMessage /></FormItem>} /><FormField control={form.control} name="dateFormat" render={({ field }) => <FormItem><FormLabel>Formato de data</FormLabel><Select value={field.value} onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="DD/MM/YYYY">DD/MM/AAAA</SelectItem><SelectItem value="MM/DD/YYYY">MM/DD/AAAA</SelectItem></SelectContent></Select></FormItem>} /><FormField control={form.control} name="timeFormat" render={({ field }) => <FormItem><FormLabel>Formato de hora</FormLabel><Select value={field.value} onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="HH:mm">24 horas (19:30)</SelectItem><SelectItem value="hh:mm a">12 horas (07:30 PM)</SelectItem></SelectContent></Select></FormItem>} /></CardContent></Card>

        <Separator />
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="ghost" onClick={() => form.reset({ ...defaults, ...data })}>Descartar</Button><Button type="submit" disabled={isLoading || updateChurch.isPending}>{updateChurch.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Salvando...</> : <><Save className="mr-2 h-4 w-4" aria-hidden="true" />Salvar alterações</>}</Button></div>
      </form>
    </Form>
  )
}
