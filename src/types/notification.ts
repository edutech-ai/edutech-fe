// ==================== NOTIFICATION TYPES ====================

export type NotificationType =
  | "account"
  | "profile"
  | "payment"
  | "quiz"
  | "system"
  | "classroom";

export interface NotificationBackend {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  url: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationQueryParams {
  unread?: 0 | 1;
  page?: number;
  per_page?: number;
}

export interface NotificationPagination {
  current_page: number;
  per_page: number;
  last_page: number;
  total: number;
}

export interface NotificationListResponse {
  status: boolean;
  data: NotificationBackend[];
  pagination: NotificationPagination;
}

export interface UnreadCountResponse {
  status: boolean;
  data: {
    unread_count: number;
  };
}

export interface MarkReadResponse {
  status: boolean;
  message: string;
}

export interface MarkAllReadResponse {
  status: boolean;
  message: string;
  updated_count: number;
}
