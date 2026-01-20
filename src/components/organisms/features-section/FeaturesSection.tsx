"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ImageModal } from "@/components/molecules/image-modal";

const features = [
  {
    id: "create-exam",
    label: "Tạo đề thi",
    title: "Tạo đề tự động",
    desc: "AI tạo đề thi, ma trận và slide bài giảng chuẩn Bộ GD chỉ trong vài giây. Tùy chỉnh độ khó dễ dàng.",
    // Colors
    color: "bg-blue-600",
    lightColor: "bg-blue-500",
    textColor: "text-blue-200",
    buttonColor: "bg-white text-blue-600 hover:bg-blue-50",
    // Assets
    iconPath: "/images/home/create-exam-icon.svg",
    previewPath: "/images/home/create-exam-preview.png",
  },
  {
    id: "ai-grading",
    label: "Chấm điểm AI",
    title: "Chấm bài Camera",
    desc: "Quét bài làm qua điện thoại. Chấm trắc nghiệm & tự luận siêu tốc, phân tích lỗi sai chi tiết.",
    // Colors
    color: "bg-emerald-600",
    lightColor: "bg-emerald-500",
    textColor: "text-emerald-100",
    buttonColor: "bg-white text-emerald-600 hover:bg-emerald-50",
    // Assets
    iconPath: "/images/home/ai-grading-icon.svg",
    previewPath: "/images/home/ai-grading-preview.png",
  },
  {
    id: "class-management",
    label: "Quản lý lớp",
    title: "Lớp học số",
    desc: "Điểm danh, theo dõi chuyên cần và báo cáo học tập trực quan giúp giáo viên nắm bắt tình hình.",
    // Colors
    color: "bg-orange-500",
    lightColor: "bg-orange-400",
    textColor: "text-orange-100",
    buttonColor: "bg-white text-orange-600 hover:bg-orange-50",
    // Assets
    iconPath: "/images/home/class-management-icon.svg",
    previewPath: "/images/home/class-management-preview.png",
  },
];

export function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Auto-switch logic
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const activeFeature = features[activeIndex];

  return (
    <section
      id="features"
      className="py-12 md:py-24 bg-gray-50/50 relative overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.2] bg-center" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Nền tảng giáo dục <span className="text-blue-600">toàn diện</span>
          </h2>
          <p className="text-lg text-gray-600">
            Công nghệ AI giúp giáo viên tiết kiệm 90% thời gian quản lý.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center p-1 bg-white rounded-full border border-gray-200 shadow-sm">
            {features.map((feature, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveIndex(index)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {feature.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-stretch h-auto min-h-[550px]">
            <div
              className="lg:col-span-8 relative rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden group cursor-pointer flex items-center justify-center p-8 lg:p-12 order-2 lg:order-1"
              onClick={() => setModalOpen(true)}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]" />

              <div className="relative w-full h-full min-h-[300px] lg:min-h-full">
                {features.map((feature, index) => (
                  <div
                    key={feature.id}
                    className={`absolute inset-0 transition-all duration-500 transform ${
                      index === activeIndex
                        ? "opacity-100 translate-x-0 scale-100"
                        : index < activeIndex
                          ? "opacity-0 -translate-x-12 scale-95"
                          : "opacity-0 translate-x-12 scale-95"
                    }`}
                  >
                    <Image
                      src={feature.previewPath}
                      alt={feature.title}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority={index === 0}
                      onError={(e) => {
                        e.currentTarget.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23f3f4f6" width="800" height="600"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EPreview Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
                <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 px-4 py-2 bg-white/90 backdrop-blur rounded-full text-sm font-medium shadow-md text-gray-900">
                  Phóng to ảnh
                </span>
              </div>
            </div>

            {/* Right Column: Colored Card (4/12 - ~33%) */}
            <div className="lg:col-span-4 order-1 lg:order-2">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`h-full w-full rounded-2xl p-6 lg:p-8 flex flex-col justify-center transition-all duration-500 ease-in-out ${
                    index === activeIndex
                      ? `opacity-100 translate-y-0 ${feature.color} shadow-xl shadow-${feature.color.split("-")[1]}-200`
                      : "hidden opacity-0 translate-y-4"
                  }`}
                >
                  <div className="w-14 h-14 mb-8 rounded-xl flex items-center justify-center">
                    <Image
                      src={feature.iconPath}
                      alt=""
                      width={48}
                      height={48}
                      className="w-12 h-12"
                    />
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>

                  <p
                    className={`text-lg leading-relaxed mb-8 ${feature.textColor}`}
                  >
                    {feature.desc}
                  </p>

                  <Link
                    href="/register"
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 w-fit group ${feature.buttonColor}`}
                  >
                    Khám phá ngay
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageSrc={activeFeature.previewPath}
        imageAlt={activeFeature.title}
        title={activeFeature.title}
      />
    </section>
  );
}
