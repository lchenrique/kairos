'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { usePostAuthPasswordResetRequest } from '@/lib/api/generated/auth/auth'

const formSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido'),
})

type ForgotPasswordForm = z.infer<typeof formSchema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })
  const resetRequest = usePostAuthPasswordResetRequest({
    mutation: {
      onSuccess: () => setSent(true),
      onError: () => toast.error('Não foi possível enviar a solicitação. Tente novamente.'),
    },
  })

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Recuperar acesso</p>
        </div>

        <Card className="border-border/80 bg-card/95 shadow-xl shadow-foreground/5">
          {sent ? (
            <>
              <CardHeader className="items-center text-center">
                <CheckCircle2 className="mb-2 h-10 w-10 text-primary" aria-hidden="true" />
                <CardTitle className="text-2xl">Confira seu e-mail</CardTitle>
                <CardDescription className="max-w-sm leading-6">
                  Se existir uma conta com esse endereço, você receberá um link válido por 60 minutos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/login">Voltar para o login</Link>
                </Button>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Esqueceu sua senha?</CardTitle>
                <CardDescription className="leading-6">
                  Informe seu e-mail de acesso para receber as instruções de redefinição.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-5" onSubmit={form.handleSubmit((data) => resetRequest.mutate({ data }))}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" autoComplete="email" placeholder="voce@igreja.com" autoFocus {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button className="w-full" type="submit" disabled={resetRequest.isPending}>
                      {resetRequest.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                          Enviando...
                        </>
                      ) : (
                        'Enviar link de recuperação'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </>
          )}
        </Card>

        <Button asChild variant="ghost" className="w-full text-muted-foreground">
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Voltar para o login
          </Link>
        </Button>
      </div>
    </main>
  )
}
