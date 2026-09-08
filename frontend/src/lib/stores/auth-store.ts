import { create } from "zustand";
import { useChurchStore } from "@/lib/stores/church-store";
import type { AppRole } from "@/lib/permissions";

interface User {
  id: string;
  name: string;
  email: string;
  role: AppRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isSigningOut: boolean;
  login: (user: User) => void;
  beginSignOut: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isSigningOut: false,
      login: (user) => {
        useChurchStore.getState().clearActiveChurch();
        set({ user, isAuthenticated: true, isSigningOut: false });
      },
      beginSignOut: () => set({ isSigningOut: true }),
      logout: () => {
        useChurchStore.getState().clearActiveChurch();
        set({ user: null, isAuthenticated: false });
      },
    }),
);
