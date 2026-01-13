"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HelpCircle, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQManagement } from "./faq";

type Tab = "faq" | "seo";

const tabs = [
  {
    id: "faq" as Tab,
    label: "Câu hỏi thường gặp",
    icon: HelpCircle,
  },
  {
    id: "seo" as Tab,
    label: "SEO",
    icon: Search,
    comingSoon: true,
  },
];

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as Tab) || "faq";

  const handleTabChange = (tabId: Tab) => {
    if (tabId === "faq") {
      router.push("/admin/settings");
    } else {
      router.push(`/admin/settings?tab=${tabId}`);
    }
  };

  return (
    <div className="w-full h-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
        <p className="text-sm text-gray-600 mt-1">
          Quản lý cấu hình và thiết lập hệ thống
        </p>
      </div>

      {/* Subnav Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <nav className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDisabled = tab.comingSoon;

            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && handleTabChange(tab.id)}
                disabled={isDisabled}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : isDisabled
                      ? "border-transparent text-gray-400 cursor-not-allowed"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.comingSoon && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                    Coming soon
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <div className="p-4 md:p-6 lg:p-8">
          {activeTab === "faq" && <FAQManagement />}
          {activeTab === "seo" && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                SEO Settings
              </h3>
              <p className="text-gray-600">
                Tính năng này sẽ được cập nhật trong thời gian tới
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-100">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
