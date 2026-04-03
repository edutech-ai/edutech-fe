"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import { usePublicQuizzes } from "@/services/quizService";
import { QuizDetailModal } from "@/components/features/library/QuizDetailModal";
import type { Quiz } from "@/types";

const SUBJECT_BG: Record<string, string> = {
  Toán: "/images/background/bg_math.svg",
  "Toán học": "/images/background/bg_math.svg",
  "Tiếng Anh": "/images/background/bg_english.svg",
  "Ngữ văn": "/images/background/bg_literature.svg",
  "Văn học": "/images/background/bg_literature.svg",
};
const DEFAULT_BG = "/images/background/bg_math.svg";

const SUBJECT_LIST = [
  "Toán",
  "Ngữ văn",
  "Tiếng Anh",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Lịch sử",
  "Địa lý",
  "GDCD",
  "Tin học",
  "Công nghệ",
];

const PAGE_SIZE = 20;

function LibraryQuizCard({
  quiz,
  onViewDetail,
}: {
  quiz: Quiz & { teacher_name?: string; teacher_email?: string };
  onViewDetail: () => void;
}) {
  const bgSrc = SUBJECT_BG[quiz.subject] ?? DEFAULT_BG;
  const date = new Date(quiz.created_at).toLocaleDateString("vi-VN");

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="h-32 relative bg-blue-50 overflow-hidden">
        <Image src={bgSrc} alt="" fill className="object-contain p-3" />
        {quiz.subject && (
          <span className="absolute top-2 left-2 bg-white/90 text-xs font-medium px-2 py-0.5 rounded-full text-gray-700">
            {quiz.subject}
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 min-h-9">
          {quiz.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          <span>1 Phần thi</span>
          <span>{quiz.total_questions} Câu hỏi</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
          <span>🕐</span>
          <span>{date}</span>
        </div>
        <button
          onClick={onViewDetail}
          className="mt-auto w-full py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}

export default function DashboardExplorePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = usePublicQuizzes({
    search: debouncedSearch || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const allQuizzes = (data?.data ?? []) as Array<
    Quiz & { teacher_name?: string; teacher_email?: string }
  >;
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const filtered =
    selectedSubjects.length > 0
      ? allQuizzes.filter((q) => selectedSubjects.includes(q.subject))
      : allQuizzes;

  // Derive subject counts from current page data
  const subjectCounts = SUBJECT_LIST.reduce<Record<string, number>>(
    (acc, s) => {
      acc[s] = allQuizzes.filter((q) => q.subject === s).length;
      return acc;
    },
    {}
  );

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
    setPage(1);
  };

  const FilterPanel = (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Lọc kết quả
        </h3>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-500" />
            Môn học
          </h4>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {SUBJECT_LIST.map((subject) => (
              <label
                key={subject}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject)}
                  onChange={() => toggleSubject(subject)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900">
                  {subject}
                </span>
                {subjectCounts[subject] > 0 && (
                  <span className="text-xs text-gray-400">
                    ({subjectCounts[subject]})
                  </span>
                )}
              </label>
            ))}
          </div>
          {selectedSubjects.length > 0 && (
            <button
              onClick={() => setSelectedSubjects([])}
              className="mt-2 text-xs text-blue-600 hover:text-blue-700"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Kho học liệu
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Khám phá và sử dụng đề thi được chia sẻ từ cộng đồng giáo viên
        </p>
      </div>

      <div className="flex gap-6">
        {/* Desktop filter sidebar */}
        <aside className="hidden md:block w-56 shrink-0">{FilterPanel}</aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Search bar + count */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              className="md:hidden p-2.5 rounded-xl border border-gray-300 bg-white"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm text-gray-500 whitespace-nowrap shrink-0">
              <span className="font-semibold text-blue-600">
                {pagination?.total ?? 0}
              </span>{" "}
              kết quả
            </span>
          </div>

          {/* Mobile filter panel */}
          {showFilters && <div className="md:hidden">{FilterPanel}</div>}

          {/* Quiz grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border h-56 animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              {search
                ? `Không tìm thấy kết quả cho "${search}"`
                : "Chưa có đề thi nào"}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4">
              {filtered.map((quiz) => (
                <LibraryQuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onViewDetail={() => setSelectedQuiz(quiz)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;
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
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <QuizDetailModal
        quiz={selectedQuiz}
        open={!!selectedQuiz}
        onClose={() => setSelectedQuiz(null)}
      />
    </div>
  );
}
