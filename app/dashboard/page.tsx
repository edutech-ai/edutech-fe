"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileQuestion,
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";
import { CoreLoading } from "@/components/atoms/CoreLoading";
import { analyticsMockService } from "@/services/mock";
import type { AnalyticsData, User } from "@/types";
import { useUserStore } from "@/store/useUserStore";
import { UpgradeBanner } from "@/components/molecules/upgrade-banner";
import { PricingModal } from "@/components/organisms/dashboard/pricing-modal";
import { InviteFriendModal } from "@/components/organisms/dashboard/invite-friend-modal";
import Image from "next/image";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isInviteFriendModalOpen, setIsInviteFriendModalOpen] = useState(false);

  const { user, setUser, isPaidUser } = useUserStore();

  useEffect(() => {
    // Load user from localStorage if not in store
    const userData = localStorage.getItem("user");
    if (userData && !user) {
      try {
        const parsedUser: User = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, [user, setUser]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsMockService.getDashboardData();
        setAnalytics(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <CoreLoading message="Đang tải dữ liệu..." fullScreen />;
  }

  if (!analytics) return null;

  const stats = [
    {
      name: "Đề thi",
      value: analytics.totalQuizzes,
      icon: FileQuestion,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      href: "/dashboard/library?tab=quizzes",
    },
    {
      name: "Giáo án",
      value: analytics.totalLessonPlans,
      icon: BookOpen,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      href: "/dashboard/library?tab=lessons",
    },
    {
      name: "Học sinh",
      value: analytics.totalStudents,
      icon: Users,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      href: "/dashboard/classroom?tab=data",
    },
    {
      name: "Điểm trung bình",
      value: analytics.averageScore.toFixed(1),
      icon: TrendingUp,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      href: "/dashboard/classroom?tab=data",
    },
  ];

  const quickActions = [
    {
      title: "Tạo đề thi với AI",
      description: "Tạo đề kiểm tra tự động trong vài phút",
      href: "/dashboard/quiz",
      color: "blue",
    },
    {
      title: "Tạo giáo án",
      description: "Soạn giáo án nhanh chóng với AI",
      href: "/dashboard/library?tab=lessons",
      color: "green",
    },
    {
      title: "Ma trận đề thi",
      description: "Xây dựng ma trận đề chuẩn kiến thức",
      href: "/dashboard/exam-matrix",
      color: "purple",
    },
  ];

  return (
    <div className="space-y-8">
      {!isPaidUser() && (
        <UpgradeBanner onUpgradeClick={() => setIsPricingModalOpen(true)} />
      )}

      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Thống kê chính
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition group"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{action.description}</p>
              <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                Bắt đầu
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Hoạt động gần đây
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {analytics.recentActivities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(activity.timestamp).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Performance */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Hiệu suất theo chủ đề
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            {analytics.performanceByTopic.map((topic) => (
              <div key={topic.topic}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {topic.topic}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {topic.accuracy}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${topic.accuracy}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {topic.correctAnswers}/{topic.totalQuestions} câu đúng
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Hoạt động khác
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
          <div
            onClick={() => setIsInviteFriendModalOpen(true)}
            className="group"
          >
            <div className="flex items-center flex-row gap-2 bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition cursor-pointer">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Mời bạn bè, thầy cô
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Chia sẻ Edutech với thầy cô, bạn bè khác!
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform w-max">
                  Mời ngay
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
              <Image
                src="/images/banner/invite-friend.svg"
                width={100}
                height={80}
                alt="Invite Friends Illustration"
                className="mt-4 hidden lg:block"
              />
            </div>
          </div>
        </div>
      </div>

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />

      <InviteFriendModal
        isOpen={isInviteFriendModalOpen}
        onClose={() => setIsInviteFriendModalOpen(false)}
      />
    </div>
  );
}
