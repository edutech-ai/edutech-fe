"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "EduTech AI có miễn phí không?",
    answer:
      "Có, chúng tôi cung cấp gói Free vĩnh viễn với các tính năng cơ bản giúp giáo viên quản lý lớp học, tạo sơ đồ chỗ ngồi và random học sinh công bằng.",
  },
  {
    question: "Tôi có thể nâng cấp hoặc hạ cấp gói không?",
    answer:
      "Hoàn toàn được. Bạn có thể chuyển đổi giữa các gói Basic và Pro bất cứ lúc nào ngay trong phần cài đặt tài khoản. Việc nâng cấp sẽ có hiệu lực ngay lập tức.",
  },
  {
    question: "Gói Business cho trường học hỗ trợ những gì?",
    answer:
      "Gói Business được thiết kế riêng cho quy mô trường học với các tính năng quản lý tập trung, dashboard tổng hợp dữ liệu toàn trường, phân quyền chi tiết và được hỗ trợ triển khai (onboarding) trực tiếp 1-1.",
  },
  {
    question: "Dữ liệu học sinh có được bảo mật không?",
    answer:
      "Chúng tôi coi trọng quyền riêng tư và bảo mật dữ liệu. Mọi thông tin đều được mã hóa và lưu trữ an toàn, tuân thủ các quy định về bảo vệ dữ liệu giáo dục.",
  },
  {
    question: "Tôi có thể xuất dữ liệu báo cáo không?",
    answer:
      "Có, từ gói Pro trở lên, bạn có thể xuất các báo cáo phân tích chi tiết, bảng điểm và tiến độ học tập ra định dạng PDF hoặc Excel để phục vụ công tác lưu trữ và báo cáo.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="about-us" className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid.svg')] opacity-[0.08]" />
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            Hỗ trợ
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Câu hỏi thường gặp
          </h2>
          <p className="text-xl text-gray-600">
            Giải đáp những thắc mắc phổ biến về EduTech AI
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-100 transition-all duration-300 hover:shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openIndex === index
                      ? "bg-blue-600 text-white rotate-180"
                      : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                  }`}
                >
                  {openIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-48 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
