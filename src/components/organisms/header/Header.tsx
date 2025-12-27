"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="group flex items-center justify-center">
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/images/logo/logo.svg"
                alt="EduTech Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative h-8 w-32 hidden sm:block">
              <Image
                src="/images/logo/logo-text.svg"
                alt="EduTech"
                fill
                className="object-contain object-left"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {["Tính năng", "Quy trình", "Bảng giá", "Về chúng tôi"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item === "Tính năng" ? "features" : item === "Bảng giá" ? "pricing" : item === "Về chúng tôi" ? "about-us" : "process"}`}
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                </a>
              )
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-white bg-primary hover:bg-blue-700 px-4 py-2 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-blue-600 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/30 cursor-pointer"
            >
              Dùng thử miễn phí
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-4 animate-fade-in-up">
          {["Tính năng", "Quy trình", "Bảng giá", "Về chúng tôi"].map(
            (item) => (
              <a
                key={item}
                href={`#${item === "Tính năng" ? "features" : item === "Bảng giá" ? "pricing" : item === "Quy trình" ? "process" : "about-us"}`}
                className="text-base font-medium text-gray-600 hover:text-blue-600 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            )
          )}
          <hr className="border-gray-100" />
          <Link
            href="/login"
            className="text-center py-3 font-semibold text-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="text-center py-3 font-semibold text-white bg-blue-600 rounded-xl"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dùng thử miễn phí
          </Link>
        </div>
      )}
    </header>
  );
}
