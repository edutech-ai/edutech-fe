"use client";

import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    description: "Giáo viên mới bắt đầu",
    price: "0",
    period: "VNĐ / tháng",
    buttonText: "Đăng ký Free",
    features: [
      "Quản lý lớp học cơ bản",
      "Giao diện lớp học trực quan (sơ đồ chỗ ngồi)",
      "Random học sinh công bằng trong lớp",
      "Phù hợp để làm quen và thử nghiệm",
    ],
  },
  {
    name: "Basic",
    description: "Giáo viên dạy 1–2 lớp",
    price: "39.000",
    period: "VNĐ / tháng",
    buttonText: "Đăng ký Basic",
    features: [
      "Theo dõi mức độ tham gia của học sinh",
      "Thống kê lớp học theo tiết học",
      "Lưu lịch sử hoạt động giảng dạy",
      "Giảm thời gian ghi chép thủ công",
    ],
  },
  {
    name: "Pro",
    description: "Giáo viên dạy nhiều lớp",
    price: "99.000",
    period: "VNĐ / tháng",
    buttonText: "Đăng ký Pro",
    features: [
      "Phân tích học tập chi tiết từng học sinh",
      "Theo dõi tiến độ học theo thời gian",
      "Xuất báo cáo PDF / Excel phục vụ tổng kết",
      "Ghi chú và lưu trữ dữ liệu dài hạn",
    ],
  },
  {
    name: "Business",
    description: "Trường học & tổ chuyên môn",
    price: "2.000.000",
    period: "VNĐ / năm / trường",
    buttonText: "Liên hệ tư vấn",
    features: [
      "Quản lý nhiều lớp và nhiều giáo viên",
      "Dashboard tổng hợp dữ liệu cấp trường",
      "Dữ liệu tập trung, phân quyền rõ ràng",
      "Hỗ trợ triển khai & onboarding riêng",
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Bảng giá</h2>
          <p className="text-lg text-gray-600">
            Lựa chọn gói dịch vụ phù hợp với nhu cầu giảng dạy của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-350 mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="flex flex-col bg-white p-8 rounded-none border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-medium text-gray-900 mb-4">
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm min-h-10 px-4">
                  {plan.description}
                </p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-serif text-gray-900">
                    {plan.price}
                  </span>
                </div>
                <div className="text-sm text-green-600 font-medium mt-2">
                  {plan.period}
                </div>
              </div>

              <Link
                href="/register"
                className="block w-full py-3 px-6 bg-primary text-white text-center text-sm font-medium hover:bg-primary/80 transition-colors mb-8 rounded-md"
              >
                {plan.buttonText}
              </Link>

              <div className="border-t border-gray-100 pt-8 mt-auto">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-gray-900 shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
