import type { Metadata } from "next";
import { Header } from "@/components/organisms/header";
import { Footer } from "@/components/organisms/footer";
import { PricingSection } from "@/components/organisms/pricing-section";
import { FAQSection } from "@/components/organisms/faq-section";
import { Check, X } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bảng giá - Gói dịch vụ AI giáo dục",
  description:
    "Khám phá các gói dịch vụ AI EduTech phù hợp với nhu cầu của bạn. Từ miễn phí đến Business, hỗ trợ giáo viên cá nhân đến trường học.",
  keywords: [
    "bảng giá AI EduTech",
    "giá phần mềm giáo dục",
    "gói dịch vụ giáo viên",
    "phần mềm quản lý lớp học giá",
    "AI giáo dục miễn phí",
    "subscription giáo dục",
  ],
  openGraph: {
    title: "Bảng giá AI EduTech - Gói dịch vụ phù hợp mọi nhu cầu",
    description:
      "Từ miễn phí đến Business - Chọn gói phù hợp với nhu cầu giảng dạy của bạn.",
  },
};

const comparisonFeatures = [
  {
    name: "Quản lý lớp học",
    free: true,
    basic: true,
    pro: true,
    business: true,
  },
  {
    name: "Sơ đồ chỗ ngồi",
    free: true,
    basic: true,
    pro: true,
    business: true,
  },
  {
    name: "Random học sinh",
    free: true,
    basic: true,
    pro: true,
    business: true,
  },
  {
    name: "Theo dõi tham gia",
    free: false,
    basic: true,
    pro: true,
    business: true,
  },
  {
    name: "Thống kê lớp học",
    free: false,
    basic: true,
    pro: true,
    business: true,
  },
  {
    name: "Lịch sử hoạt động",
    free: false,
    basic: true,
    pro: true,
    business: true,
  },
  {
    name: "Phân tích học sinh",
    free: false,
    basic: false,
    pro: true,
    business: true,
  },
  {
    name: "Xuất báo cáo PDF/Excel",
    free: false,
    basic: false,
    pro: true,
    business: true,
  },
  {
    name: "Quản lý nhiều giáo viên",
    free: false,
    basic: false,
    pro: false,
    business: true,
  },
  {
    name: "Dashboard cấp trường",
    free: false,
    basic: false,
    pro: false,
    business: true,
  },
  {
    name: "Hỗ trợ onboarding",
    free: false,
    basic: false,
    pro: false,
    business: true,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen w-full">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Bảng giá <span className="text-blue-600">minh bạch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Lựa chọn gói dịch vụ phù hợp với nhu cầu giảng dạy của bạn. Bắt đầu
            miễn phí, nâng cấp khi cần.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <PricingSection />

      {/* Feature Comparison Table */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            So sánh chi tiết các gói
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full max-w-5xl mx-auto">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Tính năng
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">
                    Free
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">
                    Basic
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-blue-600">
                    Pro
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">
                    Business
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-gray-700">{feature.name}</td>
                    <td className="text-center py-4 px-4">
                      {feature.free ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {feature.basic ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-4 px-4 bg-blue-50">
                      {feature.pro ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {feature.business ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      <Footer />
    </div>
  );
}
