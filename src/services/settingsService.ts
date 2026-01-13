import { createQueryHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface PricePlan {
  id: string;
  plan_name: string;
  description: string;
  price: number;
  discount_percent: number;
  billing_type: "monthly" | "yearly";
  button_text: string;
  benefits: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePricePlanRequest {
  plan_name: string;
  description: string;
  price: number;
  discount_percent?: number;
  billing_type: "monthly" | "yearly";
  button_text?: string;
  benefits?: string[];
  display_order?: number;
}

export interface UpdatePricePlanRequest {
  plan_name?: string;
  description?: string;
  price?: number;
  discount_percent?: number;
  billing_type?: "monthly" | "yearly";
  button_text?: string;
  benefits?: string[];
  is_active?: boolean;
  display_order?: number;
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
export const useGetPricingPlans = (activeOnly = true) => {
  return useQueryClient().fetchQuery({
    queryKey: ["pricing-plans", activeOnly],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SETTINGS.PRICE_PLANS}?active=${activeOnly}`
      );
      return response.data;
    },
  });
};

// Get pricing plan by ID
export const useGetPricingPlanById = (id: string) => {
  return createQueryHook(
    "pricing-plan",
    `${API_ENDPOINTS.SETTINGS.PRICE_PLANS}/${id}`
  )();
};

// Create pricing plan
export const useCreatePricingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePricePlanRequest) =>
      axiosInstance.post(API_ENDPOINTS.SETTINGS.PRICE_PLANS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-plans"] });
    },
  });
};

// Update pricing plan
export const useUpdatePricingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePricePlanRequest }) =>
      axiosInstance.put(`${API_ENDPOINTS.SETTINGS.PRICE_PLANS}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-plans"] });
    },
  });
};

// Delete pricing plan
export const useDeletePricingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(`${API_ENDPOINTS.SETTINGS.PRICE_PLANS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-plans"] });
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
