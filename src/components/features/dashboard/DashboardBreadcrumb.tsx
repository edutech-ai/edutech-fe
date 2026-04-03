"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { mockFolders } from "@/data/library";

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Page name mapping
  const pageNames: Record<string, string> = {
    "/dashboard": "Tổng quan",
    "/dashboard/library": "Thư viện",
    "/dashboard/quiz": "Tạo đề thi",
    "/dashboard/quiz/new": "Tạo đề mới",
    "/dashboard/quiz/matrix": "Từ ma trận",
    "/dashboard/quiz/upload": "Từ tài liệu",
    "/dashboard/quiz/prompt": "Từ chủ đề",
    "/dashboard/exam-matrix": "Ma trận đề thi",
    "/dashboard/classroom": "Quản lý lớp học",
    "/dashboard/slide-creator": "Slide bài giảng",
    "/dashboard/analytics": "Thống kê",
    "/dashboard/settings": "Cài đặt",
    "/dashboard/exam-matrix/new": "Tạo mới",
    "/dashboard/profile": "Thông tin cá nhân",
    "/dashboard/bug-report": "Báo lỗi hệ thống",
    "/dashboard/feature-request": "Đề xuất tính năng",
    "/dashboard/explore": "Khám phá đề thi",
  };

  // Build folder hierarchy from current folder ID
  const buildFolderHierarchy = (folderId: string | null) => {
    if (!folderId || folderId === "null") return [];

    const hierarchy = [];
    let currentId: string | null = folderId;

    // Build the chain from current folder up to root
    while (currentId) {
      const folder = mockFolders.find((f) => f.id === currentId);
      if (!folder) break;

      hierarchy.unshift(folder); // Add to beginning
      currentId = folder.parentId;
    }

    return hierarchy;
  };

  // Build breadcrumb items from pathname
  const buildBreadcrumb = () => {
    const paths = pathname.split("/").filter(Boolean);

    // Only show breadcrumb if we're in a sub-page of dashboard
    if (paths.length <= 1) {
      return [];
    }

    const items: Array<{
      name: string;
      path: string;
      icon: React.ReactNode;
    }> = [];
    let currentPath = "";

    paths.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Add icon only for dashboard (first item)
      const icon = index === 0 ? <Home className="w-4 h-4" /> : null;

      items.push({
        name: pageNames[currentPath] || segment,
        path: currentPath,
        icon,
      });
    });

    // If we're on library page, add folder hierarchy
    if (pathname === "/dashboard/library") {
      const folderId = searchParams.get("folder");
      const folderHierarchy = buildFolderHierarchy(folderId);

      folderHierarchy.forEach((folder) => {
        items.push({
          name: folder.name,
          path: `/dashboard/library?folder=${folder.id}`,
          icon: null,
        });
      });
    }

    return items;
  };

  const breadcrumbItems = buildBreadcrumb();

  // Don't show breadcrumb if we're on dashboard home
  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center gap-1 text-sm bg-white px-4 py-2.5 rounded-lg border border-gray-200 mb-4">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <div key={item.path} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            )}
            <button
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                isLast
                  ? "text-gray-900 font-medium bg-gray-100"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
              onClick={() => router.push(item.path)}
              disabled={isLast}
            >
              {item.icon}
              <span className="max-w-37.5 truncate" title={item.name}>
                {item.name}
              </span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
