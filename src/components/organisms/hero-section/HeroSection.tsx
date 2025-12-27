"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  PlayCircle,
  Zap,
} from "lucide-react";

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
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-200/30 rounded-full blur-[120px] animate-blob mix-blend-multiply" />
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-200/30 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply" />
        <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] bg-pink-200/30 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply" />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 max-w-2xl">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                </span>
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Xây dựng kho giảng dạy hiệu quả
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
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-100/50 -z-10 -rotate-2" />
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Tự động hóa 90% công việc soạn bài. Từ tạo đề thi, quản lí giáo
                án đến lớp học - tất cả chỉ trong vài giây với sức mạnh của AI.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up delay-200">
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-8 py-4 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

          {/* Right Content - 3D Visual */}
          <div className="relative lg:block hidden perspective-1000">
            <div
              className="relative w-full aspect-square max-w-lg mx-auto transition-transform duration-200 ease-out transform-style-3d"
              style={{
                transform: `rotateY(${mousePosition.x * 20}deg) rotateX(${
                  -mousePosition.y * 20
                }deg)`,
              }}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-[2.5rem] blur-2xl opacity-20 animate-pulse" />

              {/* Main Card Layer 1 (Base) */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl transform translate-z-0">
                {/* App Header */}
                <div className="p-6 border-b border-white/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="px-3 py-1 bg-white/50 rounded-full flex items-center gap-2">
                    <div className="relative w-4 h-4">
                      <Image
                        src="/images/logo/logo.svg"
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      EduTech AI
                    </span>
                  </div>
                </div>

                {/* App Content */}
                <div className="p-8 space-y-6">
                  {/* Skeleton Loading Animation */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-24 bg-gray-200 rounded-full" />
                        <div className="h-2 w-32 bg-gray-100 rounded-full" />
                      </div>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50 p-4 space-y-3">
                      <div className="h-2 w-full bg-gray-200 rounded-full animate-pulse" />
                      <div className="h-2 w-5/6 bg-gray-200 rounded-full animate-pulse delay-75" />
                      <div className="h-2 w-4/6 bg-gray-200 rounded-full animate-pulse delay-150" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card Layer 2 (Middle) */}
              <div
                className="absolute top-20 -right-12 w-64 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 transform translate-z-10 transition-transform duration-500"
                style={{
                  transform: `translateZ(40px) translateX(${
                    mousePosition.x * -20
                  }px)`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">
                      Đã tạo xong
                    </div>
                    <div className="text-xs text-gray-500">Vừa xong</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 bg-gray-100 rounded-full w-full" />
                  <div className="h-1.5 bg-gray-100 rounded-full w-3/4" />
                </div>
              </div>

              {/* Floating Card Layer 3 (Top) */}
              <div
                className="absolute bottom-20 -left-12 w-56 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 transform translate-z-20 transition-transform duration-500"
                style={{
                  transform: `translateZ(80px) translateX(${
                    mousePosition.x * 20
                  }px)`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">
                      Tốc độ xử lý
                    </div>
                    <div className="text-xs text-blue-600 font-semibold">
                      &lt; 0.5 giây
                    </div>
                  </div>
                </div>
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
        .translate-z-0 {
          transform: translateZ(0);
        }
        .translate-z-10 {
          transform: translateZ(40px);
        }
        .translate-z-20 {
          transform: translateZ(80px);
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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
