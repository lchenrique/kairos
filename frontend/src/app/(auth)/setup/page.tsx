"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Building2,
  Check,
  Church,
  Loader2,
  Network,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import {
  useGetAuthSetupStatus,
  usePostAuthSetup,
} from "@/lib/api/generated/auth/auth";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth-central";
import { useAuthStore } from "@/lib/stores/auth-store";

const setupFormSchema = z
  .object({
    organizationName: z.string().trim().min(3, "Informe o nome da Rede"),
    churchName: z.string().trim().min(3, "Informe o nome da igreja sede"),
    adminName: z.string().trim().min(3, "Informe seu nome"),
    email: z.string().trim().email("Informe um e-mail válido"),
    password: z.string().min(8, "Use pelo menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SetupForm = z.infer<typeof setupFormSchema>;

type ApiError = {
  response?: {
    status?: number;
    data?: { message?: string; code?: string };
  };
};

const benefits = [
  "Rede e igreja sede vinculadas desde o primeiro acesso",
  "Conta administradora pronta para convidar a equipe",
  "Estrutura preparada para adicionar novas unidades",
];

export default function SetupPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isRegistering, setIsRegistering] = useState(false);
  const status = useGetAuthSetupStatus({ query: { retry: 1 } });
  const form = useForm<SetupForm>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      organizationName: "",
      churchName: "",
      adminName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const setup = usePostAuthSetup({
    mutation: {
      onSuccess: (data) => {
        login(data.user);
        toast.success("Sua Rede foi criada com sucesso!");
        router.replace("/dashboard");
      },
      onError: (error) => {
        const apiError = error as ApiError;
        if (
          apiError.response?.status === 409 ||
          apiError.response?.data?.code === "ACCOUNT_ALREADY_REGISTERED"
        ) {
          toast.info(
            "Esta conta já está cadastrada. Entre com sua conta existente.",
          );
          router.replace("/login");
          return;
        }
        toast.error(
          apiError.response?.data?.message ||
            "Não foi possível concluir a configuração.",
        );
      },
    },
  });

  async function onSubmit(values: SetupForm) {
    setIsRegistering(true);
    try {
      // The account and password are created by Auth Central. Kairos only
      // creates the local organization/church membership after the JWT is in
      // memory, so no local password is persisted or used for authentication.
      try {
        await signUpWithEmail(values.adminName, values.email, values.password);
      } catch (error) {
        // An existing Auth Central account may still finish first setup; the
        // sign-in below remains the source of truth for the supplied password.
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
      await signInWithEmail(values.email, values.password);
      await setup.mutateAsync({
        data: {
          organizationName: values.organizationName,
          churchName: values.churchName,
          adminName: values.adminName,
          email: values.email,
          password: values.password,
        },
      });
    } catch (error) {
      const apiError = error as ApiError;
      const apiCode = apiError.response?.data?.code;
      if (apiCode === "ACCOUNT_ALREADY_REGISTERED") return;
      if (
        (apiError.response?.status === 409 && apiCode !== "INVALID_SETUP_NAME") ||
        /already|exists|duplicate|cadastrad/i.test(
          error instanceof Error ? error.message : "",
        )
      ) {
        toast.error(
          "Este e-mail já está cadastrado. Confira a senha ou entre pela tela de login.",
        );
      } else if (apiError.response?.status === 401) {
        toast.error("A sessão de autenticação expirou. Tente novamente.");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Não foi possível concluir a configuração.",
        );
      }
    } finally {
      setIsRegistering(false);
    }
  }

  if (status.isPending) {
    return (
      <main
        className="flex min-h-dvh items-center justify-center px-4"
        aria-busy="true"
      >
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton className="h-16" key={index} />
            ))}
          </CardContent>
        </Card>
      </main>
    );
  }

  if (status.isError) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4">
        <Alert className="max-w-lg border-destructive/40" variant="destructive">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Não foi possível verificar o cadastro</AlertTitle>
          <AlertDescription className="mt-2 space-y-4">
            <p>Confirme se o backend está em execução e tente novamente.</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => status.refetch()}
            >
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  if (!status.data?.available) return null;

  return (
    <main className="setup-shell min-h-dvh bg-background lg:grid lg:h-dvh lg:grid-cols-[minmax(320px,0.72fr),minmax(600px,1.28fr)] lg:overflow-hidden">
      <aside className="relative hidden overflow-hidden bg-hero px-10 py-8 text-hero-foreground lg:flex lg:flex-col lg:justify-between xl:px-14">
        <div
          className="absolute -right-28 -top-28 h-80 w-80 rounded-full border-[42px] border-hero-accent/30"
          aria-hidden="true"
        />
        <div className="relative space-y-12">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Church className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight">
                KAIROS
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-hero-muted/75">
                Ritmo da comunidade
              </p>
            </div>
          </div>
          <div className="max-w-lg space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-hero-accent">
              Cadastro SaaS
            </p>
            <h1 className="font-display text-5xl font-medium leading-[1.02] tracking-tight xl:text-6xl">
              Sua Rede começa organizada desde o primeiro dia.
            </h1>
            <p className="max-w-md text-base leading-7 text-hero-muted">
              Crie a estrutura inicial e entre direto no painel para começar a
              cuidar da comunidade.
            </p>
          </div>
        </div>
        <ul className="relative space-y-4" aria-label="O que será configurado">
          {benefits.map((benefit) => (
            <li
              className="flex items-start gap-3 text-sm text-hero-muted"
              key={benefit}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-hero-accent text-hero-accent-foreground">
                <Check className="h-3 w-3" aria-hidden="true" />
              </span>
              {benefit}
            </li>
          ))}
        </ul>
      </aside>

      <section className="flex min-h-dvh items-center justify-center px-4 py-6 sm:px-8 lg:h-full lg:min-h-0 lg:overflow-hidden">
        <div className="w-full max-w-2xl">
          <div className="mb-5 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Church className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold">KAIROS</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Configuração inicial
              </p>
            </div>
          </div>

          <Card className="border-border/80 bg-card/95 shadow-xl shadow-foreground/5">
            <CardHeader className="space-y-2 border-b border-border/70 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Network className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-xl">Crie sua conta</CardTitle>
                  <CardDescription>
                    Cadastre-se e configure sua Rede em menos de dois minutos.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 py-5 sm:px-6">
              <Form {...form}>
                <form
                  className="space-y-5"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="organizationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Rede</FormLabel>
                          <div className="relative">
                            <Building2
                              className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <FormControl>
                              <Input
                                className="h-10 pl-9"
                                placeholder="Ex.: Rede Esperança"
                                autoFocus
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="churchName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Igreja sede</FormLabel>
                          <div className="relative">
                            <Church
                              className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <FormControl>
                              <Input
                                className="h-10 pl-9"
                                placeholder="Ex.: Comunidade Central"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="adminName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seu nome</FormLabel>
                          <FormControl>
                            <Input
                              className="h-10"
                              placeholder="Nome do responsável"
                              autoComplete="name"
                              {...field}
                            />
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
                          <FormLabel>E-mail de acesso</FormLabel>
                          <FormControl>
                            <Input
                              className="h-10"
                              type="email"
                              placeholder="voce@igreja.com"
                              autoComplete="email"
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
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input
                              className="h-10"
                              type="password"
                              placeholder="Mínimo de 8 caracteres"
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
                          <FormLabel>Confirmar senha</FormLabel>
                          <FormControl>
                            <Input
                              className="h-10"
                              type="password"
                              placeholder="Digite novamente"
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    className="h-11 w-full"
                    type="submit"
                    disabled={setup.isPending || isRegistering}
                  >
                    {setup.isPending || isRegistering ? (
                      <>
                        <Loader2
                          className="mr-2 h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                        Criando sua conta...
                      </>
                    ) : (
                      <>
                        Criar conta e entrar
                        <ArrowRight
                          className="ml-2 h-4 w-4"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Button>
                  <p className="text-center text-xs leading-5 text-muted-foreground">
                    Cada conta pode criar sua própria Rede. O login fica no
                    Auth Central.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
