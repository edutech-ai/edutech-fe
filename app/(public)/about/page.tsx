import type { Metadata } from "next";
import { Header } from "@/components/organisms/header";
import { Footer } from "@/components/organisms/footer";
import { Target, Heart, Lightbulb, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Về chúng tôi - AI EduTech",
  description:
    "AI EduTech là nền tảng AI hỗ trợ giáo viên Việt Nam soạn bài, tạo đề thi và quản lý lớp học hiệu quả. Tìm hiểu về sứ mệnh và đội ngũ của chúng tôi.",
  keywords: [
    "về AI EduTech",
    "startup giáo dục Việt Nam",
    "AI giáo dục",
    "đội ngũ AI EduTech",
    "sứ mệnh AI EduTech",
    "công nghệ giáo dục",
  ],
  openGraph: {
    title: "Về AI EduTech - Sứ mệnh và tầm nhìn",
    description:
      "Chúng tôi tin rằng công nghệ AI có thể giúp giáo viên tập trung vào điều quan trọng nhất: truyền cảm hứng cho học sinh.",
  },
};

const values = [
  {
    icon: Target,
    title: "Sứ mệnh",
    description:
      "Giúp giáo viên Việt Nam tiết kiệm thời gian soạn bài và chấm điểm, để dành nhiều thời gian hơn cho việc truyền đạt kiến thức và truyền cảm hứng cho học sinh.",
  },
  {
    icon: Lightbulb,
    title: "Tầm nhìn",
    description:
      "Trở thành nền tảng AI giáo dục hàng đầu Việt Nam, nơi mọi giáo viên đều có thể tiếp cận công nghệ hiện đại để nâng cao chất lượng giảng dạy.",
  },
  {
    icon: Heart,
    title: "Giá trị cốt lõi",
    description:
      "Đặt giáo viên làm trung tâm. Mọi tính năng được thiết kế dựa trên nhu cầu thực tế của giáo viên Việt Nam, đơn giản và dễ sử dụng.",
  },
  {
    icon: Users,
    title: "Cộng đồng",
    description:
      "Xây dựng cộng đồng giáo viên chia sẻ kinh nghiệm, tài liệu và cùng nhau phát triển. Một mình đi nhanh, cùng nhau đi xa.",
  },
];

const milestones = [
  {
    year: "2024",
    title: "Khởi đầu",
    description:
      "Ý tưởng AI EduTech được hình thành từ nhu cầu thực tế của giáo viên trong việc soạn bài và quản lý lớp học.",
  },
  {
    year: "2025",
    title: "Ra mắt beta",
    description:
      "Phiên bản beta được thử nghiệm với 100 giáo viên đầu tiên. Nhận phản hồi tích cực về tính năng quản lý lớp học.",
  },
  {
    year: "2026",
    title: "Chính thức ra mắt",
    description:
      "AI EduTech chính thức ra mắt với đầy đủ tính năng: soạn bài AI, chấm điểm thông minh và quản lý lớp học toàn diện.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Về <span className="text-blue-600">AI EduTech</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Chúng tôi tin rằng công nghệ AI có thể giúp giáo viên tập trung
              vào điều quan trọng nhất:{" "}
              <strong>truyền cảm hứng cho học sinh</strong>. AI EduTech được xây
              dựng bởi những người yêu giáo dục và công nghệ, với mong muốn mang
              lại công cụ hữu ích cho giáo viên Việt Nam.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Sứ mệnh và giá trị
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-8 bg-gray-50 rounded-xl hover:shadow-md transition-shadow"
              >
                <value.icon className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Vấn đề chúng tôi giải quyết
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                Giáo viên Việt Nam đang phải đối mặt với nhiều thách thức: khối
                lượng công việc soạn bài khổng lồ, chấm bài thủ công tốn thời
                gian, và quản lý lớp học ngày càng phức tạp. Trung bình, một
                giáo viên dành <strong>15-20 giờ mỗi tuần</strong> cho công việc
                hành chính thay vì giảng dạy.
              </p>
              <p>
                AI EduTech ra đời để giải quyết vấn đề này. Với công nghệ AI
                tiên tiến, chúng tôi giúp giáo viên:
              </p>
              <ul>
                <li>
                  <strong>Soạn giáo án trong 5 phút</strong> thay vì 2 tiếng
                </li>
                <li>
                  <strong>Chấm bài cả lớp trong 10 phút</strong> thay vì cả buổi
                  tối
                </li>
                <li>
                  <strong>Theo dõi tiến độ học sinh</strong> một cách tự động và
                  trực quan
                </li>
              </ul>
              <p>
                Chúng tôi không thay thế giáo viên - chúng tôi{" "}
                <strong>trao quyền</strong> cho giáo viên bằng công nghệ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Hành trình của chúng tôi
          </h2>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 mb-12 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-blue-200 mt-4" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Cùng xây dựng tương lai giáo dục
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn giáo viên đang sử dụng AI EduTech để giảng
            dạy hiệu quả hơn mỗi ngày.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Dùng thử miễn phí
            </Link>
            <Link
              href="/features"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xem tính năng
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
