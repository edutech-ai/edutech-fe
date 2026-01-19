import type { Metadata } from "next";
import { Header } from "@/components/organisms/header";
import { Footer } from "@/components/organisms/footer";
import { blogPosts, categories } from "@/data/blog-posts";
import { Calendar, Clock, User } from "lucide-react";
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
    "hướng dẫn giảng dạy",
    "soạn bài AI",
  ],
  openGraph: {
    title: "Blog AI EduTech - Kiến thức AI giáo dục",
    description:
      "Bài viết về AI trong giáo dục, tips giảng dạy và công nghệ cho giáo viên.",
  },
};

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen w-full">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Blog <span className="text-blue-600">AI EduTech</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kiến thức về AI trong giáo dục, tips giảng dạy hiệu quả và xu hướng
            công nghệ dành cho giáo viên Việt Nam.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "Tất cả"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`/blog/${featuredPost.slug}`} className="group block">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>
              </div>
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-gray-600">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {featuredPost.author.name}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredPost.publishedAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readingTime} phút đọc
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Other Posts Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Bài viết mới nhất
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">
                      {post.category === "AI trong giáo dục"
                        ? "🤖"
                        : post.category === "Kỹ năng giảng dạy"
                          ? "📖"
                          : post.category === "Hướng dẫn"
                            ? "📝"
                            : "🚀"}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.publishedAt).toLocaleDateString("vi-VN")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime} phút
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Đăng ký nhận bài viết mới
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Nhận thông báo khi có bài viết mới về AI giáo dục và tips giảng dạy
            hiệu quả.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
