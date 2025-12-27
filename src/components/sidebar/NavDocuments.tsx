"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavDocumentsProps {
  items: NavItem[];
}

export function NavDocuments({ items }: NavDocumentsProps) {
  const pathname = usePathname();

  // Tách Dashboard ra khỏi danh sách clickable items
  const dashboardItem = items.find((item) => item.title === "Dashboard");
  const menuItems = items.filter((item) => item.title !== "Dashboard");

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        {dashboardItem ? dashboardItem.title : "Quản lý"}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link
                    href={item.url}
                    className={
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-gray-900 hover:bg-accent hover:text-accent-foreground"
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
