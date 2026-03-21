// store/auth-store.ts
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { decryptData, encryptData } from "@/utils/crypto";
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  plan: "free" | "plus";
  walletAddress: string | null;
}

type Status = "loading" | "error" | "success";

interface CurrentUserState {
  user: User | null;
  status: Status;
  error?: string;
}

interface UserState {
  currentUser: CurrentUserState;

  // Actions
  setCurrentUser: (payload: {
    user: User | null;
    status?: Status;
    error?: string;
  }) => void;

  resetUser: () => void;

  // Helpers
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: {
        user: null,
        status: "loading",
        error: undefined,
      },

      setCurrentUser: ({ user, status = "success", error }) =>
        set(() => ({
          currentUser: {
            user,
            status,
            error,
          },
        })),

      resetUser: () =>
        set(() => ({
          currentUser: {
            user: null,
            status: "success",
            error: undefined,
          },
        })),

      isLoggedIn: () => {
        const user = get().currentUser.user;
        return !!user;
      },
    }),
    {
      name: "auth-store",
      storage: {
        getItem: (name) => {
          const raw = window.localStorage.getItem(name);
          if (!raw) return null;
          try {
            return decryptData(raw);
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          window.localStorage.setItem(name, encryptData(value));
        },
        removeItem: (name) => window.localStorage.removeItem(name),
      },
    }
  )
);
