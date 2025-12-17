"use client";

import Script from "next/script";

// Interface cho Organization Schema
interface OrganizationSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint: {
    "@type": string;
    telephone?: string;
    contactType: string;
    email?: string;
  };
  sameAs: string[];
}

// Interface cho WebSite Schema
interface WebSiteSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  description: string;
  potentialAction: {
    "@type": string;
    target: {
      "@type": string;
      urlTemplate: string;
    };
    "query-input": string;
  };
}

// Interface cho SoftwareApplication Schema
interface SoftwareApplicationSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    "@type": string;
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    "@type": string;
    ratingValue: string;
    ratingCount: string;
  };
}

// Component chính cho Structured Data
export function StructuredData() {
  const organizationSchema: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Edutech",
    url: "https://edutechai.vn",
    logo: "https://edutechai.vn/images/logo.png",
    description:
      "Hệ thống quản lý đề thi thông minh, hỗ trợ giáo viên tạo, quản lý và làm việc hiệu quả.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "support@edutechai.vn",
    },
    sameAs: [
      "https://facebook.com/edutechai.vn",
      "https://twitter.com/edutechai_vn",
    ],
  };

  const websiteSchema: WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Edutech",
    url: "https://edutechai.vn",
    description: "Hệ thống quản lý đề thi thông minh",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://edutechai.vn/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const softwareApplicationSchema: SoftwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Edutech",
    description:
      "Hệ thống quản lý đề thi thông minh với tính năng chấm điểm tự động và thi trực tuyến",
    url: "https://edutechai.vn",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "VND",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
  };

  return (
    <>
      {/* Organization Schema */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      {/* Website Schema */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      {/* Software Application Schema */}
      <Script
        id="software-application-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
    </>
  );
}

// Component cho Article Schema (dùng cho blog posts, tin tức)
interface ArticleSchemaProps {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  image: string;
  url: string;
}

export function ArticleStructuredData({
  title,
  description,
  author,
  publishedDate,
  modifiedDate,
  image,
  url,
}: ArticleSchemaProps) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Edutech",
      logo: {
        "@type": "ImageObject",
        url: "https://edutechai.vn/images/logo.png",
      },
    },
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    image: {
      "@type": "ImageObject",
      url: image,
    },
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleSchema),
      }}
    />
  );
}

// Component cho Course Schema (dùng cho các khóa học, giáo án)
interface CourseSchemaProps {
  name: string;
  description: string;
  provider: string;
  url: string;
  image?: string;
}

export function CourseStructuredData({
  name,
  description,
  provider,
  url,
  image,
}: CourseSchemaProps) {
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
    },
    url,
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
      },
    }),
  };

  return (
    <Script
      id="course-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(courseSchema),
      }}
    />
  );
}
