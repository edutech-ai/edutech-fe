import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  NotificationListResponse,
  UnreadCountResponse,
  MarkReadResponse,
  MarkAllReadResponse,
} from "@/types/notification";

// ==================== QUERY KEYS ====================

export const NOTIFICATION_KEYS = {
  all: ["notifications"] as const,
  lists: (filter?: { unread?: 0 | 1 }) =>
    [...NOTIFICATION_KEYS.all, "list", filter ?? {}] as const,
  unreadCount: () => [...NOTIFICATION_KEYS.all, "unread-count"] as const,
};

// ==================== QUERY HOOKS ====================

/**
 * Paginated notifications using infinite query (5 per page).
 * Pass unread=1 to fetch only unread notifications.
 */
export const useNotifications = (filter?: { unread?: 0 | 1 }) => {
  return useInfiniteQuery<NotificationListResponse, AxiosError>({
    queryKey: NOTIFICATION_KEYS.lists(filter),
    queryFn: async ({ pageParam }) => {
      const { data } = await axiosInstance.get<NotificationListResponse>(
        API_ENDPOINTS.NOTIFICATION.BASE,
        { params: { page: pageParam, per_page: 5, ...filter } }
      );
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.pagination;
      return current_page < last_page ? current_page + 1 : undefined;
    },
  });
};

/**
 * Unread notification count. Polls every 30s.
 */
export const useUnreadCount = () => {
  return useQuery<UnreadCountResponse, AxiosError>({
    queryKey: NOTIFICATION_KEYS.unreadCount(),
    queryFn: async () => {
      const { data } = await axiosInstance.get<UnreadCountResponse>(
        API_ENDPOINTS.NOTIFICATION.UNREAD_COUNT
      );
      return data;
    },
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
};

// ==================== MUTATION HOOKS ====================

/**
 * Mark a single notification as read.
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<MarkReadResponse, AxiosError, string>({
    mutationFn: async (notificationId: string) => {
      const { data } = await axiosInstance.post<MarkReadResponse>(
        API_ENDPOINTS.NOTIFICATION.READ(notificationId)
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...NOTIFICATION_KEYS.all, "list"],
      });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.unreadCount(),
      });
    },
  });
};

/**
 * Mark all notifications as read.
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<MarkAllReadResponse, AxiosError>({
    mutationFn: async () => {
      const { data } = await axiosInstance.post<MarkAllReadResponse>(
        API_ENDPOINTS.NOTIFICATION.READ_ALL
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...NOTIFICATION_KEYS.all, "list"],
      });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.unreadCount(),
      });
    },
  });
};
