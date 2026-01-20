"use client";

import { Clock, Users, TrendingUp, Zap, ShieldCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const benefits = [
  {
    icon: Clock,
    title: "Tiết kiệm 70% thời gian",
    desc: "Tự động hóa các tác vụ lặp lại, tập trung vào giảng dạy.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: ShieldCheck,
    title: "Chuẩn xác tuyệt đối",
    desc: "Nội dung bám sát chương trình mới của Bộ Giáo dục.",
    color: "from-green-500 to-emerald-400",
  },
  {
    icon: TrendingUp,
    title: "Nâng cao chất lượng",
    desc: "Bài giảng sinh động, thu hút học sinh hơn bao giờ hết.",
    color: "from-purple-500 to-pink-400",
  },
  {
    icon: Users,
    title: "Dễ dàng sử dụng",
    desc: "Giao diện tối giản, làm quen chỉ trong 5 phút.",
    color: "from-orange-500 to-amber-400",
  },
];

export function BenefitsSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const { left, top, width, height } =
        sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 bg-gray-50 relative overflow-hidden perspective-2000"
    >
      {/* Magical Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-green-200/20 rounded-full blur-[120px] animate-blob"
          style={{
            transform: `translate(${mousePosition.x * -60}px, ${mousePosition.y * -60}px)`,
          }}
        />
        <div
          className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-200/20 rounded-full blur-[120px] animate-blob animation-delay-4000"
          style={{
            transform: `translate(${mousePosition.x * 60}px, ${mousePosition.y * 60}px)`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-600 text-sm font-bold mb-6">
            <Zap className="w-4 h-4" />
            Hiệu quả vượt trội
          </div>
          <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-6">
            Tại sao giáo viên <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
              chọn EduTech AI?
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="group relative h-80 rounded-[2.5rem] p-px bg-gradient-to-b from-white/50 to-transparent shadow-lg transition-all duration-500 hover:shadow-2xl transform-style-3d"
              style={{
                transform: `rotateY(${mousePosition.x * 15}deg) rotateX(${mousePosition.y * -15}deg)`,
              }}
            >
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-[2.4rem] overflow-hidden border border-white/20">
                <div className="relative h-full p-8 flex flex-col items-center text-center z-10">
                  <div
                    className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${b.color} flex items-center justify-center text-white shadow-2xl mb-8 transform transition-all duration-500 group-hover:scale-110 group-hover:translate-z-30 group-hover:rotate-[360deg]`}
                  >
                    <b.icon className="w-10 h-10" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:translate-z-20 transition-transform">
                    {b.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed group-hover:translate-z-10 transition-transform">
                    {b.desc}
                  </p>
                </div>

                {/* Animated background line */}
                <div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${b.color} w-0 group-hover:w-full transition-all duration-700`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .perspective-2000 {
          perspective: 2000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .group-hover\:translate-z-30:hover {
          transform: translateZ(30px);
        }
        .group-hover\:translate-z-20:hover {
          transform: translateZ(20px);
        }
        .group-hover\:translate-z-10:hover {
          transform: translateZ(10px);
        }
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
