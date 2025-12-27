"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Công cụ", href: "#features" },
    { name: "Bảng giá", href: "#pricing" },
    { name: "Về EduTech AI", href: "#about" },
    { name: "Liên hệ", href: "#contact" },
  ],
  legal: [
    { name: "Điều khoản sử dụng", href: "/terms" },
    { name: "Chính sách bảo mật", href: "/privacy" },
    { name: "Hỗ trợ", href: "/support" },
  ],
  social: [
    { name: "Email", icon: Mail, href: "mailto:edutechteam.work@gmail.com" },
    { name: "GitHub", icon: Github, href: "https://github.com/edutech-ai" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo/logo.svg"
                  alt="EduTech Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold">EduTech AI</h3>
                <p className="text-sm text-gray-400">Giáo dục thông minh</p>
              </div>
            </Link>
            <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
              Hệ thống AI hỗ trợ giảng dạy toàn diện, giúp giáo viên tối ưu hoá
              công việc và nâng cao chất lượng giáo dục.
            </p>
            <div className="flex gap-3">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-11 h-11 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Sản phẩm</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Pháp lý</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} EduTech AI. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Made with ❤️ by the EduTech Development Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
