import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { toast } from "sonner";

export interface BugReport {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: "pending" | "confirmed" | "fixed";
  attachments: string[];
  author_name: string;
  avatar_url: string | null;
  is_own: boolean;
  created_at: string;
}

export interface FeatureRequest {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: "pending" | "confirmed" | "deployed";
  likes_count: number;
  liked: boolean;
  author_name: string;
  avatar_url: string | null;
  is_own: boolean;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ListResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

// ─── Query Keys ───────────────────────────────────────────────

export const REPORT_KEYS = {
  bugs: (params?: Record<string, unknown>) => ["bugs", params] as const,
  features: (params?: Record<string, unknown>) => ["features", params] as const,
};

// ─── Bug Report Hooks ─────────────────────────────────────────

export const useBugReports = (
  params: { status?: string; mine?: boolean } = {}
) => {
  return useQuery<ListResponse<BugReport>>({
    queryKey: REPORT_KEYS.bugs(params),
    queryFn: async () => {
      const { data } = await axiosInstance.get(API_ENDPOINTS.REPORT.BUGS, {
        params,
      });
      return data;
    },
  });
};

export const useCreateBugReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      title: string;
      description: string;
      attachments?: string[];
    }) => {
      const { data } = await axiosInstance.post(
        API_ENDPOINTS.REPORT.BUGS,
        body
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugs"] });
      toast.success(
        "Báo cáo lỗi đã được gửi! Chúng tôi sẽ xem xét sớm nhất có thể."
      );
    },
    onError: () => {
      toast.error("Gửi báo cáo thất bại, vui lòng thử lại.");
    },
  });
};

// ─── Feature Request Hooks ────────────────────────────────────

export const useFeatureRequests = (
  params: { status?: string; mine?: boolean } = {}
) => {
  return useQuery<ListResponse<FeatureRequest>>({
    queryKey: REPORT_KEYS.features(params),
    queryFn: async () => {
      const { data } = await axiosInstance.get(API_ENDPOINTS.REPORT.FEATURES, {
        params,
      });
      return data;
    },
  });
};

export const useCreateFeatureRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { title: string; description: string }) => {
      const { data } = await axiosInstance.post(
        API_ENDPOINTS.REPORT.FEATURES,
        body
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success("Đề xuất của bạn đã được gửi thành công!");
    },
    onError: () => {
      toast.error("Gửi đề xuất thất bại, vui lòng thử lại.");
    },
  });
};

export const useToggleFeatureLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.post(
        API_ENDPOINTS.REPORT.FEATURE_LIKE(id)
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
    onError: () => {
      toast.error("Thao tác thất bại, vui lòng thử lại.");
    },
  });
};
