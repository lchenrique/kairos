"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Church, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getAuthProfile } from "@/lib/api/generated/auth/auth";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth-central";
import { useAuthStore } from "@/lib/stores/auth-store";

const signUpSchema = z
  .object({
    name: z.string().trim().min(3, "Informe seu nome"),
    email: z.string().trim().email("Informe um e-mail válido"),
    password: z.string().min(8, "Use pelo menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

const benefits = [
  "Conheça o painel antes de decidir",
  "Nenhuma igreja criada durante o cadastro",
  "Dados reais só começam após a ativação",
];

export default function CadastroPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SignUpForm) {
    setIsSubmitting(true);
    try {
      try {
        await signUpWithEmail(values.name, values.email, values.password);
      } catch (error) {
        const status = (error as Error & { status?: number }).status;
        const message = error instanceof Error ? error.message : "";
        if (status !== 409 && !/already|exists|duplicate|cadastrad/i.test(message)) throw error;
      }

      await signInWithEmail(values.email, values.password);
      const user = await getAuthProfile();
      login(user);
      toast.success("Sua conta está pronta. Vamos conhecer o Kairos.");
      router.replace("/onboarding");
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (/401|invalid|credenciais/i.test(message)) {
        toast.error("Este e-mail já existe. Confira a senha ou entre na sua conta.");
      } else {
        toast.error("Não foi possível criar sua conta agora. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh bg-background lg:grid lg:grid-cols-[minmax(340px,0.82fr)_minmax(520px,1.18fr)]">
      <aside className="relative hidden overflow-hidden bg-hero px-10 py-10 text-hero-foreground lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-[48px] border-hero-accent/25" aria-hidden="true" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Church className="h-6 w-6" aria-hidden="true" /></div>
            <div><p className="font-display text-2xl font-semibold tracking-tight">KAIROS</p><p className="text-[10px] uppercase tracking-[0.2em] text-hero-muted/75">Ritmo da comunidade</p></div>
          </div>
          <div className="mt-20 max-w-lg space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-hero-accent">Comece pelo produto</p>
            <h1 className="font-display text-5xl font-medium leading-[1.02] tracking-tight xl:text-6xl">Crie sua conta. Conheça o Kairos no seu ritmo.</h1>
            <p className="max-w-md text-base leading-7 text-hero-muted">A conta é só sua. A decisão de criar uma igreja e ativar uma assinatura acontece depois, já dentro da plataforma.</p>
          </div>
        </div>
        <ul className="relative space-y-4" aria-label="O que acontece ao criar uma conta">
          {benefits.map((benefit) => <li className="flex items-start gap-3 text-sm text-hero-muted" key={benefit}><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-hero-accent text-hero-accent-foreground"><Check className="h-3 w-3" aria-hidden="true" /></span>{benefit}</li>)}
        </ul>
      </aside>

      <section className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Church className="h-5 w-5" aria-hidden="true" /></div><div><p className="font-display text-xl font-semibold">KAIROS</p><p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Ritmo da comunidade</p></div></div>
          <div className="mb-7 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary"><Sparkles className="h-4 w-4" aria-hidden="true" /> Sua conta Kairos</div>
            <h2 className="font-display text-4xl font-semibold leading-none sm:text-5xl">Entre para explorar.</h2>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">Sem cadastro de igreja, sem plano grátis disfarçado. Primeiro você conhece como tudo funciona.</p>
          </div>

          <Card className="border-border/80 bg-card/95 shadow-xl shadow-foreground/5">
            <CardHeader className="space-y-1 border-b border-border/70 pb-5"><CardTitle className="text-lg">Criar conta</CardTitle><CardDescription>Seu acesso é protegido pelo Auth Central.</CardDescription></CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField control={form.control} name="name" render={({ field }) => <FormItem><FormLabel>Seu nome</FormLabel><FormControl><Input className="h-11" autoComplete="name" autoFocus placeholder="Como podemos chamar você?" {...field} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="email" render={({ field }) => <FormItem><FormLabel>E-mail</FormLabel><FormControl><Input className="h-11" type="email" autoComplete="email" placeholder="voce@igreja.com" {...field} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="password" render={({ field }) => <FormItem><FormLabel>Senha</FormLabel><div className="relative"><FormControl><Input className="h-11 pr-11" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Pelo menos 8 caracteres" {...field} /></FormControl><Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-11 w-11" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="confirmPassword" render={({ field }) => <FormItem><FormLabel>Confirmar senha</FormLabel><FormControl><Input className="h-11" type="password" autoComplete="new-password" placeholder="Digite sua senha novamente" {...field} /></FormControl><FormMessage /></FormItem>} />
                  <Button className="h-12 w-full" type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Criando sua conta...</> : <>Criar conta e explorar <ArrowRight className="ml-2 h-4 w-4" /></>}</Button>
                </form>
              </Form>
              <p className="mt-6 text-center text-sm text-muted-foreground">Já tem uma conta? <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/login">Entrar</Link></p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
