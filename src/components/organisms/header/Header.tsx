"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Compass,
  User,
  ChevronDown,
  FileText,
  School,
  LogOut,
} from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useUserStore } from "@/store/useUserStore";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  const { user, isAuthenticated, clearUser } = useUserStore();
  const isLoggedIn = isAuthenticated();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const handleLogout = () => {
    clearUser();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const userMenuItems = [
    {
      label: "Thông tin cá nhân",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      label: "Quản lí đề thi",
      href: "/dashboard/quizzes",
      icon: FileText,
    },
    {
      label: "Quản lí lớp học",
      href: "/dashboard/classrooms",
      icon: School,
    },
  ];

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
                <RainbowButton
                  key={item.label}
                  asChild
                  size="default"
                  variant="outline"
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                  >
                    <Compass className="w-4 h-4" />
                    {item.label}
                  </Link>
                </RainbowButton>
              ) : (
                <Link
                  key={item.label}
                  href={
                    isHomePage && item.scrollTarget
                      ? item.scrollTarget
                      : item.href
                  }
                  onClick={(e) => handleNavClick(e, item)}
                  className={`text-base font-medium transition-colors relative group cursor-pointer ${
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
            {isLoggedIn && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-full hover:bg-gray-100/80 transition-all duration-200 cursor-pointer group"
                >
                  {/* Avatar */}
                  {user.avatar_url ? (
                    <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all">
                      <Image
                        src={user.avatar_url}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all">
                      <span className="text-white text-sm font-bold">
                        {user.name?.charAt(0)?.toUpperCase() || "G"}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in-up z-50">
                    {/* Menu Items */}
                    <div className="py-1">
                      {userMenuItems.map((menuItem) => (
                        <Link
                          key={menuItem.label}
                          href={menuItem.href}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          <menuItem.icon className="w-4 h-4" />
                          {menuItem.label}
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Auth Buttons */
              <>
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
              </>
            )}
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
          {navItems.map((item) =>
            item.highlight ? (
              <RainbowButton
                key={item.label}
                asChild
                size="default"
                variant="outline"
                className="w-full"
              >
                <Link
                  href={item.href}
                  onClick={(e) => {
                    handleNavClick(e, item);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Compass className="w-4 h-4" />
                  {item.label}
                </Link>
              </RainbowButton>
            ) : (
              <Link
                key={item.label}
                href={
                  isHomePage && item.scrollTarget
                    ? item.scrollTarget
                    : item.href
                }
                className={`text-base font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                  isActive(item.href)
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
                {item.label}
              </Link>
            )
          )}
          <hr className="border-gray-100 my-2" />

          {isLoggedIn && user ? (
            /* Mobile Logged-in Menu */
            <>
              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-3">
                {user.avatar_url ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-500/20">
                    <Image
                      src={user.avatar_url}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || "G"}
                    </span>
                  </div>
                )}
              </div>

              <hr className="border-gray-100 my-1" />

              {/* Menu Items */}
              {userMenuItems.map((menuItem) => (
                <Link
                  key={menuItem.label}
                  href={menuItem.href}
                  className="flex items-center gap-3 py-3 px-4 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <menuItem.icon className="w-5 h-5" />
                  {menuItem.label}
                </Link>
              ))}

              <hr className="border-gray-100 my-1" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 py-3 px-4 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                Đăng xuất
              </button>
            </>
          ) : (
            /* Mobile Guest Buttons */
            <>
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
            </>
          )}
        </div>
      )}
    </header>
  );
}
