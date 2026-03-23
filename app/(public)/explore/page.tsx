"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Header } from "@/components/organisms/header";
import { Footer } from "@/components/organisms/footer";
import { ExploreQuizCard } from "@/components/molecules/explore/ExploreQuizCard";
import { usePublicQuizzes } from "@/services/quizService";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/useUserStore";

const PAGE_SIZE = 20;

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = usePublicQuizzes({
    search: debouncedSearch || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const quizzes = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Banner */}
        <section className="relative overflow-hidden border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Trang chia sẻ đề thi
              </h1>
              <p className="text-sm text-gray-500 mb-6 max-w-md">
                Tổng hợp những bài kiểm tra được chia sẻ từ giáo viên trên nền
                tảng
              </p>

              {/* Search + CTA */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm bài quiz..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Link
                  href={isAuthenticated() ? "/dashboard/quiz" : "/register"}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  Tạo Quiz bằng AI ngay
                </Link>
              </div>
            </div>

            {/* Banner illustration */}
            <div className="absolute right-4 top-0 bottom-0 w-64 lg:w-80 hidden md:block pointer-events-none">
              <Image
                src="/images/banner/banner_explore.svg"
                alt=""
                fill
                className="object-contain object-right"
                priority
              />
            </div>
          </div>
        </section>

        {/* Quiz Grid Section */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {debouncedSearch
                ? `Kết quả cho "${debouncedSearch}"`
                : "Đề thi mới nhất"}
            </h2>
            {pagination && (
              <span className="text-sm text-gray-500">
                {pagination.total} đề thi
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <Skeleton className="h-40 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-9 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {debouncedSearch
                  ? "Không tìm thấy đề thi phù hợp"
                  : "Chưa có đề thi nào được chia sẻ"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {quizzes.map((quiz) => (
                  <ExploreQuizCard key={quiz.id} quiz={quiz} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }).map(
                    (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                            page === pageNum
                              ? "bg-blue-600 text-white"
                              : "border border-gray-200 hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
