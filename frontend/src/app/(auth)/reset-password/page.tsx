'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, KeyRound, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { usePostAuthPasswordReset } from '@/lib/api/generated/auth/auth'

const formSchema = z
  .object({
    password: z.string().min(8, 'Use pelo menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type ResetPasswordForm = z.infer<typeof formSchema>

function ResetPasswordContent() {
  const token = useSearchParams().get('token') || ''
  const [completed, setCompleted] = useState(false)
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })
  const resetPassword = usePostAuthPasswordReset({
    mutation: {
      onSuccess: () => setCompleted(true),
      onError: () => toast.error('Este link é inválido, expirou ou já foi utilizado.'),
    },
  })

  if (token.length < 32) {
    return (
      <Alert className="border-destructive/40" variant="destructive">
        <KeyRound className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Link de recuperação inválido</AlertTitle>
        <AlertDescription className="mt-2 space-y-4">
          <p>Solicite um novo link para redefinir sua senha.</p>
          <Button asChild variant="outline">
            <Link href="/forgot-password">Solicitar novo link</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="border-border/80 bg-card/95 shadow-xl shadow-foreground/5">
      {completed ? (
        <>
          <CardHeader className="items-center text-center">
            <CheckCircle2 className="mb-2 h-10 w-10 text-primary" aria-hidden="true" />
            <CardTitle className="text-2xl">Senha atualizada</CardTitle>
            <CardDescription>Suas sessões anteriores foram encerradas. Entre novamente.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Entrar com a nova senha</Link>
            </Button>
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Crie uma nova senha</CardTitle>
            <CardDescription>O link só pode ser usado uma vez.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-5"
                onSubmit={form.handleSubmit((data) =>
                  resetPassword.mutate({ data: { token, password: data.password } }),
                )}
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="new-password" autoFocus {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar nova senha</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="new-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit" disabled={resetPassword.isPending}>
                  {resetPassword.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Atualizando...
                    </>
                  ) : (
                    'Atualizar senha'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </>
      )}
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <KeyRound className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Segurança da conta</p>
        </div>
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </main>
  )
}
