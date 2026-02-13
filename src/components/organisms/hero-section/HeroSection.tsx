"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, PlayCircle } from "lucide-react";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-white pt-24 pb-32 lg:pt-32 lg:pb-40 perspective-1000"
    >
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 -z-10 overflow-hidden -mt-50">
        <div className="absolute inset-0 bg-[url('/images/grid2.svg')] bg-cover mask-[linear-gradient(180deg,white,rgba(255,255,255,0.8))]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-2 items-center">
          {/* Left Content */}
          <div className="space-y-8 max-w-2xl">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                </span>
                <span className="text-sm font-semibold bg-linear-to-r from-primary to-lime-700 bg-clip-text text-transparent">
                  Xây dựng kho học liệu hiệu quả
                </span>
              </div>
            </div>

            <div className="space-y-6 animate-fade-in-up delay-100">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1]">
                Trợ lý giảng dạy <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-primary to-pink-600 animate-gradient-x">
                    hiệu quả nhất
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-lime-400 -z-10 -rotate-2" />
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Tự động hóa 90% công việc soạn bài. Từ tạo đề thi, quản lý giáo
                án đến lớp học - tất cả chỉ trong thời gian ngắn với sự hỗ trợ
                đắc lực từ AI.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up delay-200">
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-8 py-4 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Bắt đầu miễn phí
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/demo"
                className="group inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold px-8 py-4 rounded-2xl border border-gray-200 transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1"
              >
                <PlayCircle className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                Xem Demo
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-8 text-sm font-medium text-gray-500 animate-fade-in-up delay-300">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"
                    style={{
                      backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                      backgroundSize: "cover",
                    }}
                  />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-600">
                  +2k
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span>Giáo viên tin dùng</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image with 3D Effect */}
          <div className="relative hidden lg:block perspective-1000 -mr-2 xl:-mr-4 2xl:-mr-8">
            <div
              className="relative w-[140%] xl:w-[130%] 2xl:w-[120%] transition-transform duration-200 ease-out transform-style-3d"
              style={{
                transform: `rotateY(${mousePosition.x * 10}deg) rotateX(${
                  -mousePosition.y * 10
                }deg)`,
              }}
            >
              {/* Background Glow */}
              <div className="absolute -inset-4 bg-linear-to-tr from-blue-500 via-primary to-rose-500 rounded-3xl blur-3xl opacity-30 animate-pulse" />

              {/* Hero Image */}
              <div className="relative aspect-16/8 w-full">
                <Image
                  src="/images/hero.png"
                  alt="AI EduTech - Giao diện trợ lý AI"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
}
