"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Building2, Check, Church, LockKeyhole, PlayCircle, Sparkles, UsersRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { accountStateQueryKey, type BillingPlan, useAccountState } from "@/hooks/use-account-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { customInstance } from "@/lib/api/axios-instance";
import { cn } from "@/lib/utils";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export default function OnboardingPage() {
  const queryClient = useQueryClient();
  const { data: account, isLoading } = useAccountState();
  const [workspaceName, setWorkspaceName] = useState("");
  const [churchName, setChurchName] = useState("");

  const choosePlan = useMutation({
    mutationFn: (plan: BillingPlan["id"]) =>
      customInstance({
        url: "/billing/checkout-intents",
        method: "POST",
        data: { plan, workspaceName: workspaceName.trim() || undefined },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: accountStateQueryKey });
      toast.success("Escolha registrada. Vamos preparar a ativação da sua organização.");
    },
    onError: () => toast.error("Não foi possível registrar sua escolha agora."),
  });

  const createFirstChurch = useMutation({
    mutationFn: () => customInstance({ url: "/billing/first-church", method: "POST", data: { name: churchName.trim() } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: accountStateQueryKey });
      toast.success("Sua primeira igreja foi criada.");
    },
    onError: () => toast.error("Não foi possível criar a igreja. Confira sua assinatura e tente novamente."),
  });

  if (isLoading || !account) {
    return <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">Preparando sua experiência...</div>;
  }

  if (account.stage === "CREATE_CHURCH") {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-2xl items-center py-8">
        <Card className="w-full overflow-hidden border-border/80 shadow-xl shadow-foreground/5">
          <div className="border-b border-border/70 bg-hero px-6 py-7 text-hero-foreground sm:px-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-hero-accent text-hero-accent-foreground"><Church className="h-6 w-6" /></div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-hero-accent">Assinatura confirmada</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">Agora, dê um nome ao seu primeiro lugar.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-hero-muted">A conta e a assinatura já estão prontas. A primeira igreja é criada aqui, dentro do Kairos.</p>
          </div>
          <CardContent className="space-y-5 p-6 sm:p-8">
            <div className="space-y-2"><Label htmlFor="first-church">Nome da igreja sede</Label><Input id="first-church" className="h-11" value={churchName} onChange={(event) => setChurchName(event.target.value)} placeholder="Ex.: Comunidade Central" autoFocus /></div>
            <Button className="h-11 w-full" disabled={churchName.trim().length < 3 || createFirstChurch.isPending} onClick={() => createFirstChurch.mutate()}>
              Criar igreja e entrar no painel <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const hasIntent = account.stage === "CHECKOUT_PENDING";
  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8">
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-card px-6 py-8 shadow-sm sm:px-9 sm:py-10">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[34px] border-primary/10" aria-hidden="true" />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"><Sparkles className="h-4 w-4" /> Seu espaço de descoberta</div>
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl">Veja o que muda quando a rotina ganha um só lugar.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">Você já pode explorar a estrutura do Kairos. Nenhum dado real será criado até uma assinatura ser ativada e você cadastrar sua primeira igreja.</p>
          </div>
          <div className="rounded-2xl bg-hero p-5 text-hero-foreground shadow-lg shadow-foreground/10">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[0.16em] text-hero-accent">Como funciona</span><PlayCircle className="h-5 w-5 text-hero-accent" /></div>
            <div className="mt-5 space-y-4 text-sm">
              <p><span className="mr-3 text-hero-accent">01</span>Explore a experiência.</p>
              <p><span className="mr-3 text-hero-accent">02</span>Escolha o formato da sua comunidade.</p>
              <p><span className="mr-3 text-hero-accent">03</span>Ative e crie sua primeira igreja.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          [UsersRound, "Pessoas no centro", "Membros, grupos e acompanhamento sem planilhas dispersas."],
          [Church, "Dados por igreja", "Cada unidade tem seu próprio contexto, equipe e rotina."],
          [Building2, "Visão de rede", "Quando fizer sentido, a sede acompanha tudo sem misturar dados."],
        ].map(([Icon, title, text]) => {
          const FeatureIcon = Icon as typeof UsersRound;
          return <Card key={title as string} className="border-border/70"><CardContent className="p-5"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><FeatureIcon className="h-5 w-5" /></div><h2 className="font-semibold">{title as string}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text as string}</p></CardContent></Card>;
        })}
      </section>

      <section id="planos" className="scroll-mt-24">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Quando estiver pronto</p><h2 className="mt-2 font-display text-3xl font-semibold">Dois formatos, sem plano grátis.</h2></div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">A conta continua acessível. O uso real do produto começa somente com uma assinatura ativa.</p>
        </div>

        {hasIntent && <div className="mb-5 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><p>Sua escolha pelo plano <strong>{account.latestIntent?.plan === "COMMUNITY" ? "Comunidade" : "Essencial"}</strong> está registrada. O checkout será conectado a esta etapa; até a confirmação, nenhuma igreja ou dado operacional é liberado.</p></div>}

        {!hasIntent && <div className="mb-5 max-w-md space-y-2"><Label htmlFor="workspace-name">Nome da rede ou espaço (opcional por enquanto)</Label><Input id="workspace-name" value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} placeholder="Ex.: Rede Esperança" /><p className="text-xs leading-5 text-muted-foreground">Não é o nome da igreja. Você vai cadastrar a primeira igreja depois da assinatura.</p></div>}

        <div className="grid gap-5 lg:grid-cols-2">
          {account.plans.map((plan) => <PlanCard key={plan.id} plan={plan} pending={choosePlan.isPending || hasIntent} onChoose={() => choosePlan.mutate(plan.id)} />)}
        </div>
      </section>
    </div>
  );
}

function PlanCard({ plan, pending, onChoose }: { plan: BillingPlan; pending: boolean; onChoose: () => void }) {
  const community = plan.id === "COMMUNITY";
  return <Card className={cn("relative overflow-hidden border-border/70", community && "border-primary/40 shadow-lg shadow-primary/10")}>
    {community && <div className="absolute right-5 top-0 rounded-b-xl bg-primary px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground">Para redes e sedes</div>}
    <CardHeader className="space-y-3 p-6"><CardTitle className="font-display text-2xl">{plan.name}</CardTitle><CardDescription className="min-h-10 text-sm leading-6">{plan.description}</CardDescription><div className="pt-3"><span className="font-display text-4xl font-semibold">{money.format(plan.priceCents / 100)}</span><span className="ml-2 text-sm text-muted-foreground">por mês</span></div></CardHeader>
    <CardContent className="space-y-5 p-6 pt-0"><ul className="space-y-3 text-sm">{plan.features.map((feature) => <li className="flex items-start gap-2.5" key={feature}><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{feature}</span></li>)}</ul><Button className="h-11 w-full" variant={community ? "default" : "outline"} disabled={pending} onClick={onChoose}>{community ? "Escolher Comunidade" : "Escolher Essencial"}<ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent>
  </Card>;
}
