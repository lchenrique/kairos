"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionConfig } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Church,
  HeartHandshake,
  LayoutDashboard,
  Mail,
  Menu,
  Moon,
  Plus,
  ShieldCheck,
  Sun,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingSection } from "./pricing-section";
import "./landing.css";

const navigation = [
  ["Recursos", "#features"],
  ["Nossa essência", "#about"],
  ["Planos", "#pricing"],
  ["Contato", "#contact"],
];
const modules = [
  {
    icon: Users,
    title: "Cada pessoa, uma história.",
    label: "Membros e grupos",
    text: "Reúna contatos, organize células e conecte membros à sua comunidade. Informações acessíveis para quem cuida de perto.",
    href: "/members",
  },
  {
    icon: CalendarDays,
    title: "Uma agenda. Todos juntos.",
    label: "Cultos e encontros",
    text: "Cultos, reuniões e eventos em um calendário compartilhado. Registre presenças por lista ou QR Code e acompanhe cada encontro.",
    href: "/events",
  },
  {
    icon: Wallet,
    title: "Clareza para seguir em frente.",
    label: "Finanças e relatórios",
    text: "Organize entradas e saídas, consulte os indicadores e tenha uma visão clara da rotina da igreja para decidir com confiança.",
    href: "/finance",
  },
];

function Brand() {
  return (
    <Link href="/" className="lp-brand" aria-label="Kairos, início">
      <span className="lp-brand-icon">
        <Church size={22} strokeWidth={1.6} aria-hidden="true" />
      </span>
      kairos<span className="lp-brand-dot">.</span>
    </Link>
  );
}

