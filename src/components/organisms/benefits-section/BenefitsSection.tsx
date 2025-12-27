"use client";

import { Clock, CheckCircle, Users, TrendingUp, Layers } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Tiết kiệm 70% thời gian soạn bài",
    description: "Giảm công việc lặp đi lặp lại, tập trung vào giảng dạy",
  },
  {
    icon: CheckCircle,
    title: "Hạn chế lỗi sai, giữ định dạng đồng nhất",
    description: "AI đảm bảo chất lượng và tính nhất quán",
  },
  {
    icon: Users,
    title: "Dễ dùng cho cả giáo viên không rành công nghệ",
    description: "Giao diện đơn giản, trực quan, dễ tiếp cận",
  },
  {
    icon: TrendingUp,
    title: "Tối ưu hoá công việc giảng dạy",
    description: "Nâng cao hiệu quả và chất lượng giáo dục",
  },
  {
    icon: Layers,
    title: "Tích hợp nhiều công cụ vào 1 nền tảng duy nhất",
    description: "Quản lý tập trung, tiện lợi và hiệu quả",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, #3B82F6 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            Lợi ích
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Tại sao chọn EduTech AI?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hơn 1000+ giáo viên đã tiết kiệm hàng trăm giờ mỗi tháng với EduTech
            AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const gradients = [
              "from-blue-500 to-cyan-500",
              "from-purple-500 to-pink-500",
              "from-green-500 to-emerald-500",
              "from-orange-500 to-red-500",
              "from-indigo-500 to-purple-500",
            ];
            const gradient = gradients[index % gradients.length];

            return (
              <div
                key={index}
                className="group relative flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl"
              >
                {/* Icon with gradient background */}
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                  {benefit.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>

                {/* Decorative gradient border on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity -z-10`}
                />
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: "1000+", label: "Giáo viên" },
            { value: "70%", label: "Tiết kiệm thời gian" },
            { value: "10K+", label: "Đề thi đã tạo" },
            { value: "24/7", label: "Hỗ trợ" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
