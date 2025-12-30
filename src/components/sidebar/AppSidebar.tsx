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
  BarChart3,
  Settings,
  X,
  Users,
  Grid3x3,
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
    url: "/dashboard/quiz-generator",
    icon: FileQuestion,
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
  {
    title: "Thư viện",
    url: "/dashboard/library",
    icon: Library,
  },
  {
    title: "Thống kê",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Cài đặt",
    url: "/dashboard/settings",
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
      <div className="h-16 flex items-center justify-between border-b border-gray-200 px-3 overflow-hidden">
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
              width={isCollapsed ? 40 : 150}
              height={40}
              className="shrink-0 transition-all duration-300 ease-in-out"
              style={{ width: "auto", height: "auto", maxHeight: "40px" }}
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
        <div className="space-y-1 px-2">
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out overflow-hidden",
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span
                  className={cn(
                    "text-sm whitespace-nowrap transition-all duration-300 ease-in-out",
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
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} />
      </aside>

      {/* Mobile Sidebar - Sheet Drawer */}
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-64 p-0 [&>button]:hidden">
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
