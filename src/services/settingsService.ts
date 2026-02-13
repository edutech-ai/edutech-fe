import { createQueryHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPlanRequest {
  code: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number;
  maxClasses: number | null;
  maxQuizzesPerMonth: number | null;
  maxStorageMb: number | null;
  hasAdvancedAi: boolean;
  features: string[];
  displayOrder: number;
}

export interface UpdateSubscriptionPlanRequest {
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  durationDays?: number;
  maxClasses?: number | null;
  maxQuizzesPerMonth?: number | null;
  maxStorageMb?: number | null;
  hasAdvancedAi?: boolean;
  features?: string[];
  isActive?: boolean;
  displayOrder?: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  category?: string;
  display_order?: number;
}

export interface UpdateFAQRequest {
  question?: string;
  answer?: string;
  category?: string;
  is_active?: boolean;
  display_order?: number;
}

// ==================== PRICING PLANS SERVICES ====================

// Get all pricing plans
export const useGetSubscriptionPlans = (activeOnly = true) => {
  return useQueryClient().fetchQuery({
    queryKey: ["subscription-plans", activeOnly],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SETTINGS.SUBSCRIPTION_PLANS}?active=${activeOnly}`
      );
      return response.data;
    },
  });
};

// Get subscription plan by ID
export const useGetSubscriptionPlanById = (id: string) => {
  return createQueryHook(
    "subscription-plan",
    `${API_ENDPOINTS.SETTINGS.SUBSCRIPTION_PLANS}/${id}`
  )();
};

// Create subscription plan
export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionPlanRequest) =>
      axiosInstance.post(API_ENDPOINTS.SETTINGS.SUBSCRIPTION_PLANS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    },
  });
};

// Update subscription plan
export const useUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSubscriptionPlanRequest;
    }) =>
      axiosInstance.put(
        `${API_ENDPOINTS.SETTINGS.SUBSCRIPTION_PLANS}/${id}`,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    },
  });
};

// Delete subscription plan
export const useDeleteSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(
        `${API_ENDPOINTS.SETTINGS.SUBSCRIPTION_PLANS}/${id}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    },
  });
};

// ==================== FAQ SERVICES ====================

// Get all FAQs
export const useGetFAQs = (activeOnly = true) => {
  return useQueryClient().fetchQuery({
    queryKey: ["faqs", activeOnly],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SETTINGS.FAQS}?active=${activeOnly}`
      );
      return response.data;
    },
  });
};

// Get FAQ by ID
export const useGetFAQById = (id: string) => {
  return createQueryHook("faq", `${API_ENDPOINTS.SETTINGS.FAQS}/${id}`)();
};

// Create FAQ
export const useCreateFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFAQRequest) =>
      axiosInstance.post(API_ENDPOINTS.SETTINGS.FAQS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};

// Update FAQ
export const useUpdateFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFAQRequest }) =>
      axiosInstance.put(`${API_ENDPOINTS.SETTINGS.FAQS}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};

// Delete FAQ
export const useDeleteFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(`${API_ENDPOINTS.SETTINGS.FAQS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};
