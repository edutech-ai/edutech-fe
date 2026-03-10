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
  myBugs: () => ["bugs", "mine"] as const,
  myFeatures: () => ["features", "mine"] as const,
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

export const useUpdateBugReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...body
    }: {
      id: number;
      title: string;
      description: string;
      attachments?: string[];
    }) => {
      const { data } = await axiosInstance.put(
        API_ENDPOINTS.REPORT.BUG_BY_ID(id),
        body
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugs"] });
      toast.success("Đã cập nhật báo cáo.");
    },
    onError: () => {
      toast.error("Cập nhật thất bại, vui lòng thử lại.");
    },
  });
};

export const useDeleteBugReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(
        API_ENDPOINTS.REPORT.BUG_BY_ID(id)
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugs"] });
      toast.success("Đã xoá báo cáo.");
    },
    onError: () => {
      toast.error("Xoá thất bại, vui lòng thử lại.");
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

export const useUpdateFeatureRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...body
    }: {
      id: number;
      title: string;
      description: string;
    }) => {
      const { data } = await axiosInstance.put(
        API_ENDPOINTS.REPORT.FEATURE_BY_ID(id),
        body
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success("Đã cập nhật đề xuất.");
    },
    onError: () => {
      toast.error("Cập nhật thất bại, vui lòng thử lại.");
    },
  });
};

export const useDeleteFeatureRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(
        API_ENDPOINTS.REPORT.FEATURE_BY_ID(id)
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success("Đã xoá đề xuất.");
    },
    onError: () => {
      toast.error("Xoá thất bại, vui lòng thử lại.");
    },
  });
};

export const useMyBugReports = () => {
  return useQuery<ListResponse<BugReport>>({
    queryKey: REPORT_KEYS.myBugs(),
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        API_ENDPOINTS.PROFILE.MY_REPORTS
      );
      return data;
    },
  });
};

export const useMyFeatureRequests = () => {
  return useQuery<ListResponse<FeatureRequest>>({
    queryKey: REPORT_KEYS.myFeatures(),
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        API_ENDPOINTS.PROFILE.MY_FEATURES
      );
      return data;
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

export const useAdminUpdateBugStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await axiosInstance.patch(
        API_ENDPOINTS.REPORT.BUG_STATUS(id),
        { status }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugs"] });
      toast.success("Đã cập nhật trạng thái.");
    },
    onError: () => {
      toast.error("Cập nhật thất bại.");
    },
  });
};

export const useAdminUpdateFeatureStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await axiosInstance.patch(
        API_ENDPOINTS.REPORT.FEATURE_STATUS(id),
        { status }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success("Đã cập nhật trạng thái.");
    },
    onError: () => {
      toast.error("Cập nhật thất bại.");
    },
  });
};
