import { ArrowUpRight, Compass, Home, MoveUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-dvh overflow-hidden bg-background text-foreground">
      <div className="h-1 w-full bg-primary" aria-hidden="true" />

      <div className="relative grid min-h-[calc(100dvh-4px)] lg:grid-cols-[0.88fr_1.12fr]">
        <section className="relative flex min-h-[620px] flex-col justify-between overflow-hidden bg-hero px-6 py-7 text-hero-foreground sm:px-10 lg:min-h-0 lg:px-14 lg:py-9 xl:px-20">
          <div className="pointer-events-none absolute -right-32 -top-36 h-[28rem] w-[28rem] rounded-full border-[3rem] border-hero-accent/20" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full border border-hero-border/70" aria-hidden="true" />

          <Link
            href="/"
            aria-label="Kairos, voltar para a página inicial"
            className="group relative z-10 inline-flex w-fit cursor-pointer items-center gap-3 rounded-xl outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-hero-accent focus-visible:ring-offset-4 focus-visible:ring-offset-hero"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Compass className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-2xl font-semibold tracking-tight">KAIROS</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-hero-muted/75">Ritmo da comunidade</span>
            </span>
          </Link>

          <div className="relative z-10 mt-20 max-w-xl lg:mt-0">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-hero-accent">
              <span className="h-2 w-2 rounded-full bg-hero-accent" aria-hidden="true" />
              Erro 404 · caminho não encontrado
            </p>
            <h1 className="mt-5 font-display text-[clamp(8rem,20vw,15rem)] font-semibold leading-[0.72] tracking-[-0.1em] text-hero-foreground">
              404
            </h1>
            <p className="mt-10 max-w-md text-base leading-7 text-hero-muted sm:text-lg">
              Essa página tomou outro caminho. A comunidade continua aqui, no ritmo certo.
            </p>
          </div>

          <div className="relative z-10 mt-20 flex max-w-sm items-start gap-3 border-t border-hero-border/70 pt-5 text-sm text-hero-muted lg:mt-0">
            <MoveUpRight className="mt-0.5 h-4 w-4 shrink-0 text-hero-accent" aria-hidden="true" />
            <p>Volte um passo e encontre novamente o que importa.</p>
          </div>
        </section>

        <section className="relative flex items-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16 xl:px-20">
          <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,hsl(var(--border)/0.38)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.38)_1px,transparent_1px)] [background-size:48px_48px]" aria-hidden="true" />

          <div className="relative z-10 w-full max-w-2xl">
            <div className="mb-8 flex items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span>Coordenadas do Kairos</span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                Sinal ativo
              </span>
            </div>

            <div className="relative aspect-[1.08/1] overflow-hidden rounded-[2rem] border border-border bg-card/75 p-5 shadow-2xl shadow-foreground/10 sm:p-8">
              <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,hsl(var(--foreground)/0.12)_1px,transparent_0)] [background-size:18px_18px]" aria-hidden="true" />
              <div className="not-found-art-float pointer-events-none absolute inset-[7%] overflow-hidden rounded-[1.5rem] opacity-75 mix-blend-multiply dark:mix-blend-screen" aria-hidden="true">
                <Image src="/illustrations/kairos-404.webp" alt="" width={1254} height={1254} className="h-full w-full object-cover" priority />
              </div>
              <div className="absolute left-[17%] top-[20%] h-[58%] w-[66%] rounded-full border border-primary/25" aria-hidden="true" />
              <div className="absolute left-[26%] top-[30%] h-[38%] w-[48%] rounded-full border border-primary/15" aria-hidden="true" />
              <div className="absolute left-1/2 top-[17%] h-[66%] w-px -translate-x-1/2 bg-border" aria-hidden="true" />
              <div className="absolute left-[17%] top-1/2 h-px w-[66%] -translate-y-1/2 bg-border" aria-hidden="true" />

              <div className="absolute left-[13%] top-[18%] h-3 w-3 rounded-full bg-primary shadow-[0_0_0_7px_hsl(var(--primary)/0.12)]" aria-hidden="true" />
              <div className="absolute bottom-[17%] right-[15%] h-3 w-3 rounded-full bg-foreground shadow-[0_0_0_7px_hsl(var(--foreground)/0.1)]" aria-hidden="true" />

              <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] items-center justify-center rounded-[1.7rem] bg-hero text-center text-hero-foreground shadow-xl shadow-foreground/20 sm:h-48 sm:w-48">
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-hero-accent">ponto atual</span>
                  <span className="mt-2 block font-display text-6xl font-semibold leading-none tracking-[-0.09em] sm:text-8xl">?</span>
                  <span className="mt-3 block text-xs text-hero-muted">rota sem destino</span>
                </div>
              </div>

              <span className="absolute left-5 top-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground sm:left-8 sm:top-8">lat. 00° 00′</span>
              <span className="absolute bottom-5 right-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground sm:bottom-8 sm:right-8">long. 00° 00′</span>
            </div>

            <div className="mt-9 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Vamos reencontrar o caminho</p>
                <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  O cuidado continua. Só precisamos voltar um passo.
                </h2>
              </div>

              <nav className="flex flex-wrap gap-3 sm:flex-col sm:items-stretch" aria-label="Navegação de erro">
                <Link
                  href="/"
                  className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Home className="h-4 w-4" aria-hidden="true" />
                  Voltar ao início
                </Link>
                <Link
                  href="/auth?mode=login"
                  className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Entrar no Kairos
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </nav>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
