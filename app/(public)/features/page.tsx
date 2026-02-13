import type { Metadata } from "next";
import { Header } from "@/components/organisms/header";
import { Footer } from "@/components/organisms/footer";
import { FeaturesSection } from "@/components/organisms/features-section";
import { ProcessSection } from "@/components/organisms/process-section";
import {
  Check,
  Sparkles,
  BookOpen,
  Users,
  BarChart3,
  Clock,
  Shield,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tính năng AI hỗ trợ giảng dạy",
  description:
    "Khám phá các tính năng AI của AI EduTech: Soạn bài tự động, chấm điểm AI, quản lý lớp học thông minh. Giúp giáo viên tiết kiệm thời gian và nâng cao hiệu quả giảng dạy.",
  keywords: [
    "tính năng AI giáo dục",
    "soạn bài tự động",
    "chấm điểm AI",
    "quản lý lớp học",
    "AI hỗ trợ giáo viên",
    "tạo đề thi tự động",
    "giáo án AI",
    "phần mềm giáo dục",
  ],
  openGraph: {
    title: "Tính năng AI hỗ trợ giảng dạy | AI EduTech",
    description:
      "Soạn bài tự động, chấm điểm AI, quản lý lớp học thông minh - Tất cả trong một nền tảng.",
  },
};

const detailedFeatures = [
  {
    icon: BookOpen,
    title: "Soạn giáo án tự động",
    description:
      "AI phân tích chương trình học và tự động tạo giáo án chi tiết theo chuẩn Bộ Giáo dục. Tiết kiệm hàng giờ soạn bài mỗi tuần.",
    benefits: [
      "Chuẩn theo khung chương trình mới nhất",
      "Tùy chỉnh theo phong cách giảng dạy",
      "Xuất file Word, PDF ngay lập tức",
    ],
  },
  {
    icon: Sparkles,
    title: "Tạo đề thi thông minh",
    description:
      "Tạo đề thi trắc nghiệm và tự luận đa dạng chỉ trong vài giây. AI đảm bảo độ khó phù hợp và phân bố kiến thức đều.",
    benefits: [
      "Tự động tạo nhiều đề khác nhau",
      "Phân tích độ khó theo ma trận",
      "Đáp án và thang điểm chi tiết",
    ],
  },
  {
    icon: BarChart3,
    title: "Chấm điểm AI",
    description:
      "Chấm bài trắc nghiệm qua camera điện thoại và phân tích bài tự luận bằng AI. Phản hồi chi tiết cho từng học sinh.",
    benefits: [
      "Chấm trắc nghiệm qua ảnh chụp",
      "Phân tích lỗi sai phổ biến",
      "Gợi ý cải thiện cho học sinh",
    ],
  },
  {
    icon: Users,
    title: "Quản lý lớp học",
    description:
      "Theo dõi chuyên cần, điểm số và tiến độ học tập của từng học sinh. Giao diện trực quan với sơ đồ chỗ ngồi.",
    benefits: [
      "Sơ đồ lớp học tương tác",
      "Random học sinh công bằng",
      "Theo dõi tiến độ theo thời gian",
    ],
  },
  {
    icon: Clock,
    title: "Tiết kiệm thời gian",
    description:
      "Giảm 80% thời gian soạn bài và chấm điểm. Dành nhiều thời gian hơn cho việc giảng dạy và tương tác với học sinh.",
    benefits: [
      "Soạn giáo án trong 5 phút",
      "Chấm cả lớp trong 10 phút",
      "Báo cáo tự động cuối kỳ",
    ],
  },
  {
    icon: Shield,
    title: "Bảo mật dữ liệu",
    description:
      "Dữ liệu được mã hóa và lưu trữ an toàn trên cloud. Chỉ giáo viên có quyền truy cập thông tin lớp học của mình.",
    benefits: [
      "Mã hóa end-to-end",
      "Sao lưu tự động hàng ngày",
      "Tuân thủ quy định bảo mật",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen w-full">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tính năng AI hỗ trợ <span className="text-blue-600">giảng dạy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Mọi công cụ bạn cần để giảng dạy hiệu quả hơn, được tích hợp trong
            một nền tảng duy nhất. Tiết kiệm thời gian, nâng cao chất lượng.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Dùng thử miễn phí
          </Link>
        </div>
      </section>

      {/* Detailed Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detailedFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Original Features Section */}
      <FeaturesSection />

      {/* Process Section */}
      <ProcessSection />

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sẵn sàng trải nghiệm?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Đăng ký miễn phí ngay hôm nay và khám phá cách AI có thể giúp bạn
            giảng dạy hiệu quả hơn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Đăng ký miễn phí
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xem bảng giá
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
