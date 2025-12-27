"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  FileQuestion,
  BookOpen,
  Library,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Loading } from "@/components/ui/Loading";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check authentication and load user data
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
    } else if (!user) {
      // Only parse and set user if not already loaded
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(userData));
    }
  }, [router, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return <Loading message="Đang kiểm tra xác thực..." fullScreen />;
  }

  const navigation = [
    { name: "Trang chủ", href: "/dashboard", icon: Home },
    {
      name: "Tạo đề thi",
      href: "/dashboard/quiz-generator",
      icon: FileQuestion,
    },
    { name: "Tạo giáo án", href: "/dashboard/lesson-plan", icon: BookOpen },
    { name: "Thư viện", href: "/dashboard/library", icon: Library },
    { name: "Thống kê", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Cài đặt", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/images/logo/logo.svg"
                  alt="EduTech Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-gray-900">
                  EduTech
                </span>
                <span className="text-[10px] text-gray-500">AI Assistant</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                <item.icon className="w-5 h-5 mr-3 text-gray-500" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                Xin chào, {user.name}!
              </h1>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard/quiz-generator"
                className="hidden sm:block px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Tạo đề thi
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
