"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    id: "01",
    title: "Soạn bài tự động",
    desc: "Tạo giáo án, đề thi và slide bài giảng chỉ trong vài giây. Chuẩn hóa theo quy định mới nhất của Bộ Giáo dục.",
  },
  {
    id: "02",
    title: "Chấm điểm AI",
    desc: "Chấm bài trắc nghiệm và tự luận qua camera điện thoại. Phân tích lỗi sai và gợi ý cách khắc phục cho từng học sinh.",
  },
  {
    id: "03",
    title: "Quản lý lớp học",
    desc: "Theo dõi chuyên cần, điểm số và tiến độ học tập. Báo cáo trực quan giúp giáo viên nắm bắt tình hình lớp học tức thì.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-white relative overflow-hidden">
      {/* Minimal Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-gray-50 to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left: Sticky Header */}
          <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit space-y-8">
            <h2 className="text-5xl font-bold text-gray-900 tracking-tight leading-[1.1]">
              Tính năng <br />
              <span className="text-gray-400">nổi bật.</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Mọi công cụ bạn cần để giảng dạy hiệu quả hơn, được tích hợp trong
              một nền tảng duy nhất.
            </p>
            <Link
              href="/register"
              className="group inline-flex items-center text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Khám phá ngay
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>

          {/* Right: Feature List (No Icons, Just Typography) */}
          <div className="lg:w-2/3 space-y-16">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="group border-t border-gray-100 pt-12 transition-all duration-500 hover:border-gray-300"
              >
                <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                  <span className="text-6xl font-light text-gray-200 group-hover:text-gray-300 transition-colors font-mono">
                    {feature.id}
                  </span>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xl text-gray-500 leading-relaxed max-w-xl">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
