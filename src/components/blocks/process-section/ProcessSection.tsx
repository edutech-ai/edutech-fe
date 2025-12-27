"use client";

import { Upload, Settings, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Nhập nội dung hoặc upload tài liệu",
    description:
      "Cung cấp chủ đề, mục tiêu học tập hoặc tải lên tài liệu hiện có",
  },
  {
    icon: Settings,
    number: "02",
    title: "Chọn công cụ",
    description: "Chọn tạo đề, tạo giáo án, tạo slide hoặc các công cụ khác",
  },
  {
    icon: Download,
    number: "03",
    title: "Nhận kết quả ngay",
    description: "Có thể chỉnh sửa & xuất file PDF, Word, PowerPoint",
  },
];

export function ProcessSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            Quy trình
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Chỉ 3 bước đơn giản
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tạo tài liệu giảng dạy chuyên nghiệp trong vài phút
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative mb-6">
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                      <Icon className="w-14 h-14 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center border-4 border-blue-500 shadow-lg">
                      <span className="text-lg font-bold text-blue-600">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6 text-lg">
            Sẵn sàng trải nghiệm ngay?
          </p>
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
            Bắt đầu miễn phí
          </button>
        </div>
      </div>
    </section>
  );
}
