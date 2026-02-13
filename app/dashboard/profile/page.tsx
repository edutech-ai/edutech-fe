"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Lock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileInfoForm } from "./profile-info";
import { ChangePasswordForm } from "./change-password";

type Tab = "profile" | "change-password";

const tabs = [
  {
    id: "profile" as Tab,
    label: "Thông tin tài khoản",
    icon: User,
  },
  {
    id: "change-password" as Tab,
    label: "Đổi mật khẩu",
    icon: Lock,
  },
];

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as Tab) || "profile";

  const handleTabChange = (tabId: Tab) => {
    if (tabId === "profile") {
      router.push("/dashboard/profile");
    } else {
      router.push(`/dashboard/profile?tab=${tabId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold">Cài đặt</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Quản lý thông tin cá nhân và bảo mật tài khoản
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg border p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors",
                      isActive
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {activeTab === "profile" && <ProfileInfoForm />}
          {activeTab === "change-password" && <ChangePasswordForm />}
        </main>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-100">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
