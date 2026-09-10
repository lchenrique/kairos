import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { getAuthProfile } from "@/lib/api/generated/auth/auth";
import { clearClerkTokenGetter, registerClerkTokenGetter } from "@/lib/clerk-token";
import { useAuthStore } from "@/lib/stores/auth-store";

export function useAuth() {
  const router = useRouter();
  const { isLoaded: clerkLoaded, isSignedIn, getToken, signOut: clerkSignOut } = useClerkAuth();
  const { user, isAuthenticated, isSigningOut, login, beginSignOut, logout } =
    useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!clerkLoaded) return;
    registerClerkTokenGetter(getToken);
    return () => clearClerkTokenGetter(getToken);
  }, [clerkLoaded, getToken]);

  useEffect(() => {
    if (!clerkLoaded || isSigningOut) {
      setIsChecking(false);
      return;
    }

    if (!isSignedIn) {
      logout();
      setIsChecking(false);
      return;
    }

    let active = true;
    setIsChecking(true);
    getAuthProfile()
      .then((profile) => {
        if (active) login(profile);
      })
      .catch(async (error) => {
        const status = (error as { response?: { status?: number } })?.response?.status;

        // A Clerk session with a rejected API token must be closed before
        // leaving the app shell. Otherwise Clerk sends /auth straight back
        // to /onboarding and the two routes keep bouncing forever.
        if (status === 401) {
          try {
            await clerkSignOut();
          } catch {
            // The local session is still cleared below if Clerk is unavailable.
          }
        }

        logout();
      })
      .finally(() => {
        if (active) setIsChecking(false);
      });

    return () => {
      active = false;
    };
  }, [clerkLoaded, isSignedIn, isSigningOut, login, logout, clerkSignOut]);

  const signOut = useCallback(async () => {
    beginSignOut();
    try {
      await clerkSignOut();
    } finally {
      logout();
      router.replace("/auth?mode=login");
      router.refresh();
    }
  }, [beginSignOut, clerkSignOut, router, logout]);

  return {
    user,
    isAuthenticated,
    isLoading: isChecking,
    signOut,
  };
}
