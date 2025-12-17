import { Metadata } from "next";

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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "edutechai.vn";
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
    title: title ? `${title} | PlanBook` : undefined,
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
        ? `${title} | Edutech`
        : "Edutech - Hệ thống quản quản lý đề thi thông minh",
      description:
        description ||
        "Edutech là hệ thống quản quản lý đề thi thông minh, hỗ trợ giáo viên tạo, quản lý và đề kiểm tra hiệu quả.",
      siteName: "Edutech",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || "Edutech",
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
        ? `${title} | Edutech`
        : "Edutech - Hệ thống quản quản lý đề thi thông minh",
      description:
        description ||
        "Edutech là hệ thống quản quản lý đề thi thông minh, hỗ trợ giáo viên tạo, quản lý và đề kiểm tra hiệu quả.",
      images: [ogImage],
      creator: "@edutech_vn",
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
      "Edutech - Hệ thống quản quản lý đề thi thông minh, hỗ trợ giáo viên tạo, quản lý và đề kiểm tra hiệu quả.",
    keywords: [
      "trang chủ",
      "edutech",
      "hệ thống giáo dục",
      "tạo đề thi",
      "quản lý lớp học",
      "bài kiểm tra",
    ],
    url: "/",
  }),

  login: (): SEOProps => ({
    title: "Đăng nhập",
    description:
      "Đăng nhập vào hệ thống Edutech để quản lý đề thi và sử dụng các tính năng giáo dục thông minh.",
    keywords: ["đăng nhập", "login", "tài khoản"],
    url: "/auth",
  }),
  exam: (): SEOProps => ({
    title: "Thi trực tuyến",
    description:
      "Hệ thống thi trực tuyến của Edutech cho phép tạo và quản lý các kỳ thi một cách hiệu quả và bảo mật.",
    keywords: ["thi trực tuyến", "online exam", "kiểm tra"],
    url: "/exam",
  }),
};