function ProductPreview() {
  return (
    <figure
      className="lp-product"
      aria-label="Exemplo ilustrativo do painel Kairos"
    >
      <div className="lp-product-top">
        <Brand />
        <span className="lp-preview-label">VISÃO ILUSTRATIVA</span>
        <span className="lp-initials">AC</span>
      </div>
      <div className="lp-product-body">
        <aside className="lp-preview-sidebar" aria-hidden="true">
          <LayoutDashboard />
          <Users />
          <CalendarDays />
          <Wallet />
          <span />
          <ShieldCheck />
        </aside>
        <div className="lp-preview-main">
          <div className="lp-preview-heading">
            <div>
              <span>Que bom ter você por aqui.</span>
              <h3>Sua comunidade, de perto.</h3>
            </div>
            <span className="lp-demo-date">
              Setembro <CalendarDays size={14} />
            </span>
          </div>
          <div className="lp-preview-stats">
            <div className="lp-stat-dark">
              <span>
                Membros ativos <Users size={15} />
              </span>
              <strong>
                248<span>pessoas</span>
              </strong>
              <small>Histórias que caminham juntas</small>
            </div>
            <div>
              <span>
                Pequenos grupos <ArrowUpRight size={16} />
              </span>
              <strong>
                12<span>grupos</span>
              </strong>
              <small>Conexões além do domingo</small>
            </div>
            <div>
              <span>
                Encontros no mês <CalendarDays size={15} />
              </span>
              <strong>
                08<span>eventos</span>
              </strong>
              <small>Tempo de estar presente</small>
            </div>
          </div>
          <div className="lp-preview-bottom">
            <div className="lp-chart">
              <div className="lp-chart-heading">
                <span>Presença nos encontros</span>
                <span>Este mês</span>
              </div>
              <div
                className="lp-bars"
                role="img"
                aria-label="Presenças ilustrativas: 120, 164, 148, 184, 160 e 196 pessoas"
              >
                <div className="lp-chart-grid" aria-hidden="true" />
                {[61, 84, 75, 94, 82, 100].map((height, i) => (
                  <div className="lp-bar-column" key={i}>
                    <span
                      className={i === 3 ? "lp-bar lp-bar-active" : "lp-bar"}
                      style={{ height: `${height}%` }}
                    >
                      {i === 3 && <b>184</b>}
                    </span>
                    <small>{["01", "05", "08", "12", "15", "19"][i]}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className="lp-next-event">
              <span className="lp-eyebrow">PRÓXIMO ENCONTRO</span>
              <div className="lp-event-day">
                20
                <span>
                  SET
                  <br />
                  DOMINGO
                </span>
              </div>
              <h4>Culto de celebração</h4>
              <p>19h30 · Templo principal</p>
              <Link href="/events">
                Ver agenda <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <figcaption>Dados de exemplo para apresentar a plataforma.</figcaption>
    </figure>
  );
}

export function LandingExperience() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.from(".lp-hero-enter", {
          y: 28,
          opacity: 0,
          duration: 0.85,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "all",
        });
        gsap.utils.toArray<HTMLElement>(".lp-reveal").forEach((element) => {
          gsap.from(element, {
            y: 36,
            opacity: 0,
            duration: 0.75,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: { trigger: element, start: "top 92%", once: true },
          });
        });
        gsap.from(".lp-bar", {
          scaleY: 0,
          transformOrigin: "bottom",
          duration: 0.9,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".lp-product",
            start: "top 85%",
            once: true,
          },
        });
        gsap.to(".lp-scroll-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      },
      root,
    );
    return () => media.revert();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        document.getElementById("lp-menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="lp" ref={root}>
        <a className="lp-skip" href="#main-content">
          Pular para o conteúdo
        </a>
        <header className="lp-header">
          <div className="lp-shell lp-header-inner">
            <Brand />
            <nav className="lp-desktop-nav" aria-label="Navegação principal">
              {navigation.map(([label, href]) => (
                <a key={href} href={href}>
                  {label}
                </a>
              ))}
            </nav>
            <div className="lp-header-actions">
              <Button
                variant="ghost"
                size="icon"
                disabled={!mounted}
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                aria-label="Alternar tema"
                className="lp-theme"
              >
                {mounted && resolvedTheme === "dark" ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )}
              </Button>
              <Link href="/login" className="lp-login">
                Entrar
              </Link>
              <Button asChild className="lp-button lp-header-cta">
                <Link href="/cadastro">
                  Começar agora <ArrowUpRight size={16} />
                </Link>
              </Button>
              <Button
                id="lp-menu-toggle"
                variant="ghost"
                size="icon"
                className="lp-menu-toggle"
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={menuOpen}
                aria-controls="lp-mobile-nav"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
          {menuOpen && (
            <nav
              id="lp-mobile-nav"
              className="lp-mobile-nav"
              aria-label="Navegação móvel"
            >
              {navigation.map(([label, href]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                  {label}
                  <ArrowUpRight size={18} />
                </a>
              ))}
              <Link href="/cadastro">
                Criar minha conta <ArrowRight size={18} />
              </Link>
            </nav>
          )}
          <div className="lp-scroll-progress" />
        </header>
        <main id="main-content">
          <section className="lp-hero lp-shell">
            <div className="lp-hero-top lp-hero-enter">
              <span className="lp-eyebrow">
                <i /> GESTÃO PARA IGREJAS, FEITA PARA PESSOAS
              </span>
              <span className="lp-edition">
                MENOS DISTÂNCIA. MAIS PRESENÇA.
              </span>
            </div>
            <div className="lp-hero-grid">
              <h1 className="lp-hero-enter">
                Organize a rotina.
                <br />
                Abra espaço
                <br />
                para <em>cuidar.</em>
              </h1>
              <div className="lp-hero-copy lp-hero-enter">
                <span className="lp-tiny-rule" />
                <p>
                  Uma igreja é feita de pessoas.
                  <br />A gestão também deveria ser.
                </p>
                <p className="lp-description">
                  Membros, encontros e finanças no mesmo lugar. Para sua equipe
                  ter clareza e sua comunidade ter você por perto.
                </p>
                <Button asChild className="lp-button lp-primary-cta">
                  <Link href="/cadastro">
                    Começar minha comunidade <ArrowUpRight size={20} />
                  </Link>
                </Button>
                <a href="#plataforma" className="lp-text-link">
                  Conheça a plataforma <ArrowDown size={16} />
                </a>
              </div>
            </div>
            <div id="plataforma" className="lp-product-stage lp-hero-enter">
              <div className="lp-product-caption">
                <span>SEU DIA A DIA, EM UMA NOVA PERSPECTIVA</span>
                <span>01 / VISÃO GERAL</span>
              </div>
              <ProductPreview />
            </div>
            <div className="lp-capabilities">
              <span>O cuidado conecta tudo.</span>
              {[
                { icon: Users, label: "Membros" },
                { icon: CalendarDays, label: "Encontros" },
                { icon: HeartHandshake, label: "Grupos" },
                { icon: Wallet, label: "Finanças" },
              ].map(({ icon: Icon, label }) => (
                <span key={label}>
                  <Icon size={17} aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          </section>
          <section id="features" className="lp-features lp-shell">
            <div className="lp-section-heading lp-reveal">
              <div>
                <span className="lp-eyebrow">
                  01 — UM LUGAR PARA O ESSENCIAL
                </span>
                <h2>
                  A rotina encontra ordem.
                  <br />O cuidado ganha espaço.
                </h2>
              </div>
              <p>
                Do primeiro cadastro ao próximo encontro, as informações
                acompanham quem faz a igreja acontecer.
              </p>
            </div>
            <div className="lp-feature-grid">
              {modules.map(
                ({ icon: Icon, title, label, text, href }, index) => (
                  <article className="lp-feature lp-reveal" key={label}>
                    <div className="lp-feature-top">
                      <Icon size={25} strokeWidth={1.4} aria-hidden="true" />
                      <span>0{index + 1}</span>
                    </div>
                    <span className="lp-eyebrow">{label}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                    <Link href={href}>
                      Conhecer recurso <ArrowUpRight size={19} />
                    </Link>
                  </article>
                ),
              )}
            </div>
          </section>
          <section id="about" className="lp-manifesto">
            <div className="lp-shell lp-manifesto-grid">
              <div className="lp-reveal">
                <span className="lp-eyebrow">02 — NOSSA ESSÊNCIA</span>
                <h2>
                  Por trás de
                  <br />
                  cada número,
                  <br />
                  <em>existe alguém.</em>
                </h2>
                <p>
                  Uma nova família. Um reencontro. Uma conversa que precisava
                  acontecer. O Kairos organiza o que é rotina para você se
                  dedicar ao que tem significado.
                </p>
                <Link href="/cadastro" className="lp-text-link">
                  Mais tempo para estar perto <ArrowUpRight size={20} />
                </Link>
              </div>
              <div className="lp-care-list lp-reveal">
                {[
                  {
                    n: "01",
                    title: "Conheça quem caminha com você",
                    text: "Membros e contatos organizados para um acompanhamento mais próximo.",
                  },
                  {
                    n: "02",
                    title: "Esteja presente em cada encontro",
                    text: "Agenda e presença conectadas à vida da sua comunidade.",
                  },
                  {
                    n: "03",
                    title: "Compartilhe a responsabilidade",
                    text: "Acessos por função para pastores, líderes e equipe administrativa.",
                  },
                ].map((item) => (
                  <div key={item.n}>
                    <span>{item.n}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                    <Plus size={20} aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="lp-workflow lp-shell">
            <div className="lp-section-heading lp-reveal">
              <div>
                <span className="lp-eyebrow">03 — DA PORTA PARA DENTRO</span>
                <h2>
                  Acolher começa
                  <br />
                  com estar preparado.
                </h2>
              </div>
              <p>
                Organize o encontro, registre quem chegou e acompanhe a
                participação. Tudo conectado à sua comunidade.
              </p>
            </div>
            <div className="lp-workflow-grid">
              <div className="lp-arrival lp-reveal">
                <div className="lp-arrival-title">
                  <CalendarDays size={22} />
                  <span>DOMINGO · CULTO DE CELEBRAÇÃO</span>
                </div>
                <h3>É bom ter você aqui.</h3>
                <p>
                  Uma recepção organizada.
                  <br />
                  Um encontro com mais presença.
                </p>
                <div className="lp-checkin">
                  <span className="lp-check-icon">
                    <Check size={26} />
                  </span>
                  <div>
                    <strong>Presença confirmada</strong>
                    <span>Exemplo de registro de check-in</span>
                  </div>
                </div>
              </div>
              <div className="lp-workflow-steps lp-reveal">
                {[
                  [
                    "Prepare o encontro",
                    "Crie o evento com data, horário e local. A equipe consulta tudo na mesma agenda.",
                  ],
                  [
                    "Receba sua comunidade",
                    "Registre presenças pela lista ou pelo QR Code do evento.",
                  ],
                  [
                    "Acompanhe o que aconteceu",
                    "Consulte a participação e os relatórios para planejar os próximos passos.",
                  ],
                ].map(([title, text], i) => (
                  <div key={title}>
                    <span>0{i + 1}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <div className="lp-pricing">
            <PricingSection />
          </div>
          <section id="contact" className="lp-contact lp-shell">
            <div className="lp-contact-inner lp-reveal">
              <span className="lp-eyebrow">
                O PRÓXIMO PASSO PODE SER SIMPLES.
              </span>
              <h2>
                Sua comunidade.
                <br />
                <em>Mais perto.</em>
              </h2>
              <div className="lp-contact-bottom">
                <p>
                  Comece a organizar a rotina da sua igreja.
                  <br />E devolva tempo ao que realmente importa.
                </p>
                <Button asChild className="lp-button lp-primary-cta">
                  <Link href="/cadastro">
                    Criar minha conta <ArrowUpRight size={22} />
                  </Link>
                </Button>
              </div>
              <a className="lp-contact-email" href="mailto:contato@kairos.app">
                <Mail size={16} /> Prefere conversar? contato@kairos.app{" "}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </section>
        </main>
        <footer className="lp-footer lp-shell">
          <div>
            <Brand />
            <p>O tempo certo para cuidar.</p>
          </div>
          <nav aria-label="Navegação do rodapé">
            {navigation.map(([label, href]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
            <Link href="/dashboard">
              Acessar painel <ArrowUpRight size={14} />
            </Link>
          </nav>
          <div className="lp-footer-bottom">
            <span>© {new Date().getFullYear()} Kairos</span>
            <span>Feito para quem cuida de pessoas.</span>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
