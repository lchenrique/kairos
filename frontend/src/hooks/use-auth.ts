import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getAuthProfile } from "@/lib/api/generated/auth/auth";
import { signOutFromAuthCentral } from "@/lib/auth-central";
import { useAuthStore } from "@/lib/stores/auth-store";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isSigningOut, login, beginSignOut, logout } =
    useAuthStore();
  const [isChecking, setIsChecking] = useState(!user);

  useEffect(() => {
    if (user || isSigningOut) {
      setIsChecking(false);
      return;
    }

    let active = true;
    setIsChecking(true);
    getAuthProfile()
      .then((profile) => {
        if (active) login(profile);
      })
      .catch(() => {
        if (active) logout();
      })
      .finally(() => {
        if (active) setIsChecking(false);
      });

    return () => {
      active = false;
    };
  }, [isSigningOut, login, logout, user]);

  const signOut = useCallback(async () => {
    beginSignOut();
    try {
      await signOutFromAuthCentral();
    } finally {
      logout();
      router.replace("/auth?mode=login");
      router.refresh();
    }
  }, [beginSignOut, router, logout]);

  return {
    user,
    isAuthenticated,
    isLoading: isChecking,
    signOut,
  };
}
