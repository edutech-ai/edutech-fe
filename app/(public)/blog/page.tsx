import type { Metadata } from "next";
import { Header } from "@/components/organisms/header";
import { Footer } from "@/components/organisms/footer";
import { blogPosts, categories } from "@/data/blog-posts";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - Kiến thức AI giáo dục",
  description:
    "Khám phá các bài viết về AI trong giáo dục, tips giảng dạy hiệu quả, hướng dẫn sử dụng công nghệ cho giáo viên Việt Nam.",
  keywords: [
    "blog giáo dục",
    "AI giáo dục",
    "tips giáo viên",
    "công nghệ giáo dục",
    "EdTech Việt Nam",
  ],
  openGraph: {
    title: "Blog AI EduTech - Kiến thức AI giáo dục",
    description:
      "Bài viết về AI trong giáo dục, tips giảng dạy và công nghệ cho giáo viên.",
  },
};

const categoryColors: Record<string, string> = {
  "AI trong giáo dục": "text-blue-600 before:bg-blue-500",
  "Kỹ năng giảng dạy": "text-purple-600 before:bg-purple-500",
  "Hướng dẫn": "text-emerald-600 before:bg-emerald-500",
  "Xu hướng": "text-orange-500 before:bg-orange-500",
};

function CategoryBadge({ category }: { category: string }) {
  const cls = categoryColors[category] ?? "text-gray-500 before:bg-gray-400";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:shrink-0 ${cls}`}
    >
      {category}
    </span>
  );
}

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const featuredPost = sorted[0];
  const otherPosts = sorted.slice(1);

  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      {/* Hero — clean, minimal */}
      <section className="pt-32 pb-10 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">
            Bài viêt
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4 max-w-xl">
            Góc nhìn về AI trong giáo dục
          </h1>
          <p className="text-gray-500 max-w-lg">
            Tips giảng dạy, xu hướng EdTech và hướng dẫn ứng dụng AI dành cho
            giáo viên Việt Nam.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-4 border-b border-gray-100 sticky top-16 bg-white/95 backdrop-blur-sm z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  cat === "Tất cả"
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Featured post */}
        <Link href={`/blog/${featuredPost.slug}`} className="group block mb-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src="/images/logo/backgroud.png"
                alt={featuredPost.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>
            <div className="space-y-4">
              <CategoryBadge category={featuredPost.category} />
              <h2 className="text-3xl font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-gray-500 leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-5 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(featuredPost.publishedAt).toLocaleDateString(
                    "vi-VN"
                  )}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {featuredPost.readingTime} phút đọc
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                Đọc bài viết <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest shrink-0">
            Bài viết mới nhất
          </h2>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {otherPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-gray-100 mb-4">
                <Image
                  src="/images/logo/backgroud.png"
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col flex-1 space-y-2">
                <CategoryBadge category={post.category} />
                <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.publishedAt).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readingTime} phút đọc
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
