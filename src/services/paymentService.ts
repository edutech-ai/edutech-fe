import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";

// ==================== TYPES ====================

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  durationDays: number;
  maxClasses: number | null;
  maxQuizzesPerMonth: number | null;
  maxStorageMb: number | null;
  hasAdvancedAi: boolean;
  features: string[];
  isActive: boolean;
  displayOrder: number;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: "pending" | "active" | "expired" | "cancelled";
  startDate: string | null;
  endDate: string | null;
  autoRenew: boolean;
  paymentMethod: string | null;
  plan?: SubscriptionPlan;
}

export interface Transaction {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  description: string;
  paymentMethod: string;
  gateway: string;
  sepayOrderCode: string;
  status: "pending" | "processing" | "success" | "failed" | "refunded";
  createdAt: string;
  subscription?: Subscription;
}

export interface BankInfo {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  transferContent: string;
  qrCode: string;
}

export interface PaymentCreateResponse {
  transactionId: string;
  orderCode: string;
  amount: number;
  planName: string;
  bankInfo: BankInfo;
  note: string;
  expiresAt: string;
}

export interface PaymentCheckResponse {
  paid: boolean;
  message: string;
  data: {
    orderCode: string;
    status: string;
    amount: number;
  };
}

// ==================== API ENDPOINTS ====================

const PAYMENT_ENDPOINTS = {
  PLANS: "/payment/plans",
  PLAN_BY_CODE: (code: string) => `/payment/plans/${code}`,
  CREATE: "/payment/create",
  CHECK: (orderCode: string) => `/payment/sepay-check/${orderCode}`,
  SUBSCRIPTION: "/payment/subscription",
  CANCEL_SUBSCRIPTION: "/payment/subscription/cancel",
  TRANSACTIONS: "/payment/transactions",
  REFUND: "/payment/refund",
};

// ==================== QUERY KEYS ====================

export const PAYMENT_KEYS = {
  all: ["payment"] as const,
  plans: () => [...PAYMENT_KEYS.all, "plans"] as const,
  plan: (code: string) => [...PAYMENT_KEYS.all, "plan", code] as const,
  subscription: () => [...PAYMENT_KEYS.all, "subscription"] as const,
  transactions: () => [...PAYMENT_KEYS.all, "transactions"] as const,
  check: (orderCode: string) =>
    [...PAYMENT_KEYS.all, "check", orderCode] as const,
};

// ==================== QUERY HOOKS ====================

/**
 * Get all subscription plans (public)
 */
export const useSubscriptionPlans = () => {
  return useQuery<{ success: boolean; data: SubscriptionPlan[] }, AxiosError>({
    queryKey: PAYMENT_KEYS.plans(),
    queryFn: async () => {
      const { data } = await axiosInstance.get(PAYMENT_ENDPOINTS.PLANS);
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

/**
 * Get plan by code
 */
export const usePlanByCode = (code: string) => {
  return useQuery<{ success: boolean; data: SubscriptionPlan }, AxiosError>({
    queryKey: PAYMENT_KEYS.plan(code),
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        PAYMENT_ENDPOINTS.PLAN_BY_CODE(code)
      );
      return data;
    },
    enabled: !!code,
  });
};

/**
 * Get current user's subscription
 */
export const useCurrentSubscription = (enabled: boolean = true) => {
  return useQuery<
    { success: boolean; data: Subscription | null; message?: string },
    AxiosError
  >({
    queryKey: PAYMENT_KEYS.subscription(),
    queryFn: async () => {
      const { data } = await axiosInstance.get(PAYMENT_ENDPOINTS.SUBSCRIPTION);
      return data;
    },
    enabled,
  });
};

/**
 * Get user's transaction history
 */
export const useTransactions = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return useQuery<
    {
      success: boolean;
      data: Transaction[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    },
    AxiosError
  >({
    queryKey: [...PAYMENT_KEYS.transactions(), params],
    queryFn: async () => {
      const { data } = await axiosInstance.get(PAYMENT_ENDPOINTS.TRANSACTIONS, {
        params,
      });
      return data;
    },
  });
};

/**
 * Check payment status (polling)
 */
export const useCheckPayment = (
  orderCode: string,
  enabled: boolean = false
) => {
  return useQuery<{ success: boolean } & PaymentCheckResponse, AxiosError>({
    queryKey: PAYMENT_KEYS.check(orderCode),
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        PAYMENT_ENDPOINTS.CHECK(orderCode)
      );
      return data;
    },
    enabled: enabled && !!orderCode,
    refetchInterval: enabled ? 5000 : false, // Poll every 5 seconds when enabled
  });
};

// ==================== MUTATION HOOKS ====================

/**
 * Create payment request
 */
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; data: PaymentCreateResponse },
    AxiosError<{ message?: string }>,
    { planCode: string }
  >({
    mutationFn: async ({ planCode }) => {
      const { data } = await axiosInstance.post(PAYMENT_ENDPOINTS.CREATE, {
        planCode,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.subscription() });
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.transactions() });
    },
  });
};

/**
 * Cancel subscription
 */
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    AxiosError<{ message?: string }>
  >({
    mutationFn: async () => {
      const { data } = await axiosInstance.post(
        PAYMENT_ENDPOINTS.CANCEL_SUBSCRIPTION
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.subscription() });
    },
  });
};

/**
 * Request refund
 */
export const useRequestRefund = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    AxiosError<{ message?: string }>,
    { transactionId: string; reason: string }
  >({
    mutationFn: async ({ transactionId, reason }) => {
      const { data } = await axiosInstance.post(PAYMENT_ENDPOINTS.REFUND, {
        transactionId,
        reason,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.transactions() });
    },
  });
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format price to VND
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

/**
 * Get plan badge color
 */
export const getPlanBadgeColor = (code: string): string => {
  const colors: Record<string, string> = {
    FREE: "bg-gray-100 text-gray-800",
    BASIC: "bg-blue-100 text-blue-800",
    PRO: "bg-purple-100 text-purple-800",
    ENTERPRISE: "bg-yellow-100 text-yellow-800",
  };
  return colors[code] || "bg-gray-100 text-gray-800";
};
