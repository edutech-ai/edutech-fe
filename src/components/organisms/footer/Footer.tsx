"use client";

import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  product: [
    { name: "Tính năng", href: "#features" },
    { name: "Quy trình", href: "#process" },
    { name: "Bảng giá", href: "#pricing" },
    { name: "Đối tượng", href: "#target" },
  ],
  company: [
    { name: "Về chúng tôi", href: "#about-us" },
    { name: "Liên hệ", href: "#contact" },
    { name: "Blog", href: "/blog" },
    { name: "Tuyển dụng", href: "/careers" },
  ],
  legal: [
    { name: "Điều khoản sử dụng", href: "/terms" },
    { name: "Chính sách bảo mật", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
  social: [
    {
      name: "Facebook",
      icon: "/images/brand/facebook.svg",
      href: "https://www.facebook.com/aiedutechvn",
    },
    {
      name: "TikTok",
      icon: "/images/brand/tiktok.svg",
      href: "https://www.tiktok.com/@aiedutechvn",
    },
    {
      name: "Email",
      icon: "/images/brand/mail.svg",
      href: "mailto:edutechteam.work@gmail.com",
    },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid.svg')]" />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-125 bg-linear-to-b from-blue-50/50 to-transparent rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logo/logo.svg"
                  alt="EduTech Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative h-8 w-32">
                <Image
                  src="/images/logo/logo-text.svg"
                  alt="EduTech"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-gray-600 leading-relaxed max-w-sm">
              Nền tảng trợ lý AI toàn diện cho giáo dục. Tự động hóa soạn bài,
              chấm điểm và quản lý lớp học, giúp giáo viên tiết kiệm thời gian
              và nâng cao hiệu quả giảng dạy.
            </p>
            <div className="flex gap-3">
              {footerLinks.social.map((social) => {
                return (
                  <a
                    key={social.name}
                    target="_blank"
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-blue-600 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
                    aria-label={social.name}
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 md:col-span-1">
            <h4 className="font-bold text-gray-900 mb-6">Sản phẩm</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 md:col-span-1">
            <h4 className="font-bold text-gray-900 mb-6">Công ty</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 md:col-span-2 bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-4">Đăng ký nhận tin</h4>
            <p className="text-gray-600 mb-4 text-sm">
              Nhận thông tin cập nhật mới nhất về tính năng và ưu đãi từ EduTech
              AI.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Đăng ký
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Bằng cách đăng ký, bạn đồng ý với Chính sách bảo mật của chúng
                tôi.
              </p>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} EduTech AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
