"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

const settingsFormSchema = z.object({
  churchName: z.string().min(2, {
    message: "O nome da igreja deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().optional(),
  address: z.string().min(5, {
    message: "O endereço deve ter pelo menos 5 caracteres.",
  }),
  phone: z.string().min(10, {
    message: "O telefone deve ter pelo menos 10 caracteres.",
  }),
  email: z.string().email({
    message: "Digite um e-mail válido.",
  }),
  enableNotifications: z.boolean().default(true),
  enableEmails: z.boolean().default(true),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

// This can come from your database or API
const defaultValues: Partial<SettingsFormValues> = {
  churchName: "Igreja Exemplo",
  description: "Uma breve descrição da igreja",
  address: "Rua Exemplo, 123",
  phone: "(11) 99999-9999",
  email: "contato@igreja.com",
  enableNotifications: true,
  enableEmails: true,
}

export function SettingsForm() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  })

  return (
    <div className="space-y-6">
      <FormProvider {...form}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form>
              <TabsContent value="general" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Informações Gerais</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure as informações básicas da sua igreja
                  </p>
                </div>
                <Separator />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="churchName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Igreja</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o nome da igreja" {...field} />
                        </FormControl>
                        <FormDescription>
                          Este é o nome que será exibido em todo o sistema
                        </FormDescription>
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
                            placeholder="Digite uma breve descrição da igreja"
                            className="min-h-[60px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Uma breve descrição da sua igreja
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <h3 className="text-lg font-medium">Contato</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure as informações de contato da sua igreja
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o endereço da igreja" {...field} />
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
                            <Input placeholder="Digite o telefone da igreja" {...field} />
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
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o e-mail da igreja" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notifications" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Notificações</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure como você deseja receber as notificações
                  </p>
                </div>
                <Separator />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="enableNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Notificações Push
                          </FormLabel>
                          <FormDescription>
                            Receba notificações sobre eventos e atividades
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="enableEmails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Notificações por E-mail
                          </FormLabel>
                          <FormDescription>
                            Receba atualizações por e-mail
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              <TabsContent value="integrations" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Integrações</h3>
                  <p className="text-sm text-muted-foreground">
                    Conecte sua igreja com outros serviços
                  </p>
                </div>
                <Separator />
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Em breve</CardTitle>
                      <CardDescription>
                        Novas integrações serão adicionadas em breve
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </FormProvider>
    </div>
  )
}
