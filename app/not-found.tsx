"use client";

import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";

export default function NotFound() {
  const { user } = useUserStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Image */}
        <div className="relative w-full h-64 md:h-96 mb-8">
          <Image
            src="/images/util/not-found.jpg"
            alt="Page not found"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Text */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Trang không tồn tại
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={
              user
                ? user.role === "STUDENT"
                  ? "/home"
                  : user.role === "ADMIN"
                    ? "/admin/dashboard"
                    : "/dashboard"
                : "/"
            }
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Về trang chủ
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Đăng nhập
          </Link>
        </div>

        {/* Help text */}
        <p className="mt-8 text-sm text-gray-500">
          Nếu bạn nghĩ đây là lỗi, vui lòng{" "}
          <a
            href="mailto:support@edutech.vn"
            className="text-blue-600 hover:underline"
          >
            liên hệ với chúng tôi
          </a>
        </p>
      </div>
    </div>
  );
}
