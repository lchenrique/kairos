"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAuthProfile, useGetAuthSetupStatus } from "@/lib/api/generated/auth/auth";
import { signInWithEmail } from "@/lib/auth-central";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  ChurchIcon,
  UsersIcon,
  CalendarIcon,
  HomeIcon,
  HeartHandshakeIcon,
  BookOpenIcon,
  ArrowRight,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

const features = [
  {
    icon: UsersIcon,
    title: "Gestão de Membros",
    description: "Cadastre e gerencie todos os membros da sua igreja.",
  },
  {
    icon: CalendarIcon,
    title: "Agenda de Eventos",
    description: "Organize cultos e eventos especiais em um só lugar.",
  },
  {
    icon: HomeIcon,
    title: "Gestão de Células",
    description: "Acompanhe o crescimento das células da sua igreja.",
  },
  {
    icon: HeartHandshakeIcon,
    title: "Ação Social",
    description: "Gerencie projetos sociais e voluntariado.",
  },
  {
    icon: BookOpenIcon,
    title: "Escola Bíblica",
    description: "Organize turmas e acompanhe a frequência.",
  },
];

function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const setupStatus = useGetAuthSetupStatus({ query: { retry: 1 } });

  useEffect(() => {
    if (setupStatus.data?.available) {
      router.replace("/setup");
    }
  }, [router, setupStatus.data]);

  const [isPending, setIsPending] = useState(false);
  const loginMutation = async (data: LoginForm) => {
      setIsPending(true);
      try {
        await signInWithEmail(data.email, data.password);
        const user = await getAuthProfile();
        login(user);
        toast.success("Login realizado com sucesso!");
        router.push("/dashboard");
      } catch (error) {
        if (error instanceof Error && /401|invalid|credenciais/i.test(error.message)) {
          toast.error("E-mail ou senha inválidos");
        } else {
          toast.error("Erro ao fazer login. Tente novamente.");
        }
      } finally { setIsPending(false); }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    void loginMutation(data);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  return (
    <div className="login-shell min-h-dvh w-full bg-background lg:grid lg:h-dvh lg:max-h-dvh lg:grid-cols-[minmax(360px,0.9fr),minmax(480px,1.1fr)] lg:overflow-hidden">
      <aside className="relative hidden overflow-hidden bg-hero px-10 py-8 text-hero-foreground lg:flex lg:h-full lg:flex-col lg:justify-between xl:px-16">
        <div
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[36px] border-hero-accent/30"
          aria-hidden="true"
        />
        <div className="relative space-y-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ChurchIcon className="h-6 w-6" aria-hidden="true" />
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
          <div className="max-w-xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-hero-accent">
              Cuidado que continua
            </p>
            <h1 className="font-display text-5xl font-medium leading-[0.98] tracking-tight xl:text-7xl">
              A gestão que deixa espaço para o que realmente importa.
            </h1>
            <p className="max-w-md text-base leading-7 text-hero-muted">
              Membros, encontros e decisões importantes em um único ritmo, claro
              para a equipe e acolhedor para a comunidade.
            </p>
          </div>
        </div>
        <div className="relative grid max-w-xl gap-3 sm:grid-cols-3">
          {features.slice(0, 3).map((feature) => (
            <div
              key={feature.title}
              className="border-l border-hero-border/20 pl-3"
            >
              <feature.icon
                className="mb-3 h-5 w-5 text-hero-accent"
                aria-hidden="true"
              />
              <p className="text-sm font-semibold">{feature.title}</p>
              <p className="mt-1 text-xs leading-5 text-hero-muted/75">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-8 lg:h-full lg:min-h-0 lg:overflow-hidden lg:py-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ChurchIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold">KAIROS</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Ritmo da comunidade
              </p>
            </div>
          </div>
          <div className="mb-8 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Acesso da equipe
            </p>
            <h2 className="font-display text-4xl font-semibold leading-none sm:text-5xl">
              Bem-vindo de volta.
            </h2>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Entre para continuar cuidando das pessoas e dos próximos
              encontros.
            </p>
          </div>
          <Card className="border-border/80 bg-card/95 shadow-xl shadow-foreground/5">
            <form onSubmit={handleFormSubmit}>
              <CardHeader className="space-y-1 border-b border-border/70 pb-5">
                <CardTitle className="text-lg font-semibold">
                  Entrar na plataforma
                </CardTitle>
                <CardDescription>
                  Use seu e-mail e senha cadastrados.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="h-12 bg-background/60"
                    {...register("email")}
                    autoComplete="email"
                    autoFocus
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      className="h-12 bg-background/60 pr-12"
                      {...register("password")}
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-10 w-10"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <EyeIcon className="h-4 w-4" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive" role="alert">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4 pt-2">
                <Button
                  type="submit"
                  className="h-12 w-full"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-muted-foreground"
                  onClick={() => router.push("/forgot-password")}
                >
                  Esqueceu sua senha?
                </Button>
              </CardFooter>
            </form>
          </Card>
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Acesso seguro para sua equipe
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
