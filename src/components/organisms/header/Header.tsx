"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Compass } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  scrollTarget?: string; // For homepage scroll
  highlight?: boolean;
}

const navItems: NavItem[] = [
  { label: "Khám phá", href: "/explore", highlight: true },
  { label: "Về chúng tôi", href: "/about", scrollTarget: "#about" },
  { label: "Tính năng", href: "/features", scrollTarget: "#features" },
  { label: "Bảng giá", href: "/pricing" },
  { label: "Bài viết", href: "/blog" },
  // { label: "Hướng dẫn", href: "/guide" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    // On homepage, scroll to section if scrollTarget exists
    if (isHomePage && item.scrollTarget) {
      e.preventDefault();
      const element = document.querySelector(item.scrollTarget);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

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
            <div className="relative md:hidden w-10 h-10 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/images/logo/logo.svg"
                alt="EduTech Logo"
                fill
                className="object-contain"
              />
            </div>
            <div
              className="relative lg:h-12 lg:w-40 h-8 w-32 hidden md:block cursor-pointer transition-transform duration-300 group-hover:scale-105"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              <Image
                src="/images/logo/logo-text.png"
                alt="EduTech"
                fill
                className="object-contain object-left"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) =>
              item.highlight ? (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                    isActive(item.href)
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-md hover:shadow-blue-500/25"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.label}
                  href={
                    isHomePage && item.scrollTarget
                      ? item.scrollTarget
                      : item.href
                  }
                  onClick={(e) => handleNavClick(e, item)}
                  className={`text-sm font-medium transition-colors relative group cursor-pointer ${
                    isActive(item.href)
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                      isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
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
              className="px-5 py-2.5 text-sm md:hidden lg:block font-semibold text-primary bg-transparent border border-primary hover:bg-blue-600 hover:text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/30 cursor-pointer"
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-2 animate-fade-in-up">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={
                isHomePage && item.scrollTarget ? item.scrollTarget : item.href
              }
              className={`text-base font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                item.highlight
                  ? isActive(item.href)
                    ? "text-white bg-blue-600 flex items-center gap-2"
                    : "text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white flex items-center gap-2"
                  : isActive(item.href)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
              onClick={(e) => {
                handleNavClick(e, item);
                if (!item.scrollTarget || !isHomePage) {
                  setIsMobileMenuOpen(false);
                }
              }}
            >
              {item.highlight && <Compass className="w-4 h-4" />}
              {item.label}
            </Link>
          ))}
          <hr className="border-gray-100 my-2" />
          <Link
            href="/login"
            className="text-center py-3 font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="text-center py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dùng thử miễn phí
          </Link>
        </div>
      )}
    </header>
  );
}
