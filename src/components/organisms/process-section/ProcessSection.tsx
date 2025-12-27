"use client";

import {
  Upload,
  Settings,
  Download,
  ArrowRight,
  Sparkles,
  FileText,
  Cpu,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Nhập liệu thông minh",
    description:
      "Chỉ cần nhập chủ đề hoặc tải lên tài liệu thô (Word, PDF, ảnh chụp). Hệ thống sẽ tự động trích xuất nội dung quan trọng.",
    color: "blue",
    subIcon: FileText,
  },
  {
    icon: Settings,
    number: "02",
    title: "AI Xử lý chuyên sâu",
    description:
      "AI phân tích cấu trúc, áp dụng các phương pháp sư phạm (Bloom, 5E) để tạo ra nội dung chuẩn giáo dục.",
    color: "purple",
    subIcon: Cpu,
  },
  {
    icon: Download,
    number: "03",
    title: "Xuất bản tức thì",
    description:
      "Nhận kết quả hoàn chỉnh. Chỉnh sửa trực quan và xuất ra các định dạng phổ biến (Docx, PPTX, PDF) trong 1 nốt nhạc.",
    color: "green",
    subIcon: CheckCircle,
  },
];

export function ProcessSection() {
  return (
    <section
      id="process"
      className="py-32 bg-white relative overflow-hidden perspective-1000"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] mix-blend-multiply animate-blob" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gray-50/50 rounded-full blur-3xl -z-20" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6 border border-blue-100 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Quy trình 3 bước tối ưu</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
            Từ ý tưởng đến bài giảng <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              chỉ trong vài giây
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Chúng tôi đã đơn giản hóa mọi thứ phức tạp. Bạn chỉ cần tập trung
            vào chuyên môn, công nghệ sẽ lo phần còn lại.
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 via-blue-200 to-gray-200 -translate-y-1/2 z-0">
            <div className="absolute top-1/2 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent w-1/3 animate-shimmer-line" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const SubIcon = step.subIcon;

              const colorStyles: Record<
                string,
                { bg: string; text: string; shadow: string; border: string }
              > = {
                blue: {
                  bg: "bg-blue-50",
                  text: "text-blue-600",
                  shadow: "shadow-blue-200",
                  border: "border-blue-100",
                },
                purple: {
                  bg: "bg-purple-50",
                  text: "text-purple-600",
                  shadow: "shadow-purple-200",
                  border: "border-purple-100",
                },
                green: {
                  bg: "bg-green-50",
                  text: "text-green-600",
                  shadow: "shadow-green-200",
                  border: "border-green-100",
                },
              };

              const style = colorStyles[step.color];

              return (
                <div
                  key={index}
                  className="group relative flex flex-col items-center text-center z-10"
                >
                  {/* Card Container with 3D Tilt */}
                  <div className="relative w-full bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-blue-500/10 perspective-1000 group-hover:rotate-x-2">
                    {/* Floating Number Badge */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-lg font-bold text-gray-900 z-20 group-hover:scale-110 transition-transform duration-300">
                      {step.number}
                    </div>

                    {/* Icon Area */}
                    <div
                      className={`relative w-20 h-20 mx-auto mb-8 rounded-2xl ${style.bg} flex items-center justify-center transform-style-3d transition-transform duration-500 group-hover:rotate-y-12 group-hover:scale-110`}
                    >
                      <Icon
                        className={`w-10 h-10 ${style.text} relative z-10`}
                      />
                      <div
                        className={`absolute -right-2 -bottom-2 w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center border ${style.border} transform translate-z-10`}
                      >
                        <SubIcon className={`w-4 h-4 ${style.text}`} />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Bottom Gradient Line */}
                    <div
                      className={`absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-${step.color}-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-24 text-center">
          <button className="group relative inline-flex items-center gap-3 bg-gray-900 text-white font-bold px-10 py-5 rounded-2xl transition-all duration-300 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2 text-lg">
              Trải nghiệm ngay
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Button Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Không cần thẻ tín dụng • Hủy bất kỳ lúc nào
          </p>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .translate-z-10 {
          transform: translateZ(20px);
        }
        .rotate-x-2 {
          transform: rotateX(2deg);
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes shimmer-line {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
        .animate-shimmer-line {
          animation: shimmer-line 3s linear infinite;
        }
      `}</style>
    </section>
  );
}
