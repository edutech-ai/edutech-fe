import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import { StructuredData } from "@/components/seo/StructuredData";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aiedutech.vn";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "AI EduTech - Trợ lý AI đồng hành cùng Giáo viên Việt",
    template: "%s | AI EduTech",
  },
  description:
    "AI EduTech giúp giáo viên tự động hoá việc soạn bài, tạo đề thi và chấm điểm. Nhanh hơn, chuẩn hơn và nhất quán hơn.",
  keywords: [
    "giáo dục",
    "AI",
    "tạo đề thi",
    "giáo án",
    "chấm bài tự động",
    "EduTech",
    "quản lý lớp học",
    "thi trực tuyến",
    "AI giáo dục",
    "hệ thống giáo dục thông minh",
  ],
  authors: [{ name: "AI EduTech Development Team" }],
  creator: "AI EduTech",
  publisher: "AI EduTech",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-144.png", sizes: "144x144", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: baseUrl,
    siteName: "AI EduTech",
    title: "AI EduTech - Trợ lý AI đồng hành cùng Giáo viên Việt",
    description:
      "Tạo đề thi, giáo án và học liệu chỉ trong vài phút với AI. Nhanh hơn, chuẩn hơn và nhất quán hơn.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI EduTech - Trợ lý AI đồng hành cùng Giáo viên Việt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI EduTech - Trợ lý AI đồng hành cùng Giáo viên Việt",
    description:
      "Tạo đề thi, giáo án và học liệu chỉ trong vài phút với AI. Nhanh hơn, chuẩn hơn và nhất quán hơn.",
    images: ["/images/og-image.png"],
    creator: "@aiedutech_vn",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-google-verification-code",
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
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI EduTech" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StructuredData />
        <QueryProvider>{children}</QueryProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
