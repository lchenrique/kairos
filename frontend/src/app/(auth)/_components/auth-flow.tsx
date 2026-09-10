"use client";

import { Button } from "@/components/ui/button";
import { useAuth as useClerkAuth, useSignIn, useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerClerkTokenGetter } from "@/lib/clerk-token";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CalendarIcon,
  Check,
  ChurchIcon,
  EyeIcon,
  EyeOffIcon,
  HeartHandshakeIcon,
  HomeIcon,
  Loader2Icon,
  Mail,
  CheckCircle2,
  Sparkles,
  UsersIcon,
  BookOpenIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

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

type Mode = "login" | "signup" | "recovery";

const features = [
  { icon: UsersIcon, title: "Gestão de Membros", description: "Cadastre e gerencie todos os membros da sua igreja." },
  { icon: CalendarIcon, title: "Agenda de Eventos", description: "Organize cultos e eventos especiais em um só lugar." },
  { icon: HomeIcon, title: "Gestão de Células", description: "Acompanhe o crescimento das células da sua igreja." },
  { icon: HeartHandshakeIcon, title: "Ação Social", description: "Gerencie projetos sociais e voluntariado." },
  { icon: BookOpenIcon, title: "Escola Bíblica", description: "Organize turmas e acompanhe a frequência." },
];

const heroCopy: Record<Mode, { eyebrow: string; title: string; body: string; features: number }> = {
  login: {
    eyebrow: "Cuidado que continua",
    title: "A gestão que deixa espaço para o que realmente importa.",
    body: "Membros, encontros e decisões importantes em um único ritmo, claro para a equipe e acolhedor para a comunidade.",
    features: 3,
  },
  signup: {
    eyebrow: "Comece pelo produto",
    title: "Crie sua conta. Conheça o Kairos no seu ritmo.",
    body: "A conta é só sua. A decisão de criar uma igreja e ativar uma assinatura acontece depois, já dentro da plataforma.",
    features: 0,
  },
  recovery: {
    eyebrow: "Volte ao seu ritmo",
    title: "A gente ajuda você a reencontrar o acesso.",
    body: "Envie um link para o seu e-mail e retome o cuidado com a sua comunidade em poucos passos.",
    features: 0,
  },
};

const recoverySchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido"),
});

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function clerkErrorMessage(error: unknown, fallback: string) {
  if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.longMessage || error.errors[0]?.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export function AuthFlow({ initialMode }: { initialMode: Mode }) {
  const router = useRouter();
  const { getToken } = useClerkAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    registerClerkTokenGetter(getToken);
  }, [getToken]);

  const switchMode = (nextMode?: Mode) => {
    const requestedMode = nextMode === "login" || nextMode === "signup" || nextMode === "recovery"
      ? nextMode
      : undefined;
    const next = requestedMode ?? (mode === "login" ? "signup" : "login");
    setMode(next);
    router.replace(`/auth?mode=${next}`);
  };

  return (
    <div className="login-shell min-h-dvh w-full bg-background lg:grid lg:h-dvh lg:max-h-dvh lg:grid-cols-[minmax(360px,0.9fr),minmax(480px,1.1fr)] lg:overflow-hidden">
      <HeroPanel mode={mode} copy={heroCopy[mode]} />

      <main className="flex min-h-dvh items-center justify-center px-4 py-6 sm:px-8 lg:h-full lg:min-h-0 lg:overflow-hidden lg:py-6">
        <div className="w-full max-w-md">
          <BrandLink mobile />
          <div className="auth-mobile-art-float mb-5 overflow-hidden rounded-2xl bg-hero lg:hidden" aria-hidden="true">
            <Image src="/illustrations/kairos-auth.webp" alt="" width={1024} height={1536} className="h-36 w-full object-cover object-[55%_56%] opacity-90 mix-blend-screen" priority />
          </div>

          <FormPanel
            key={mode}
            mode={mode}
            reduceMotion={!!reduceMotion}
            isPending={isPending}
            setIsPending={setIsPending}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
            onSwitchMode={switchMode}
            onSuccess={(path) => router.push(path)}
            onForgotPassword={() => switchMode("recovery")}
            onBackToLogin={() => switchMode("login")}
          />
        </div>
      </main>
    </div>
  );
}

