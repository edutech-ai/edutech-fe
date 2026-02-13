"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User as UserIcon } from "lucide-react";
import { NotificationPopover } from "@/components/features/notification/NotificationPopover";
import { CoreLoading } from "@/components/atoms/CoreLoading";
import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DashboardBreadcrumb } from "@/components/features/dashboard/DashboardBreadcrumb";
import type { User } from "@/types";
import { useUserStore } from "@/store/useUserStore";
import { useCurrentSubscription } from "@/services/paymentService";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user: storeUser, isAuthenticated, setSubscription } = useUserStore();
  const [user, setUser] = useState<User | null>(null);

  const { data: subscriptionData } = useCurrentSubscription(isAuthenticated());

  useEffect(() => {
    if (subscriptionData?.data) {
      setSubscription(subscriptionData.data);
    }
  }, [subscriptionData, setSubscription]);

  useEffect(() => {
    // Check authentication from Zustand store
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Load user data from Zustand store
    if (storeUser && !user) {
      setUser({
        id: storeUser.id,
        name: storeUser.name || storeUser.email || "User",
        email: storeUser.email || "",
        role: storeUser.role || "TEACHER",
        createdAt: storeUser.createdAt,
        isPaidUser: storeUser.isPaidUser || false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, isAuthenticated, storeUser]);

  const handleLogout = () => {
    // Clear Zustand store
    useUserStore.getState().clearUser();
    router.push("/login");
  };

  if (!user) {
    return <CoreLoading message="Đang kiểm tra xác thực..." fullScreen />;
  }

  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "20rem",
          "--sidebar-width-icon": "4rem",
        } as React.CSSProperties
      }
    >
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        {/* Header + Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b bg-white px-6">
            {/* Sidebar trigger visible on all screen sizes */}
            <SidebarTrigger className="-ml-1" />

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right side: Notification + User */}
            <div className="flex items-center gap-2">
              {/* Notification */}
              <NotificationPopover />

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-1"
                  >
                    <Image
                      src="/images/icons/icon_profile.svg"
                      alt="Thông báo"
                      width={32}
                      height={32}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user.name}! 👋</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-sm text-gray-500 font-light">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/profile")}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    Thông tin cá nhân
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Cài đặt
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            <DashboardBreadcrumb />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
