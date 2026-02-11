"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/services/notificationService";
import type { NotificationBackend } from "@/types/notification";

function NotificationItem({
  notification,
  onClick,
}: {
  notification: NotificationBackend;
  onClick: () => void;
}) {
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50",
        !notification.is_read && "bg-blue-50/50"
      )}
    >
      <Image
        src="/images/icons/icon_notification.svg"
        alt=""
        width={32}
        height={32}
        className="shrink-0 mt-0.5"
      />

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm leading-snug",
            !notification.is_read
              ? "font-semibold text-gray-900"
              : "text-gray-700"
          )}
        >
          {notification.title}
        </p>
        <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
          {notification.message}
        </p>
        <p className="mt-1 text-[11px] text-gray-400">{timeAgo}</p>
      </div>

      {!notification.is_read && (
        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
      )}
    </button>
  );
}

function NotificationList({
  filter,
  onNotificationClick,
}: {
  filter?: { unread?: 0 | 1 };
  onNotificationClick: (notification: NotificationBackend) => void;
}) {
  const [hasClickedLoadMore, setHasClickedLoadMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useNotifications(filter);

  const notifications: NotificationBackend[] =
    data?.pages.flatMap((page) => page.data) ?? [];

  const handleLoadMore = useCallback(() => {
    setHasClickedLoadMore(true);
    fetchNextPage();
  }, [fetchNextPage]);

  // IntersectionObserver for infinite scroll (after first "load more")
  useEffect(() => {
    if (!hasClickedLoadMore || !hasNextPage) return;

    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: "0px 0px 100px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasClickedLoadMore, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div ref={scrollContainerRef} className="max-h-100 overflow-y-auto">
      {isLoading ? (
        <div className="space-y-1 p-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 rounded-lg p-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4">
          <Image
            src="/images/empty/empty_notification.svg"
            alt="Không có thông báo"
            width={118}
            height={104}
          />
          <p className="mt-3 text-sm text-gray-500">
            {filter?.unread
              ? "Không có thông báo chưa đọc"
              : "Bạn chưa có thông báo nào"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-0.5 p-1">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => onNotificationClick(notification)}
              />
            ))}
          </div>

          {/* "Xem thêm" button*/}
          {!hasClickedLoadMore && hasNextPage && (
            <div className="px-4 py-2">
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="w-full rounded-md py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
              >
                {isFetchingNextPage ? "Đang tải..." : "Xem thêm"}
              </button>
            </div>
          )}

          {/* Infinite scroll sentinel */}
          {hasClickedLoadMore && hasNextPage && (
            <div ref={loadMoreSentinelRef} className="flex justify-center py-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            </div>
          )}

          {/* End of list */}
          {!hasNextPage && notifications.length > 5 && (
            <p className="py-3 text-center text-xs text-gray-400">
              Đã hiển thị tất cả thông báo
            </p>
          )}
        </>
      )}
    </div>
  );
}

type Tab = "all" | "unread";

export function NotificationPopover() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const { data: unreadData } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const unreadCount = unreadData?.data?.unread_count ?? 0;

  const handleNotificationClick = (notification: NotificationBackend) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    if (notification.url) {
      setIsOpen(false);
      router.push(notification.url);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead.mutate();
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setActiveTab("all");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Image
            src="/images/icons/icon_notification.svg"
            alt="Thông báo"
            width={32}
            height={32}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={8} className="w-95 p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">Thông báo</h3>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markAllAsRead.isPending}
              className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "flex-1 py-2 text-sm font-medium text-center transition-colors",
              activeTab === "all"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={cn(
              "flex-1 py-2 text-sm font-medium text-center transition-colors",
              activeTab === "unread"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Chưa đọc
            {unreadCount > 0 && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "all" ? (
          <NotificationList onNotificationClick={handleNotificationClick} />
        ) : (
          <NotificationList
            filter={{ unread: 1 }}
            onNotificationClick={handleNotificationClick}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
