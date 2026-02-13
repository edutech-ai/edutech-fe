import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/organisms/header";
import { Footer } from "@/components/organisms/footer";
import { FAQSection } from "@/components/organisms/faq-section";
import { PricingTemplate } from "@/components/templates/pricing";
import { Check, X } from "lucide-react";

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
    name: "Tạo đề thi với AI",
    free: "5/tháng",
    basic: "20/tháng",
    pro: "Không giới hạn",
    business: "Không giới hạn",
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
    name: "AI nâng cao",
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

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm font-medium text-gray-700">{value}</span>;
  }
  return value ? (
    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mx-auto">
      <Check className="w-4 h-4 text-green-600" />
    </div>
  ) : (
    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
      <X className="w-4 h-4 text-gray-400" />
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-linear-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Xem bảng giá
          </h1>
          <p className="text-md text-gray-800 max-w-2xl mx-auto">
            Bắt đầu miễn phí, nâng cấp khi cần. Chi tiết quyền lợi. Không cần
            thẻ tín dụng.
          </p>
        </div>

        <div className="absolute right-4 lg:right-16 xl:right-32 bottom-0 hidden md:block pointer-events-none">
          <Image
            src="/images/sticker/sticker_pricing.svg"
            alt="Tìm gói phù hợp"
            width={160}
            height={160}
            className="w-32 lg:w-40 h-auto"
          />
        </div>
      </section>

      {/* Pricing Cards - Dynamic with Payment Integration */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PricingTemplate />
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              So sánh chi tiết các gói
            </h2>
            <p className="text-gray-600">
              Xem tất cả tính năng của từng gói dịch vụ
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-50">
                      Tính năng
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-500 w-25">
                      Free
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-500 w-25">
                      Basic
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-orange-600 w-25 bg-orange-50">
                      Pro
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-500 w-25">
                      Business
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6 text-gray-700 font-medium">
                        {feature.name}
                      </td>
                      <td className="text-center py-4 px-4">
                        <FeatureCell value={feature.free} />
                      </td>
                      <td className="text-center py-4 px-4">
                        <FeatureCell value={feature.basic} />
                      </td>
                      <td className="text-center py-4 px-4 bg-orange-50/50">
                        <FeatureCell value={feature.pro} />
                      </td>
                      <td className="text-center py-4 px-4">
                        <FeatureCell value={feature.business} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      <Footer />
    </div>
  );
}
