"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Bell,
  Search,
  Sun,
  Moon,
  Menu,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PageTransition } from "@/components/shared/page-transition";
import { canAccessPath, defaultPathForRole } from "@/lib/permissions";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Só redireciona se estiver montado para evitar redirecionamentos durante SSR
    if (mounted && !authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, mounted, router]);

  useEffect(() => {
    if (mounted && !authLoading && user && !canAccessPath(user.role, pathname)) {
      router.replace(defaultPathForRole(user.role));
    }
  }, [authLoading, mounted, pathname, router, user]);

  // Mostra nada durante SSR ou loading
  if (!mounted || authLoading) {
    return null;
  }

  // Se não estiver autenticado, não mostra nada mas permite o redirecionamento acontecer
  if (!isAuthenticated || !user || !canAccessPath(user.role, pathname)) {
    return null;
  }

  const pageLabels: Record<string, string> = {
    "/dashboard": "Visão geral",
    "/members": "Membros",
    "/groups": "Grupos",
    "/portal": "Portal da comunidade",
    "/events": "Eventos",
    "/calendar": "Calendário",
    "/reports": "Relatórios",
    "/finance": "Financeiro",
    "/settings": "Configurações",
  };
  const pageTitle = pageLabels[pathname] ?? "Kairos";

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Ir para o conteúdo principal
      </a>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden h-full transition-[width] duration-300 lg:block",
          isCollapsed ? "w-20" : "w-64",
        )}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </div>

      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent
          side="left"
          className="w-[280px] border-sidebar-border bg-sidebar p-0 lg:hidden"
        >
          <Sidebar isCollapsed={false} />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "min-h-screen transition-[margin] duration-300",
          isCollapsed ? "lg:ml-20" : "lg:ml-64",
        )}
      >
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Abrir menu de navegação"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden h-9 w-9 lg:inline-flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={
                isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"
              }
              title={
                isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"
              }
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </motion.div>
            </Button>

            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="hidden min-w-0 flex-1 items-center gap-3 sm:flex">
                <div className="hidden shrink-0 lg:block">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Espaço da comunidade
                  </p>
                  <p className="font-display text-lg font-semibold leading-tight">
                    {pageTitle}
                  </p>
                </div>
                <div className="relative ml-auto hidden w-full max-w-sm md:block">
                  <Search
                    className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    placeholder="Buscar pessoas, eventos..."
                    aria-label="Buscar no Kairos"
                    className="h-10 w-full rounded-xl border-border/70 bg-card/70 pl-10 shadow-none transition-colors focus:bg-card"
                  />
                </div>
              </div>
              <div className="min-w-0 sm:hidden">
                <p className="truncate font-display text-lg font-semibold">
                  {pageTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground xl:flex">
                <Circle
                  className="h-2.5 w-2.5 fill-primary text-primary"
                  aria-hidden="true"
                />
                Tudo em dia
              </div>
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="relative h-10 w-10"
                  aria-label="Alternar tema"
                >
                  <Sun
                    className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                    aria-hidden="true"
                  />
                  <Moon
                    className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Alternar tema</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10"
                aria-label="Ver notificações (3 não lidas)"
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  3
                </span>
              </Button>
            </div>
          </div>
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="paper-grid mx-auto min-h-[calc(100vh-4rem)] w-full max-w-[1600px] space-y-6 px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8"
        >
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
