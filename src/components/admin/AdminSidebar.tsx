"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  HeadphonesIcon,
  Package,
  ChevronLeft,
  Menu,
  X,
  ChevronDown,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  badge?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Building2,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Revenue",
    icon: DollarSign,
    children: [
      {
        title: "Subscriptions",
        href: "/admin/subscriptions",
        icon: Package,
      },
      {
        title: "Billing",
        href: "/admin/billing",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Content",
    href: "/admin/content",
    icon: FileText,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Support",
    href: "/admin/support",
    icon: HeadphonesIcon,
    badge: "3",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(["Revenue"]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]
    );
  };

  const renderNavItem = (item: NavItem, isChild = false) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openGroups.includes(item.title);

    // If it's a group (has children)
    if (hasChildren) {
      return (
        <div key={item.title}>
          <button
            onClick={() => !isCollapsed && toggleGroup(item.title)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              isCollapsed && "justify-center"
            )}
            title={isCollapsed ? item.title : undefined}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{item.title}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </>
            )}
          </button>
          {!isCollapsed && isOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-2">
              {item.children?.map((child) => renderNavItem(child, true))}
            </div>
          )}
        </div>
      );
    }

    // Regular nav item
    return (
      <Link
        key={item.href}
        href={item.href!}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative",
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          isCollapsed && "justify-center",
          isChild && "py-2"
        )}
        title={isCollapsed ? item.title : undefined}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                {item.badge}
              </span>
            )}
          </>
        )}
        {isCollapsed && item.badge && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-gray-50 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b bg-white px-4">
        {!isCollapsed && (
          <div>
            <h2 className="text-lg font-bold text-blue-600">EduTech Admin</h2>
            <p className="text-xs text-gray-500">Control Panel</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("shrink-0", isCollapsed && "mx-auto")}
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Footer */}
      <div className="border-t bg-white p-4">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className={cn(
              "w-full",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            size="sm"
            title={isCollapsed ? "Back to Dashboard" : undefined}
          >
            <ChevronLeft className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && "Back to Dashboard"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
