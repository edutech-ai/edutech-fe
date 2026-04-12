import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/organisms/header";
import { Footer } from "@/components/organisms/footer";
import { blogPosts, getBlogPostBySlug } from "@/data/blog-posts";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArticleStructuredData } from "@/components/seo/StructuredData";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Bài viết không tồn tại" };

  return {
    title: `${post.title} | Blog EduTech AI`,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: `https://aiedutech.vn${post.thumbnail}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `https://aiedutech.vn/blog/${post.slug}`,
    },
  };
}

const categoryColors: Record<string, string> = {
  "AI trong giáo dục": "text-blue-600 before:bg-blue-500",
  "Kỹ năng giảng dạy": "text-purple-600 before:bg-purple-500",
  "Hướng dẫn": "text-emerald-600 before:bg-emerald-500",
  "Xu hướng": "text-orange-500 before:bg-orange-500",
};

function CategoryBadge({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) {
  const cls = categoryColors[category] ?? "text-gray-500 before:bg-gray-400";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:shrink-0 ${cls} ${className}`}
    >
      {category}
    </span>
  );
}

/** Render inline **bold** markers inside a string */
function parseInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderContent(content: string) {
  const nodes: React.ReactNode[] = [];
  const lines = content.split("\n");
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  function flushList() {
    if (!listBuffer.length) return;
    const Tag = listType === "ol" ? "ol" : "ul";
    nodes.push(
      <Tag
        key={`list-${nodes.length}`}
        className={`my-5 space-y-1.5 pl-6 text-gray-700 ${listType === "ol" ? "list-decimal" : "list-disc"}`}
      >
        {listBuffer.map((item, i) => (
          <li key={i} className="leading-relaxed">
            {parseInline(item)}
          </li>
        ))}
      </Tag>
    );
    listBuffer = [];
    listType = null;
  }

  lines.forEach((line, i) => {
    if (line.startsWith("## ")) {
      flushList();
      nodes.push(
        <h2
          key={i}
          className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-3 border-b border-gray-100"
        >
          {line.slice(3)}
        </h2>
      );
      return;
    }
    if (line.startsWith("### ")) {
      flushList();
      nodes.push(
        <h3 key={i} className="text-lg font-bold text-gray-900 mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
      return;
    }
    // Pure bold line → treat as sub-heading
    if (/^\*\*[^*]+\*\*$/.test(line.trim())) {
      flushList();
      nodes.push(
        <h4 key={i} className="text-base font-bold text-gray-900 mt-6 mb-2">
          {line.trim().slice(2, -2)}
        </h4>
      );
      return;
    }
    if (line.startsWith("- ")) {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      listBuffer.push(line.slice(2));
      return;
    }
    if (/^\d+\.\s/.test(line)) {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      listBuffer.push(line.replace(/^\d+\.\s/, ""));
      return;
    }
    flushList();
    if (line.trim()) {
      nodes.push(
        <p
          key={i}
          className="text-gray-700 leading-[1.9] mb-5 text-[1.0625rem]"
        >
          {parseInline(line)}
        </p>
      );
    }
  });
  flushList();
  return nodes;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  const otherPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      <ArticleStructuredData
        title={post.title}
        description={post.excerpt}
        author={post.author.name}
        publishedDate={post.publishedAt}
        image={`https://aiedutech.vn${post.thumbnail}`}
        url={`https://aiedutech.vn/blog/${post.slug}`}
      />

      {/* Breadcrumb */}
      <div className="pt-28 pb-5 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link
              href="/blog"
              className="hover:text-gray-700 transition-colors"
            >
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-xs">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr_320px] gap-14 items-start max-w-7xl mx-auto">
          {/* ── Main content ── */}
          <div className="min-w-0">
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại Blog
              </Link>
            </div>

            {/* Category + Title */}
            <CategoryBadge category={post.category} className="mb-4" />
            <h1 className="text-3xl md:text-4xl lg:text-[2.625rem] font-black text-gray-900 leading-tight mb-5 tracking-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed mb-8 border-l-4 border-primary/30 pl-5">
              {post.excerpt}
            </p>

            {/* Author + meta row */}
            <div className="flex items-center gap-5 pb-8 mb-10 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1.5">
                <Image
                  src="/images/logo/logo.svg"
                  alt="EduTech AI"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-none mb-0.5">
                  {post.author.name}
                </p>
                <p className="text-xs text-gray-400">{post.author.role}</p>
              </div>
              <span className="flex items-center gap-1.5 text-sm text-gray-400 shrink-0">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.publishedAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-400 shrink-0">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime} phút đọc
              </span>
            </div>

            {/* Hero image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-12">
              <Image
                src="/images/logo/backgroud.png"
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Article body */}
            <article className="prose-custom">
              {renderContent(post.content)}
            </article>

            {/* Tags */}
            <div className="mt-14 pt-8 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-full transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-8 lg:sticky lg:top-24">
            {/* Author card */}
            <div className="rounded-2xl border border-gray-100 p-6 bg-gray-50/50">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Tác giả
              </p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-2">
                  <Image
                    src="/images/logo/logo.svg"
                    alt="EduTech AI"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-900 leading-none mb-1">
                    {post.author.name}
                  </p>
                  <p className="text-xs text-gray-500">{post.author.role}</p>
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div className="rounded-2xl bg-primary p-6 text-white">
              <p className="font-bold text-lg mb-2 leading-tight">
                Thử EduTech AI miễn phí
              </p>
              <p className="text-white/70 text-sm mb-5 leading-relaxed">
                Tạo đề thi, quản lý lớp học và chấm bài tự động chỉ trong vài
                phút.
              </p>
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white text-primary font-semibold rounded-xl text-sm hover:bg-white/90 transition-colors"
              >
                Bắt đầu ngay <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  Bài viết liên quan
                </p>
                <div className="space-y-4">
                  {relatedPosts.map((rp) => (
                    <Link
                      key={rp.id}
                      href={`/blog/${rp.slug}`}
                      className="group flex gap-3 items-start"
                    >
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src="/images/logo/backgroud.png"
                          alt={rp.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">
                          {rp.title}
                        </p>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {rp.readingTime} phút
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* More posts */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Có thể bạn thích
              </p>
              <div className="space-y-3">
                {otherPosts.map((op) => (
                  <Link
                    key={op.id}
                    href={`/blog/${op.slug}`}
                    className="group flex gap-3 items-start"
                  >
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src="/images/logo/backgroud.png"
                        alt={op.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-sm text-gray-700 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {op.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
