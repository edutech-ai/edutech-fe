import type { Metadata } from "next";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  noIndex = false,
  noFollow = false,
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aiedutech.vn";
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const ogImage = image
    ? `${baseUrl}${image}`
    : `${baseUrl}/images/og-image.png`;

  const allKeywords = [
    ...keywords,
    "edutech",
    "đề thi",
    "quản lý lớp học",
    "hệ thống giáo dục",
    ...tags,
  ];
  const metadata: Metadata = {
    title: title ? `${title} | AI EduTech` : undefined,
    description,
    keywords: allKeywords.length > 0 ? allKeywords : undefined,
    alternates: {
      canonical: url || "/",
    },
    openGraph: {
      type,
      locale: "vi_VN",
      url: fullUrl,
      title: title
        ? `${title} | AI EduTech`
        : "AI EduTech - Hệ thống quản lý đề thi thông minh",
      description:
        description ||
        "AI EduTech là hệ thống quản lý đề thi thông minh, hỗ trợ giáo viên tạo, quản lý và làm đề kiểm tra hiệu quả.",
      siteName: "AI EduTech",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || "AI EduTech",
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: title
        ? `${title} | AI EduTech`
        : "AI EduTech - Hệ thống quản lý đề thi thông minh",
      description:
        description ||
        "AI EduTech là hệ thống quản lý đề thi thông minh, hỗ trợ giáo viên tạo, quản lý và làm đề kiểm tra hiệu quả.",
      images: [ogImage],
      creator: "@aiedutech_vn",
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };

  return metadata;
}

// Hook để sử dụng trong các component
export function useSEO(props: SEOProps) {
  return generateSEOMetadata(props);
}

// Các template SEO cho các trang phổ biến
export const SEOTemplates = {
  home: (): SEOProps => ({
    title: "Trang chủ",
    description:
      "AI EduTech - Hệ thống quản lý đề thi thông minh, hỗ trợ giáo viên tạo, quản lý và làm đề kiểm tra hiệu quả.",
    keywords: [
      "trang chủ",
      "ai edutech",
      "hệ thống giáo dục",
      "tạo đề thi",
      "quản lý lớp học",
      "bài kiểm tra",
      "AI giáo dục",
    ],
    url: "/",
  }),

  login: (): SEOProps => ({
    title: "Đăng nhập",
    description:
      "Đăng nhập vào hệ thống AI EduTech để quản lý đề thi và sử dụng các tính năng giáo dục thông minh.",
    keywords: ["đăng nhập", "login", "tài khoản", "ai edutech"],
    url: "/login",
  }),

  register: (): SEOProps => ({
    title: "Đăng ký",
    description:
      "Đăng ký tài khoản AI EduTech miễn phí để sử dụng các công cụ AI tạo đề thi, giáo án thông minh.",
    keywords: ["đăng ký", "register", "tạo tài khoản", "ai edutech"],
    url: "/register",
  }),

  exam: (): SEOProps => ({
    title: "Thi trực tuyến",
    description:
      "Hệ thống thi trực tuyến của AI EduTech cho phép tạo và quản lý các kỳ thi một cách hiệu quả và bảo mật.",
    keywords: ["thi trực tuyến", "online exam", "kiểm tra", "ai edutech"],
    url: "/exam",
  }),

  dashboard: (): SEOProps => ({
    title: "Bảng điều khiển",
    description:
      "Quản lý đề thi, lớp học và học liệu với AI EduTech Dashboard.",
    keywords: ["dashboard", "quản lý", "đề thi", "lớp học"],
    url: "/dashboard",
    noIndex: true,
  }),

  classroom: (): SEOProps => ({
    title: "Quản lý lớp học",
    description: "Quản lý lớp học, học sinh và bài kiểm tra với AI EduTech.",
    keywords: ["lớp học", "classroom", "quản lý học sinh"],
    url: "/dashboard/classroom",
    noIndex: true,
  }),
};
