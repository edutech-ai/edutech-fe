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
import { analyticsMockService } from "@/services/mock";
import type { AnalyticsData } from "@/types";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!analytics) return null;

  const stats = [
    {
      name: "Đề thi",
      value: analytics.totalQuizzes,
      icon: FileQuestion,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      href: "/dashboard/library",
    },
    {
      name: "Giáo án",
      value: analytics.totalLessonPlans,
      icon: BookOpen,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      href: "/dashboard/library",
    },
    {
      name: "Học sinh",
      value: analytics.totalStudents,
      icon: Users,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      href: "/dashboard/analytics",
    },
    {
      name: "Điểm TB",
      value: analytics.averageScore.toFixed(1),
      icon: TrendingUp,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      href: "/dashboard/analytics",
    },
  ];

  const quickActions = [
    {
      title: "Tạo đề thi với AI",
      description: "Tạo đề kiểm tra tự động trong vài phút",
      href: "/dashboard/quiz-generator",
      color: "blue",
    },
    {
      title: "Tạo giáo án",
      description: "Soạn giáo án nhanh chóng với AI",
      href: "/dashboard/lesson-plan",
      color: "green",
    },
    {
      title: "Ma trận đề thi",
      description: "Xây dựng ma trận đề chuẩn kiến thức",
      href: "/dashboard/matrix",
      color: "purple",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
    </div>
  );
}
