"use client";

import { GraduationCap, Target, BookOpen, Building2 } from "lucide-react";

const audiences = [
  {
    icon: GraduationCap,
    title: "Giáo viên THCS/THPT",
    description: "Tối ưu hoá quy trình soạn đề, giáo án và chấm bài",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Target,
    title: "Giáo viên luyện thi",
    description: "Tạo ngân hàng câu hỏi và đề thi chuyên sâu",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: BookOpen,
    title: "Trung tâm ngoại ngữ – kỹ năng",
    description: "Quản lý tài liệu và theo dõi tiến độ học viên",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Building2,
    title: "Trường tư thục, trường quốc tế",
    description: "Giải pháp toàn diện cho hệ thống giáo dục",
    color: "from-orange-500 to-orange-600",
  },
];

export function TargetAudienceSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
            Đối tượng
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Ai phù hợp với EduTech AI?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            EduTech AI phục vụ đa dạng đối tượng trong lĩnh vực giáo dục
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-gray-200"
              >
                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${audience.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {audience.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {audience.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
