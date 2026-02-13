"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, User as UserIcon, KeyRound, LogOut, Menu } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CoreLoading } from "@/components/atoms/CoreLoading";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/useUserStore";
import type { User } from "@/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user: storeUser, isAuthenticated } = useUserStore();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    useUserStore.getState().clearUser();
    router.push("/login");
  };

  if (!user) {
    return <CoreLoading message="Checking authorization..." fullScreen />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Panel
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                Quản trị hệ thống
              </p>
            </div>
          </div>

          {/* Right side: Notification + User */}
          <div className="flex items-center gap-3">
            {/* Notification */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">
                      {user.name || "Admin"}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user.name || "Admin"}</p>
                    <p className="text-xs text-gray-500 font-normal">
                      {user.email || "admin@edu.vn"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
