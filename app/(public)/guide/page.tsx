import type { Metadata } from "next";
import { Header } from "@/components/organisms/header";
import { Footer } from "@/components/organisms/footer";
import { Construction, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hướng dẫn sử dụng - AI EduTech",
  description:
    "Hướng dẫn sử dụng chi tiết các tính năng của AI EduTech. Tìm hiểu cách tạo đề thi, soạn giáo án và quản lý lớp học hiệu quả.",
  keywords: [
    "hướng dẫn AI EduTech",
    "cách sử dụng AI EduTech",
    "tutorial AI EduTech",
    "hướng dẫn tạo đề thi",
    "hướng dẫn soạn giáo án",
  ],
};

export default function GuidePage() {
  return (
    <div className="min-h-screen w-full">
      <Header />

      <section className="pt-32 pb-20 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Icon */}
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Construction className="w-12 h-12 text-amber-600" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Đang phát triển
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Trang hướng dẫn sử dụng đang được xây dựng. Chúng tôi đang chuẩn
              bị nội dung chi tiết để giúp bạn sử dụng AI EduTech hiệu quả nhất.
            </p>

            {/* Features coming soon */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Sắp ra mắt:</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  Hướng dẫn tạo đề thi với AI
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  Video hướng dẫn soạn giáo án
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  Cách quản lý lớp học hiệu quả
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  FAQ và các câu hỏi thường gặp
                </li>
              </ul>
            </div>

            {/* Back button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
