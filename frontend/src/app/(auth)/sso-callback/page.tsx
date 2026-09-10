"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SsoCallbackPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full bg-primary/20" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Conectando sua conta Google…</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </main>
  );
}
