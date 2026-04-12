"use client";

import { Upload, Settings, Download, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Nhập liệu thông minh",
    description:
      "Chỉ cần nhập chủ đề hoặc tải lên tài liệu thô (Word, PDF, ảnh chụp). Hệ thống sẽ tự động trích xuất nội dung quan trọng.",
  },
  {
    icon: Settings,
    number: "02",
    title: "AI Xử lý chuyên sâu",
    description:
      "AI phân tích cấu trúc, áp dụng các phương pháp sư phạm (Bloom, 5E) để tạo ra nội dung chuẩn giáo dục.",
  },
  {
    icon: Download,
    number: "03",
    title: "Xuất bản tức thì",
    description:
      "Nhận kết quả hoàn chỉnh. Chỉnh sửa trực quan và xuất ra các định dạng pdf nhanh chóng.",
  },
];

export function ProcessSection() {
  return (
    <section
      id="process"
      className="py-24 relative overflow-hidden w-full"
      style={{
        backgroundImage: "url('/images/home/bg-ss-3.svg')",
        backgroundSize: "120%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top fade for seamless transition */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-linear-to-b from-white via-white/80 to-transparent z-0" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6 border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span>Quy trình 3 bước tối ưu</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
            Từ ý tưởng đến bài giảng
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/70 pb-1 inline-block">
              chỉ trong vài giây
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Chúng tôi đã đơn giản hóa mọi thứ phức tạp. Bạn chỉ cần tập trung
            vào chuyên môn, công nghệ sẽ lo phần còn lại.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-linear-to-r from-primary/20 via-primary/40 to-primary/20 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={index}
                  className="group relative flex flex-col items-center text-center z-10"
                >
                  {/* Step Card */}
                  <div className="relative w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    {/* Number Badge */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 inline-flex items-center justify-center w-14 h-10 rounded-full bg-linear-to-r from-primary to-primary/70 text-white text-sm font-bold shadow-lg">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto mb-6 mt-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/register"
            className="group inline-flex items-center gap-3 bg-primary text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
          >
            <span>Trải nghiệm ngay</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Không cần thẻ tín dụng • Hủy bất kỳ lúc nào
          </p>
        </div>
      </div>
    </section>
  );
}
