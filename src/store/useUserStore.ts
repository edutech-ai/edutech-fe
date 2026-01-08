import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User as BaseUser } from "@/types";

interface User extends BaseUser {
  token?: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
  isPaidUser: () => boolean;
  isAuthenticated: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      isPaidUser: () => get().user?.isPaidUser ?? false,
      isAuthenticated: () => {
        const { user } = get();
        return user !== null && !!user.token;
      },
    }),
    {
      name: "edutech-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
