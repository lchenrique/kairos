"use client";

import { SignIn, SignUp, useAuth as useClerkAuth } from "@clerk/nextjs";
import { registerClerkTokenGetter } from "@/lib/clerk-token";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpenIcon,
  CalendarIcon,
  ChurchIcon,
  HeartHandshakeIcon,
  HomeIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    body: "Recupere sua senha no próprio formulário e retome o cuidado com a sua comunidade em poucos passos.",
    features: 0,
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const clerkAuthAppearance = {
  layout: {
    logoPlacement: "none" as const,
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
    showOptionalFields: false,
  },
  variables: {
    colorPrimary: "#2f6b52",
    colorBackground: "transparent",
    colorText: "#1d2924",
    colorTextSecondary: "#66756d",
    colorInputBackground: "#f7faf8",
    colorInputText: "#1d2924",
    borderRadius: "0.75rem",
    fontFamily: "inherit",
  },
  elements: {
    rootBox: "w-full",
    card: "w-full border border-border/80 bg-card/95 shadow-xl shadow-foreground/5",
    headerTitle: "font-display text-2xl font-semibold tracking-tight",
    headerSubtitle: "text-sm text-muted-foreground",
    formFieldLabel: "text-xs font-medium",
    formFieldInput: "h-10 bg-background/60 border-border/80",
    formButtonPrimary: "h-10 bg-primary text-primary-foreground hover:bg-primary/90",
    socialButtonsBlockButton: "h-10 border-border/80 bg-background/60 text-foreground hover:bg-muted",
    dividerLine: "bg-border/70",
    dividerText: "text-muted-foreground",
    footerActionLink: "text-primary",
  },
};

export function AuthFlow({ initialMode }: { initialMode: Mode }) {
  const router = useRouter();
  const { getToken } = useClerkAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    registerClerkTokenGetter(getToken);
  }, [getToken]);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  return (
    <div className="login-shell min-h-dvh w-full bg-background lg:grid lg:h-dvh lg:max-h-dvh lg:grid-cols-[minmax(360px,0.9fr),minmax(480px,1.1fr)] lg:overflow-hidden">
      <HeroPanel mode={mode} copy={heroCopy[mode]} />

      <main className="flex min-h-dvh items-center justify-center px-4 py-6 sm:px-8 lg:h-full lg:min-h-0 lg:overflow-hidden lg:py-6">
        <div className="w-full max-w-md">
          <BrandLink mobile />
          <div className="auth-mobile-art-float mb-5 overflow-hidden rounded-2xl bg-hero lg:hidden" aria-hidden="true">
            <Image src="/illustrations/kairos-auth.webp" alt="" width={1024} height={1536} className="h-36 w-full object-cover object-[55%_56%] opacity-90 mix-blend-screen" priority />
          </div>
          <ClerkAuthPanel mode={mode} reduceMotion={!!reduceMotion} onModeChange={(nextMode) => router.push(`/auth?mode=${nextMode}`)} />
        </div>
      </main>
    </div>
  );
}

function ClerkAuthPanel({
  mode,
  reduceMotion,
  onModeChange,
}: {
  mode: Mode;
  reduceMotion: boolean;
  onModeChange: (nextMode: "login" | "signup") => void;
}) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <div className="mb-5 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {mode === "signup" ? "Sua conta Kairos" : mode === "recovery" ? "Volte ao seu ritmo" : "Acesso da equipe"}
        </p>
        <h2 className="font-display text-3xl font-semibold leading-none sm:text-4xl">
          {mode === "signup" ? "Entre para explorar." : mode === "recovery" ? "Volte a cuidar." : "Bem-vindo de volta."}
        </h2>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          {mode === "signup"
            ? "Crie sua conta para conhecer o Kairos antes de criar sua primeira igreja."
            : mode === "recovery"
              ? "Selecione a recuperação de senha no formulário para retomar o acesso com segurança."
              : "Entre para continuar cuidando das pessoas e dos próximos encontros."}
        </p>
      </div>

      {mode === "signup" ? (
        <SignUp
          routing="hash"
          signInUrl="/auth?mode=login"
          fallbackRedirectUrl="/onboarding"
          appearance={clerkAuthAppearance}
        />
      ) : (
        <SignIn
          routing="hash"
          signUpUrl="/auth?mode=signup"
          fallbackRedirectUrl="/onboarding"
          appearance={clerkAuthAppearance}
        />
      )}

      <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-muted-foreground">
        <span>Autenticação segura pelo Clerk</span>
        {!reduceMotion && <span aria-hidden="true">·</span>}
        {!reduceMotion && <span>Google, e-mail e recuperação</span>}
      </div>

      {mode === "recovery" && (
        <button
          type="button"
          className="mx-auto mt-3 block text-xs font-medium text-primary underline-offset-4 hover:underline"
          onClick={() => onModeChange("login")}
        >
          Voltar para o login
        </button>
      )}
    </motion.div>
  );
}

function HeroPanel({ mode, copy }: { mode: Mode; copy: typeof heroCopy[Mode] }) {
  return (
    <aside className="relative hidden overflow-hidden bg-hero px-10 py-8 text-hero-foreground lg:flex lg:h-full lg:flex-col lg:justify-between xl:px-16">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[36px] border-hero-accent/30" aria-hidden="true" />
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
      <div className={mobile ? "flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground" : "flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"}>
        <ChurchIcon className={mobile ? "h-5 w-5" : "h-6 w-6"} aria-hidden="true" />
      </div>
      <div>
        <p className={mobile ? "font-display text-xl font-semibold" : "font-display text-2xl font-semibold tracking-tight"}>KAIROS</p>
        <p className={mobile ? "text-[10px] uppercase tracking-[0.16em] text-muted-foreground" : "text-[10px] uppercase tracking-[0.2em] text-hero-muted/75"}>Ritmo da comunidade</p>
      </div>
    </Link>
  );
}
