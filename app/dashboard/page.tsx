"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CoreLoading } from "@/components/atoms/CoreLoading";
import {
  useTeacherStats,
  useRecentActivities,
} from "@/services/profileService";
import { useUserStore } from "@/store/useUserStore";
import { UpgradeBanner } from "@/components/molecules/upgrade-banner";
import { PricingModal } from "@/components/organisms/dashboard/pricing-modal";
import { InviteFriendModal } from "@/components/organisms/dashboard/invite-friend-modal";
import Image from "next/image";

export default function DashboardPage() {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isInviteFriendModalOpen, setIsInviteFriendModalOpen] = useState(false);

  const { isPaidUser } = useUserStore();
  const { data: teacherStats, isLoading: statsLoading } = useTeacherStats();
  const { data: recentActivities = [], isLoading: activitiesLoading } =
    useRecentActivities();

  if (statsLoading) {
    return <CoreLoading message="Đang tải dữ liệu..." fullScreen />;
  }

  const stats = [
    {
      name: "Đề thi",
      value: teacherStats?.total_quizzes ?? 0,
      iconSrc: "/images/icons/icon_test.svg",
      href: "/dashboard/library?tab=quizzes",
    },
    {
      name: "Ma trận",
      value: teacherStats?.total_matrices ?? 0,
      iconSrc: "/images/icons/icon_create_matrix.svg",
      href: "/dashboard/exam-matrix",
    },
    {
      name: "Học sinh",
      value: teacherStats?.total_students ?? 0,
      iconSrc: "/images/icons/icon_student.svg",
      href: "/dashboard/classroom?tab=data",
    },
    {
      name: "Lớp học",
      value: teacherStats?.total_classrooms ?? 0,
      iconSrc: "/images/icons/icon_class.svg",
      href: "/dashboard/classroom",
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
      href: "/dashboard/library",
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
              <Image
                src={stat.iconSrc}
                alt={stat.name}
                width={48}
                height={48}
              />
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
          {activitiesLoading ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Đang tải...
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="p-8 text-center">
              <Image
                src="/images/empty/empty_previous_activities.svg"
                alt="Chưa có hoạt động"
                width={136}
                height={108}
                className="mx-auto mb-3"
              />
              <p className="text-gray-500 text-sm">Chưa có hoạt động nào</p>
            </div>
          ) : (
            recentActivities.slice(0, 5).map((activity, idx) => (
              <div
                key={`${activity.type}-${activity.timestamp}-${idx}`}
                className="p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-start space-x-3">
                  <Image
                    src={
                      activity.type === "quiz_created"
                        ? "/images/icons/icon_create_quiz.svg"
                        : activity.type === "matrix_created"
                          ? "/images/icons/icon_create_matrix.svg"
                          : "/images/icons/icon_mark.svg"
                    }
                    alt={activity.type}
                    width={40}
                    height={40}
                    className="shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(activity.timestamp).toLocaleDateString(
                        "vi-VN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
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
