"use client";

import { GraduationCap, Target, BookOpen, Building2 } from "lucide-react";
import { useState } from "react";

const audiences = [
  {
    icon: GraduationCap,
    title: "Giáo viên THCS/THPT",
    description: "Tối ưu hoá quy trình soạn đề, giáo án và chấm bài tự động",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Target,
    title: "Giáo viên luyện thi",
    description: "Tạo ngân hàng câu hỏi và đề thi chuyên sâu nhanh chóng",
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: BookOpen,
    title: "Trung tâm đào tạo",
    description: "Quản lý tài liệu và theo dõi tiến độ học viên hiệu quả",
    color: "green",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Building2,
    title: "Trường học & Tổ chức",
    description: "Giải pháp chuyển đổi số toàn diện cho hệ thống giáo dục",
    color: "orange",
    gradient: "from-orange-500 to-amber-500",
  },
];

export function TargetAudienceSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gray-50/50 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50/50 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            Đối tượng sử dụng
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Ai phù hợp với{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              EduTech AI?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Giải pháp linh hoạt đáp ứng mọi nhu cầu giảng dạy và quản lý
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto perspective-1000">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative group transition-all duration-500 ease-out transform-style-3d"
                style={{
                  transform: isHovered
                    ? "translateY(-10px) rotateX(5deg)"
                    : "translateY(0) rotateX(0)",
                }}
              >
                <div className="h-full relative bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl hover:border-gray-200 transition-all duration-300">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${audience.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-colors">
                    {audience.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {audience.description}
                  </p>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/0 to-gray-50 rounded-tr-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
}
