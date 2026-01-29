"use client";

import Image from "next/image";

const benefits = [
  {
    number: "01",
    icon: "/images/home/save_time.svg",
    title: "Tiết kiệm 70% thời gian",
    desc: "Tự động hóa các tác vụ lặp lại, tập trung vào giảng dạy.",
  },
  {
    number: "02",
    icon: "/images/home/safety.svg",
    title: "Chuẩn xác tuyệt đối",
    desc: "Nội dung bám sát chương trình mới của Bộ Giáo dục.",
  },
  {
    number: "03",
    icon: "/images/home/better.svg",
    title: "Nâng cao chất lượng",
    desc: "Bài giảng sinh động, thu hút học sinh hơn bao giờ hết.",
  },
  {
    number: "04",
    icon: "/images/home/easy.svg",
    title: "Dễ dàng sử dụng",
    desc: "Giao diện tối giản, làm quen chỉ trong 5 phút.",
  },
];

export function BenefitsSection() {
  return (
    <section
      id="about"
      className="py-24 relative overflow-hidden w-full"
      style={{
        backgroundImage: "url('/images/home/bg-ss-3.svg')",
        backgroundSize: "120% ",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Title & Images */}
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Tại sao giáo viên
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/70">
                chọn EduTech AI?
              </span>
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">
              Công cụ AI hỗ trợ giáo viên tạo đề thi, chấm bài và quản lý lớp
              học một cách hiệu quả nhất.
            </p>

            {/* Image Collage */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg h-40 relative">
                  <Image
                    src="/images/home/card1.png"
                    alt="EduTech feature 1"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg h-32 relative">
                  <Image
                    src="/images/home/card2.png"
                    alt="EduTech feature 2"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-lg h-32 relative">
                  <Image
                    src="/images/home/card3.png"
                    alt="EduTech feature 3"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg h-40 relative">
                  <Image
                    src="/images/home/card4.png"
                    alt="EduTech feature 4"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Benefits Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center w-12 h-8 rounded-full bg-linear-to-r from-primary to-primary/70 text-white text-sm font-bold mb-4">
                  {b.number}
                </div>

                {/* Icon */}
                <div className="mb-4">
                  <Image src={b.icon} alt={b.title} width={48} height={48} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {b.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
