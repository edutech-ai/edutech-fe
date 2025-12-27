"use client";

import {
  FileText,
  GraduationCap,
  BarChart3,
  Grid3x3,
  Presentation,
  Library,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Tạo Đề Thi",
    description: "Sinh tự động đề thi, ngân hàng câu hỏi",
    points: [
      "Nhiều dạng: trắc nghiệm, tự luận, nối cặp, điền khuyết",
      "Điều chỉnh mức độ nhận thức (Bloom's Taxonomy)",
    ],
  },
  {
    icon: GraduationCap,
    title: "AI Tạo Giáo Án",
    description: "Tạo lesson plan theo chuẩn chương trình",
    points: [
      "Có mục tiêu, hoạt động, đánh giá, tài liệu đính kèm",
      "Tự động hoá công việc soạn bài",
    ],
  },
  {
    icon: BarChart3,
    title: "AI Chấm Bài & Thống Kê",
    description: "Tự động chấm câu hỏi tự luận",
    points: [
      "Phân tích kết quả thi, báo cáo năng lực học sinh",
      "Personalized improvement suggestions",
    ],
  },
  {
    icon: Grid3x3,
    title: "Thiết kế Ma trận Đề",
    description: "Tạo blueprint chuẩn theo chương / chủ đề",
    points: [
      "Cân đối độ khó – số lượng câu – kỹ năng",
      "Exam Matrix theo tiêu chuẩn giáo dục",
    ],
  },
  {
    icon: Presentation,
    title: "AI Tạo Slide & Học Liệu",
    description: "Chuyển nội dung thành slide trong vài giây",
    points: [
      "Tự tạo thêm hình minh họa, ví dụ, sơ đồ",
      "Export PowerPoint, PDF, Word",
    ],
  },
  {
    icon: Library,
    title: "Thư viện & Workspace",
    description: "Lưu trữ sách, tài liệu, bài giảng",
    points: [
      "Quản lý theo thư mục, tìm kiếm nhanh",
      "Chia sẻ và cộng tác với đồng nghiệp",
    ],
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            Tính năng
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Bộ công cụ AI toàn diện
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mọi thứ giáo viên cần để tối ưu hoá quy trình giảng dạy, từ soạn bài
            đến chấm điểm
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = [
              { bg: "bg-blue-50", icon: "bg-blue-500" },
              { bg: "bg-purple-50", icon: "bg-purple-500" },
              { bg: "bg-green-50", icon: "bg-green-500" },
              { bg: "bg-orange-50", icon: "bg-orange-500" },
              { bg: "bg-pink-50", icon: "bg-pink-500" },
              { bg: "bg-indigo-50", icon: "bg-indigo-500" },
            ];
            const color = colors[index % colors.length];

            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
              >
                <div className="relative">
                  <div
                    className={`w-14 h-14 ${color.icon} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 mb-5 leading-relaxed">
                    {feature.description}
                  </p>

                  <ul className="space-y-3">
                    {feature.points.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-gray-600"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
