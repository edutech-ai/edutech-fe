"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  FileQuestion,
  Library,
  Settings,
  X,
  Users,
  Grid3x3,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "../ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "../ui/button";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Menu data cho giáo viên
const teacherMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Tạo đề thi",
    url: "/dashboard/quiz",
    icon: FileQuestion,
  },
  {
    title: "Thư viện",
    url: "/dashboard/library",
    icon: Library,
  },
  {
    title: "Ma trận đề thi",
    url: "/dashboard/exam-matrix",
    icon: Grid3x3,
  },
  {
    title: "Quản lý lớp học",
    url: "/dashboard/classroom",
    icon: Users,
  },
  // {
  //   title: "Thống kê",
  //   url: "/dashboard/analytics",
  //   icon: BarChart3,
  // },
  {
    title: "Cài đặt",
    url: "/dashboard/profile",
    icon: Settings,
  },
];

// Sidebar content component - reused for both desktop and mobile
function SidebarContent({
  isCollapsed = false,
  onClose,
}: {
  isCollapsed?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="bg-white flex flex-col h-full">
      {/* Header */}
      <div className="h-18 flex items-center justify-between border-b border-gray-200 px-4 overflow-hidden">
        <Link
          href="/dashboard"
          className="flex items-center justify-start flex-1 min-w-0"
          onClick={onClose}
        >
          <div className="relative w-full flex items-center justify-start">
            <Image
              src={
                isCollapsed
                  ? "/images/logo/logo.svg"
                  : "/images/logo/logo-text.svg"
              }
              alt="EduTech Logo"
              width={isCollapsed ? 44 : 160}
              height={44}
              className="shrink-0 transition-all duration-300 ease-in-out"
              style={{ width: "auto", height: "auto", maxHeight: "44px" }}
            />
          </div>
        </Link>
        {/* Close button - only show on mobile */}
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {teacherMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.url === "/dashboard"
                ? pathname === item.url
                : pathname.startsWith(item.url);

            return (
              <Link
                key={item.url}
                href={item.url}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out overflow-hidden",
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className="w-6 h-6 shrink-0" />
                <span
                  className={cn(
                    "text-[15px] whitespace-nowrap transition-all duration-300 ease-in-out",
                    isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                  )}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div
        className={cn(
          "border-t border-gray-200 py-3 px-3",
          isCollapsed && "px-2"
        )}
      >
        <div className="space-y-1">
          <Link
            href="/dashboard/bug-report"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200",
              isCollapsed && "justify-center px-2"
            )}
            title={isCollapsed ? "Báo lỗi hệ thống" : undefined}
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span
              className={cn(
                "whitespace-nowrap transition-all duration-300",
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              )}
            >
              Báo lỗi hệ thống
            </span>
          </Link>
          <Link
            href="/dashboard/feature-request"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200",
              isCollapsed && "justify-center px-2"
            )}
            title={isCollapsed ? "Đề xuất tính năng" : undefined}
          >
            <Lightbulb className="w-5 h-5 shrink-0" />
            <span
              className={cn(
                "whitespace-nowrap transition-all duration-300",
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              )}
            >
              Đề xuất tính năng
            </span>
          </Link>
        </div>
        {!isCollapsed && (
          <p className="text-xs text-gray-400 text-center mt-3">
            © EduTech {new Date().getFullYear()}
          </p>
        )}
      </div>
    </div>
  );
}

export function AppSidebar() {
  const { state, openMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const pathname = usePathname();

  // Auto-close mobile sidebar when route changes
  useEffect(() => {
    if (openMobile) {
      setOpenMobile(false);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-close mobile sidebar when screen becomes desktop size
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches && openMobile) {
        setOpenMobile(false);
      }
    };

    // Check initial state
    handleResize(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, [openMobile, setOpenMobile]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex bg-white border-r-[0.5px] border-gray-200 flex-col transition-all duration-300 ease-in-out sticky top-0 h-screen",
          isCollapsed ? "w-18" : "w-72"
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} />
      </aside>

      {/* Mobile Sidebar - Sheet Drawer */}
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-72 p-0 [&>button]:hidden">
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Main navigation sidebar</SheetDescription>
          </VisuallyHidden>
          <SidebarContent onClose={() => setOpenMobile(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
