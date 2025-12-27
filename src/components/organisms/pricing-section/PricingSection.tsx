"use client";

import { Check, Zap, Crown, Building } from "lucide-react";

const pricingPlans = [
  {
    name: "Miễn Phí",
    icon: Zap,
    price: "0đ",
    period: "mãi mãi",
    description: "Dùng thử các tính năng cơ bản",
    features: [
      "Tối đa 20 lượt tạo AI/tháng",
      "Tạo đề thi cơ bản",
      "Tạo giáo án cơ bản",
      "Không lưu nhiều dự án",
      "Không có chấm AI",
    ],
    limitations: ["Quảng cáo nhẹ trong giao diện"],
    cta: "Bắt đầu miễn phí",
    highlighted: false,
  },
  {
    name: "Giáo Viên",
    icon: Crown,
    price: "39.000đ",
    period: "tháng",
    yearlyPrice: "790.000đ/năm",
    description: "Dành cho giáo viên cá nhân",
    features: [
      "150 lượt AI/tháng",
      "Tạo đề nâng cao",
      "Tạo giáo án & slide đầy đủ",
      "Chấm bài AI (50 bài/tháng)",
      "Lưu trữ không giới hạn",
      "Xuất file PDF/Word",
      "Không quảng cáo",
      "Hỗ trợ qua email",
    ],
    limitations: [],
    cta: "Chọn gói này",
    highlighted: true,
  },
  {
    name: "Trung Tâm",
    icon: Building,
    price: "99.000đ",
    period: "tháng",
    yearlyPrice: "2.990.000đ/năm",
    description: "Dành cho trung tâm giáo dục",
    features: [
      "Không giới hạn lượt AI",
      "Không giới hạn chấm bài",
      "Không giới hạn tài liệu",
      "Bộ công cụ chuyên sâu: Matrix, Slide AI, Analytics",
      "Tài khoản nhóm (5 giáo viên)",
      "Dashboard theo lớp",
      "Hỗ trợ chat nhanh",
    ],
    limitations: [],
    cta: "Chọn gói này",
    highlighted: false,
  },
  {
    name: "Nhà Trường",
    icon: Building,
    price: "2.000.000đ",
    period: "tháng",
    description: "Tối đa 50 giáo viên",
    features: [
      "Toàn bộ tính năng gói Trung Tâm",
      "Quản trị cấp trường",
      "Quản lý học sinh – lớp – báo cáo toàn trường",
      "Tài khoản giáo viên / phòng ban",
      "SSO, phân quyền nâng cao",
      "Tích hợp LMS",
      "Hỗ trợ ưu tiên",
    ],
    limitations: [],
    cta: "Liên hệ tư vấn",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            Bảng giá
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Chọn gói phù hợp với bạn
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bắt đầu miễn phí, nâng cấp khi cần. Linh hoạt và không ràng buộc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`relative rounded-3xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl scale-105 lg:scale-110 border-2 border-blue-400"
                    : "bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Phổ biến nhất
                  </div>
                )}

                <div className="mb-6">
                  <div
                    className={`inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4 ${
                      plan.highlighted
                        ? "bg-white/20 backdrop-blur-sm"
                        : "bg-gradient-to-br from-blue-100 to-purple-100"
                    }`}
                  >
                    <Icon
                      className={`w-7 h-7 ${
                        plan.highlighted ? "text-white" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-gray-900"}`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm ${plan.highlighted ? "text-white/80" : "text-gray-600"}`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-5xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-lg ${plan.highlighted ? "text-white/80" : "text-gray-600"}`}
                    >
                      /{plan.period}
                    </span>
                  </div>
                  {plan.yearlyPrice && (
                    <p
                      className={`text-sm mt-2 ${plan.highlighted ? "text-white/80" : "text-gray-600"}`}
                    >
                      💰 {plan.yearlyPrice}
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          plan.highlighted ? "bg-white/20" : "bg-green-100"
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 ${
                            plan.highlighted ? "text-white" : "text-green-600"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-sm leading-relaxed ${
                          plan.highlighted ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                    plan.highlighted
                      ? "bg-white text-blue-600 hover:bg-gray-100 hover:shadow-xl"
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16 space-y-4">
          <p className="text-gray-600">
            ✅ Tất cả gói đều có thể hủy bất cứ lúc nào • Không ràng buộc dài
            hạn
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <span>🔒 Thanh toán an toàn</span>
            <span>💳 Hỗ trợ nhiều phương thức</span>
            <span>📧 Hỗ trợ 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
}
