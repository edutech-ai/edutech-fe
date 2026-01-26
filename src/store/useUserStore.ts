import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User as BaseUser } from "@/types";
import type { Subscription } from "@/services/paymentService";

interface User extends BaseUser {
  accessToken?: string;
  refreshToken?: string;
  tokenExpiryTime?: number; // Timestamp in milliseconds
}

interface UserState {
  user: User | null;
  subscription: Subscription | null;
  setUser: (user: User | null) => void;
  setSubscription: (subscription: Subscription | null) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
  isPaidUser: () => boolean;
  isAuthenticated: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      subscription: null,
      setUser: (user) => set({ user }),
      setSubscription: (subscription) => set({ subscription }),
      clearUser: () => set({ user: null, subscription: null }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      isPaidUser: () => {
        const { user, subscription } = get();
        if (!user) return false;

        // Check if subscription is active
        if (subscription?.status === "active") {
          // Check endDate if available
          if (subscription.endDate) {
            return new Date(subscription.endDate) > new Date();
          }
          return true;
        }

        // Fallback to isPaidUser boolean if available
        return user.isPaidUser ?? false;
      },
      isAuthenticated: () => {
        const { user } = get();
        return user !== null && !!user.accessToken;
      },
    }),
    {
      name: "edutech-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        subscription: state.subscription,
      }),
    }
  )
);
