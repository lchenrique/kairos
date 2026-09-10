"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, UserRoundCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostAuthInvitesAccept } from "@/lib/api/generated/auth/auth";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth-central";

const formSchema = z
  .object({
    email: z.string().trim().email("Informe o e-mail do convite"),
    password: z.string().min(8, "Use pelo menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type AcceptInviteForm = z.infer<typeof formSchema>;

function AcceptInviteContent() {
  const token = useSearchParams().get("token") || "";
  const [completed, setCompleted] = useState(false);
  const form = useForm<AcceptInviteForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });
  const acceptInvite = usePostAuthInvitesAccept({
    mutation: {
      onSuccess: () => setCompleted(true),
      onError: () =>
        toast.error("Este convite é inválido, expirou ou já foi utilizado."),
    },
  });

  if (token.length < 32) {
    return (
      <Alert className="border-destructive/40" variant="destructive">
        <UserRoundCheck className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Convite inválido</AlertTitle>
        <AlertDescription className="mt-2 space-y-4">
          <p>Peça a um administrador para enviar um novo convite.</p>
          <Button asChild variant="outline">
            <Link href="/auth?mode=login">Voltar para o login</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-border/80 bg-card/95 shadow-xl shadow-foreground/5">
      {completed ? (
        <>
          <CardHeader className="items-center text-center">
            <CheckCircle2
              className="mb-2 h-10 w-10 text-primary"
              aria-hidden="true"
            />
            <CardTitle className="text-2xl">Acesso criado</CardTitle>
            <CardDescription>
              Sua conta está pronta. Entre com o email do convite e a senha que
              você escolheu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/auth?mode=login">Entrar no Kairós</Link>
            </Button>
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Ative seu acesso</CardTitle>
            <CardDescription>
              Escolha uma senha para concluir seu convite para a equipe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-5"
                onSubmit={form.handleSubmit(async (data) => {
                  try {
                    try {
                      await signUpWithEmail(data.email.split("@")[0], data.email, data.password);
                    } catch (error) {
                      const status = (error as Error & { status?: number }).status;
                      if (
                        status !== 409 &&
                        !/already|exists|duplicate|cadastrad/i.test(
                          error instanceof Error ? error.message : "",
                        )
                      ) {
                        throw error;
                      }
                    }
                    await signInWithEmail(data.email, data.password);
                    await acceptInvite.mutateAsync({
                      data: { token, password: data.password },
                    });
                  } catch (error) {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : "Não foi possível ativar o convite.",
                    );
                  }
                })}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail do convite</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          autoFocus
                          placeholder="voce@igreja.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crie sua senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          {...field}
                        />
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
                      <FormLabel>Confirme sua senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full"
                  type="submit"
                  disabled={acceptInvite.isPending}
                >
                  {acceptInvite.isPending ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Ativando...
                    </>
                  ) : (
                    "Ativar meu acesso"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </>
      )}
    </Card>
  );
}

export default function AcceptInvitePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <UserRoundCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Convite da equipe
          </p>
        </div>
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
          <AcceptInviteContent />
        </Suspense>
      </div>
    </main>
  );
}