function HeroPanel({ mode, copy }: { mode: Mode; copy: typeof heroCopy[Mode] }) {
  return (
    <aside className="relative hidden overflow-hidden bg-hero px-10 py-8 text-hero-foreground lg:flex lg:h-full lg:flex-col lg:justify-between xl:px-16">
      <div
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[36px] border-hero-accent/30"
        aria-hidden="true"
      />
      <div className="auth-art-float pointer-events-none absolute -bottom-6 -right-24 hidden w-[30rem] opacity-80 xl:block" aria-hidden="true">
        <Image src="/illustrations/kairos-auth.webp" alt="" width={1024} height={1536} className="h-auto w-full mix-blend-screen" priority />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative space-y-8"
        >
          <BrandLink />
          <div className="max-w-xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-hero-accent">{copy.eyebrow}</p>
            <h1 className="font-display text-4xl font-medium leading-[1.05] tracking-tight xl:text-5xl">{copy.title}</h1>
            <p className="max-w-md text-sm leading-6 text-hero-muted">{copy.body}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {copy.features > 0 && (
        <div className="relative grid max-w-xl gap-3 sm:grid-cols-3">
          {features.slice(0, copy.features).map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="border-l border-hero-border/20 pl-3"
            >
              <feature.icon className="mb-2 h-5 w-5 text-hero-accent" aria-hidden="true" />
              <p className="text-sm font-semibold">{feature.title}</p>
              <p className="mt-1 text-xs leading-5 text-hero-muted/75">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </aside>
  );
}

function BrandLink({ mobile = false }: { mobile?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Kairos, voltar para a página inicial"
      className={[
        "group relative z-10 flex items-center gap-3 rounded-xl outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        mobile ? "mb-6 lg:hidden" : "",
      ].join(" ")}
    >
      <div className={mobile
        ? "flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
        : "flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"}>
        <ChurchIcon className={mobile ? "h-5 w-5" : "h-6 w-6"} aria-hidden="true" />
      </div>
      <div>
        <p className={mobile ? "font-display text-xl font-semibold" : "font-display text-2xl font-semibold tracking-tight"}>KAIROS</p>
        <p className={mobile ? "text-[10px] uppercase tracking-[0.16em] text-muted-foreground" : "text-[10px] uppercase tracking-[0.2em] text-hero-muted/75"}>Ritmo da comunidade</p>
      </div>
    </Link>
  );
}

type FormPanelProps = {
  mode: Mode;
  reduceMotion: boolean;
  isPending: boolean;
  setIsPending: (v: boolean) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showConfirm: boolean;
  setShowConfirm: (v: boolean) => void;
  onSwitchMode: () => void;
  onBackToLogin: () => void;
  onSuccess: (path: string) => void;
  onForgotPassword: () => void;
};

function FormPanel(props: FormPanelProps) {
  const { mode, reduceMotion } = props;

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <AnimatePresence mode="wait">
        {mode === "login" ? (
          <LoginForm key="login" {...props} reduceMotion={reduceMotion} />
        ) : mode === "signup" ? (
          <SignupForm key="signup" {...props} reduceMotion={reduceMotion} />
        ) : (
          <RecoveryForm key="recovery" {...props} reduceMotion={reduceMotion} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function RecoveryForm({ onBackToLogin, reduceMotion }: FormPanelProps) {
  type RecoveryFormValues = z.infer<typeof recoverySchema>;
  const { isLoaded, signIn } = useSignIn();
  const [step, setStep] = useState<"request" | "verify" | "password" | "done">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const form = useForm<RecoveryFormValues>({
    resolver: zodResolver(recoverySchema),
    defaultValues: { email: "" },
  });

  const requestReset = async ({ email: nextEmail }: RecoveryFormValues) => {
    if (!isLoaded) return;
    setPending(true);
    try {
      await signIn!.create({ strategy: "reset_password_email_code", identifier: nextEmail });
      setEmail(nextEmail);
      setStep("verify");
      toast.success("Enviamos um código para seu e-mail.");
    } catch (error) {
      toast.error(clerkErrorMessage(error, "Não foi possível iniciar a recuperação."));
    } finally {
      setPending(false);
    }
  };

  const verifyCode = async () => {
    if (!isLoaded || code.trim().length < 4) return;
    setPending(true);
    try {
      await signIn!.attemptFirstFactor({ strategy: "reset_password_email_code", code: code.trim() });
      setStep("password");
    } catch (error) {
      toast.error(clerkErrorMessage(error, "Código inválido ou expirado."));
    } finally {
      setPending(false);
    }
  };

  const updatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;
    if (password.length < 8 || password !== confirmPassword) {
      toast.error(password !== confirmPassword ? "As senhas não coincidem." : "Use pelo menos 8 caracteres.");
      return;
    }
    setPending(true);
    try {
      await signIn!.resetPassword({ password });
      setStep("done");
      toast.success("Senha atualizada com sucesso.");
    } catch (error) {
      toast.error(clerkErrorMessage(error, "Não foi possível atualizar sua senha."));
    } finally {
      setPending(false);
    }
  };

  return (
    <motion.div {...fadeUp} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      <div className="mb-5 space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Recuperar acesso
        </div>
        <h2 className="font-display text-3xl font-semibold leading-none sm:text-4xl">Volte a cuidar.</h2>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          Um link seguro resolve o próximo passo sem interromper seu ritmo.
        </p>
      </div>
      <Card className="border-border/80 bg-card/95 shadow-xl shadow-foreground/5">
        {step === "done" ? (
          <>
            <CardHeader className="items-center text-center">
              <CheckCircle2 className="mb-2 h-10 w-10 text-primary" aria-hidden="true" />
              <CardTitle className="text-2xl">Senha atualizada</CardTitle>
              <CardDescription className="max-w-sm leading-6">
                Sua senha foi atualizada. Agora você já pode entrar novamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" type="button" onClick={onBackToLogin}>
                Voltar para o login <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </CardContent>
          </>
        ) : step === "request" ? (
          <>
            <CardHeader className="space-y-1 border-b border-border/70 pb-3">
              <CardTitle className="text-base font-semibold">Esqueceu sua senha?</CardTitle>
              <CardDescription className="text-xs leading-5">
                Informe seu e-mail de acesso para receber as instruções de redefinição.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(requestReset)}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs">E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" autoComplete="email" placeholder="voce@igreja.com" autoFocus {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="h-10 w-full" type="submit" disabled={pending || !isLoaded}>
                    {pending ? (
                      <><Loader2Icon className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Enviando...</>
                    ) : (
                      <>Enviar código de recuperação <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        ) : step === "verify" ? (
          <>
            <CardHeader className="space-y-1 border-b border-border/70 pb-3">
              <CardTitle className="text-base font-semibold">Digite o código</CardTitle>
              <CardDescription className="text-xs leading-5">Enviamos um código para {email}.</CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); void verifyCode(); }}>
                <div className="space-y-1.5">
                  <Label htmlFor="recovery-code" className="text-xs">Código de verificação</Label>
                  <Input id="recovery-code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value)} autoFocus placeholder="000000" />
                </div>
                <Button className="h-10 w-full" type="submit" disabled={pending || code.trim().length < 4}>
                  {pending ? <><Loader2Icon className="mr-2 h-4 w-4 animate-spin" />Validando...</> : <>Validar código <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="space-y-1 border-b border-border/70 pb-3">
              <CardTitle className="text-base font-semibold">Crie uma nova senha</CardTitle>
              <CardDescription className="text-xs leading-5">Use pelo menos 8 caracteres.</CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <form className="space-y-4" onSubmit={(event) => void updatePassword(event)}>
                <div className="space-y-1.5"><Label htmlFor="new-password" className="text-xs">Nova senha</Label><Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus /></div>
                <div className="space-y-1.5"><Label htmlFor="confirm-new-password" className="text-xs">Confirmar nova senha</Label><Input id="confirm-new-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></div>
                <Button className="h-10 w-full" type="submit" disabled={pending}>
                  {pending ? <><Loader2Icon className="mr-2 h-4 w-4 animate-spin" />Atualizando...</> : <>Atualizar senha <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
      <Button type="button" variant="ghost" className="mt-3 w-full text-xs text-muted-foreground" onClick={onBackToLogin}>
        <ArrowLeft className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
        Voltar para o login
      </Button>
      {!reduceMotion && step !== "done" && <p className="mt-4 text-center text-[11px] text-muted-foreground">O código expira em poucos minutos.</p>}
    </motion.div>
  );
}

function LoginForm(props: FormPanelProps) {
  const { isPending, setIsPending, showPassword, setShowPassword, onSuccess, onForgotPassword, onSwitchMode, reduceMotion } = props;
  const { isLoaded, signIn, setActive } = useSignIn();

  type LoginForm = z.infer<typeof loginSchema>;
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const submit = async (data: LoginForm) => {
    setIsPending(true);
    try {
      const result = await signIn!.create({ identifier: data.email, password: data.password });
      if (result.status !== "complete" || !result.createdSessionId) {
        throw new Error("A conta precisa de uma etapa adicional de verificação.");
      }
      await setActive!({ session: result.createdSessionId });
      toast.success("Login realizado com sucesso!");
      onSuccess("/onboarding");
    } catch (error) {
      const msg = clerkErrorMessage(error, "Erro ao fazer login. Tente novamente.");
      if (/invalid|incorrect|identification|senha|e-mail/i.test(msg)) toast.error("E-mail ou senha inválidos");
      else toast.error(msg);
    } finally {
      setIsPending(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSubmit(submit)(e);
  };

  return (
    <motion.div {...fadeUp} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      <div className="mb-5 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Acesso da equipe</p>
        <h2 className="font-display text-3xl font-semibold leading-none sm:text-4xl">Bem-vindo de volta.</h2>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          Entre para continuar cuidando das pessoas e dos próximos encontros.
        </p>
      </div>
      <Card className="border-border/80 bg-card/95 shadow-xl shadow-foreground/5">
        <form onSubmit={handleFormSubmit}>
          <CardHeader className="space-y-1 border-b border-border/70 pb-3">
            <CardTitle className="text-base font-semibold">Entrar na plataforma</CardTitle>
            <CardDescription className="text-xs">Use seu e-mail e senha cadastrados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" className="h-10 bg-background/60" {...register("email")} autoComplete="email" autoFocus />
              {errors.email && <p className="text-xs text-destructive" role="alert">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">Senha</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Digite sua senha" className="h-10 bg-background/60 pr-10" {...register("password")} autoComplete="current-password" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                  {showPassword ? <EyeOffIcon className="h-4 w-4" aria-hidden="true" /> : <EyeIcon className="h-4 w-4" aria-hidden="true" />}
                </Button>
              </div>
              {errors.password && <p className="text-xs text-destructive" role="alert">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3 pt-2">
            <Button type="submit" className="h-10 w-full" disabled={isPending || !isLoaded}>
              {isPending ? <><Loader2Icon className="mr-2 h-4 w-4 animate-spin" />Entrando...</> : <>Entrar<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></>}
            </Button>
            <Button type="button" variant="link" className="text-xs text-muted-foreground" onClick={onForgotPassword}>Esqueceu sua senha?</Button>
            <ModeSwitch mode="login" reduceMotion={reduceMotion} onClick={onSwitchMode} />
          </CardFooter>
        </form>
      </Card>
      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
        <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        Acesso seguro para sua equipe
      </p>
    </motion.div>
  );
}

function SignupForm(props: FormPanelProps) {
  const { isPending, setIsPending, showPassword, setShowPassword, showConfirm, setShowConfirm, onSuccess, onSwitchMode, reduceMotion } = props;
  const { isLoaded, signUp, setActive } = useSignUp();
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  type SignUpForm = z.infer<typeof signUpSchema>;
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const submit = async (values: SignUpForm) => {
    setIsPending(true);
    try {
      const result = await signUp!.create({
        emailAddress: values.email,
        password: values.password,
        firstName: values.name,
      });
      if (result.status === "complete" && result.createdSessionId) {
        await setActive!({ session: result.createdSessionId });
        toast.success("Sua conta está pronta. Vamos conhecer o Kairos.");
        onSuccess("/onboarding");
        return;
      }
      await signUp!.prepareVerification({ strategy: "email_code" });
      setNeedsVerification(true);
      toast.success("Enviamos um código para confirmar seu e-mail.");
    } catch (error) {
      toast.error(clerkErrorMessage(error, "Não foi possível criar sua conta agora. Tente novamente."));
    } finally {
      setIsPending(false);
    }
  };

  const verifySignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded || verificationCode.trim().length < 4) return;
    setIsPending(true);
    try {
      const result = await signUp!.attemptVerification({ strategy: "email_code", code: verificationCode.trim() });
      if (result.status !== "complete" || !result.createdSessionId) throw new Error("Não foi possível concluir a verificação.");
      await setActive!({ session: result.createdSessionId });
      toast.success("Sua conta está pronta. Vamos conhecer o Kairos.");
      onSuccess("/onboarding");
    } catch (error) {
      toast.error(clerkErrorMessage(error, "Código inválido ou expirado."));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <motion.div {...fadeUp} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Sua conta Kairos
        </div>
        <h2 className="font-display text-3xl font-semibold leading-none sm:text-4xl">Entre para explorar.</h2>
      </div>
      <Card className="border-border/80 bg-card/95 shadow-xl shadow-foreground/5">
        <CardHeader className="space-y-1 border-b border-border/70 pb-3">
          <CardTitle className="text-base">Criar conta</CardTitle>
            <CardDescription className="text-xs">Seu acesso é protegido pelo Clerk.</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          {needsVerification ? (
            <form className="space-y-4" onSubmit={(event) => void verifySignup(event)}>
              <p className="text-sm leading-6 text-muted-foreground">Digite o código enviado para confirmar seu e-mail e ativar sua conta.</p>
              <div className="space-y-1.5"><Label htmlFor="signup-code" className="text-xs">Código de verificação</Label><Input id="signup-code" inputMode="numeric" autoComplete="one-time-code" value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} autoFocus placeholder="000000" /></div>
              <Button className="h-10 w-full" type="submit" disabled={isPending || !isLoaded}>
                {isPending ? <><Loader2Icon className="mr-2 h-4 w-4 animate-spin" />Confirmando...</> : <>Confirmar e explorar <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>
            </form>
          ) : <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(submit)}>
              <FormField control={form.control} name="name" render={({ field }) => (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.3 }}>
                  <FormItem className="space-y-1.5"><FormLabel className="text-xs">Seu nome</FormLabel><FormControl><Input className="h-10" autoComplete="name" autoFocus placeholder="Como podemos chamar você?" {...field} /></FormControl><FormMessage /></FormItem>
                </motion.div>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
                  <FormItem className="space-y-1.5"><FormLabel className="text-xs">E-mail</FormLabel><FormControl><Input className="h-10" type="email" autoComplete="email" placeholder="voce@igreja.com" {...field} /></FormControl><FormMessage /></FormItem>
                </motion.div>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
                  <FormItem className="space-y-1.5"><FormLabel className="text-xs">Senha</FormLabel><div className="relative"><FormControl><Input className="h-10 pr-10" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Pelo menos 8 caracteres" {...field} /></FormControl><Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}</Button></div><FormMessage /></FormItem>
                </motion.div>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
                  <FormItem className="space-y-1.5"><FormLabel className="text-xs">Confirmar senha</FormLabel><div className="relative"><FormControl><Input className="h-10 pr-10" type={showConfirm ? "text" : "password"} autoComplete="new-password" placeholder="Digite sua senha novamente" {...field} /></FormControl><Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}>{showConfirm ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}</Button></div><FormMessage /></FormItem>
                </motion.div>
              )} />
              <Button className="h-10 w-full" type="submit" disabled={isPending || !isLoaded}>
                {isPending ? <><Loader2Icon className="mr-2 h-4 w-4 animate-spin" />Criando sua conta...</> : <>Criar conta e explorar<ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>
            </form>
          </Form>}
          <div className="mt-4">
            <ModeSwitch mode="signup" reduceMotion={reduceMotion} onClick={onSwitchMode} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ModeSwitch({ mode, onClick, reduceMotion }: { mode: Mode; onClick: () => void; reduceMotion: boolean }) {
  const isLogin = mode === "login";
  return (
    <motion.p
      layout={!reduceMotion}
      className="text-center text-sm text-muted-foreground"
    >
      {isLogin ? "Ainda não tem uma conta?" : "Já tem uma conta?"}{" "}
      <Button type="button" variant="link" className="relative h-auto p-0 font-medium text-primary" onClick={() => onClick()}>
        <span className="relative">
          {isLogin ? "Cadastre-se" : "Entrar"}
          <motion.span
            layoutId="mode-underline"
            className="absolute inset-x-0 -bottom-0.5 h-px bg-current"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        </span>
      </Button>
    </motion.p>
  );
}
