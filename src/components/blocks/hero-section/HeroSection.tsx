"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Brain,
  FileText,
  GraduationCap,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-24 min-h-screen flex items-center">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Công cụ AI dành riêng cho giáo viên Việt Nam
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Tạo đề thi & giáo án{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  tự động với AI
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Tiết kiệm hàng giờ soạn bài mỗi tuần. EduTech AI giúp tạo đề
                thi, giáo án và học liệu chất lượng cao chỉ trong vài phút.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    AI Thông minh
                  </div>
                  <div className="text-sm text-gray-600">
                    Tạo nội dung chuẩn
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Đa dạng</div>
                  <div className="text-sm text-gray-600">
                    Đề thi, giáo án, slide
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Tiện lợi</div>
                  <div className="text-sm text-gray-600">Chỉ vài phút</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Bắt đầu miễn phí
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-4 rounded-xl border-2 border-gray-200 transition-all duration-200"
              >
                Đăng nhập
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
              </div>
              <span>
                Được <strong className="text-gray-900">1000+ giáo viên</strong>{" "}
                tin dùng
              </span>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative lg:block hidden">
            <div className="relative">
              {/* Floating Cards Animation */}
              <div className="relative w-full h-[600px]">
                {/* Main Card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">
                          EduTech AI
                        </div>
                        <div className="text-sm text-gray-500">
                          Tạo đề thi tự động
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-100 rounded-full w-full"></div>
                      <div className="h-3 bg-gray-100 rounded-full w-5/6"></div>
                      <div className="h-3 bg-gray-100 rounded-full w-4/6"></div>
                      <div className="h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl mt-4 flex items-center justify-center">
                        <Brain className="w-10 h-10 text-blue-600 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Card 1 */}
                <div className="absolute top-10 right-0 w-48 bg-white rounded-xl shadow-lg p-4 border border-gray-100 animate-float">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold">
                      Đề thi Toán lớp 9
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-100 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute bottom-10 left-0 w-52 bg-white rounded-xl shadow-lg p-4 border border-gray-100 animate-float-delayed">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold">
                      Giáo án Vật lý
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-100 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite 1.5s;
        }
      `}</style>
    </section>
  );
}
