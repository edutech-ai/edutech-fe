import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduTech AI - Hệ thống AI hỗ trợ giảng dạy",
  description:
    "EduTech AI giúp giáo viên tự động hoá việc soạn bài, tạo đề thi và chấm điểm. Nhanh hơn, chuẩn hơn và nhất quán hơn.",
  keywords: [
    "giáo dục",
    "AI",
    "tạo đề thi",
    "giáo án",
    "chấm bài tự động",
    "EduTech",
  ],
  authors: [{ name: "EduTech Development Team" }],
  openGraph: {
    title: "EduTech AI - Hệ thống AI hỗ trợ giảng dạy",
    description: "Tạo đề thi, giáo án và học liệu chỉ trong vài phút với AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/logo/logo.svg" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EduTech AI" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
