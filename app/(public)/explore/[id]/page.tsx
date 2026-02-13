"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Clock, HelpCircle, User, BookOpen, GraduationCap } from "lucide-react";
import { Header } from "@/components/organisms/header";
import { Footer } from "@/components/organisms/footer";
import { ActionButton } from "@/components/molecules/action-button";
import {
  usePublicQuizById,
  usePublicQuizQuestions,
} from "@/services/quizService";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LaTeXRenderer } from "@/components/atoms/latex-renderer";

const DIFFICULTY_MAP: Record<string, { label: string; color: string }> = {
  easy: { label: "Dễ", color: "bg-green-100 text-green-700" },
  medium: { label: "Trung bình", color: "bg-yellow-100 text-yellow-700" },
  hard: { label: "Khó", color: "bg-red-100 text-red-700" },
};

const QUESTION_DIFFICULTY_MAP: Record<
  string,
  { label: string; color: string }
> = {
  RECOGNITION: { label: "Nhận biết", color: "bg-blue-100 text-blue-700" },
  COMPREHENSION: {
    label: "Thông hiểu",
    color: "bg-green-100 text-green-700",
  },
  APPLICATION: { label: "Vận dụng", color: "bg-orange-100 text-orange-700" },
  HIGH_APPLICATION: {
    label: "Vận dụng cao",
    color: "bg-red-100 text-red-700",
  },
};

export default function ExploreQuizDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: quizData, isLoading: quizLoading } = usePublicQuizById(id);
  const {
    data: questionsData,
    isLoading: questionsLoading,
    isError: questionsError,
  } = usePublicQuizQuestions(id);

  const quiz = quizData?.data;
  const questions = questionsData?.data?.questions ?? [];

  const difficultyInfo = DIFFICULTY_MAP[quiz?.difficulty ?? ""] ?? {
    label: quiz?.difficulty,
    color: "bg-gray-100 text-gray-700",
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <ActionButton href="/explore" label="Quay lại Khám phá" isBack />
          </div>
        </div>

        {quizLoading ? (
          <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : !quiz ? (
          <div className="max-w-6xl mx-auto px-4 py-20 text-center">
            <p className="text-gray-500 text-lg">Không tìm thấy đề thi này</p>
            <Link
              href="/explore"
              className="mt-4 inline-block text-blue-600 hover:underline text-sm"
            >
              Quay lại danh sách
            </Link>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Quiz Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {quiz.title}
              </h1>

              {quiz.description && (
                <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-3 mb-4">
                {quiz.subject && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                    <BookOpen className="w-3.5 h-3.5" />
                    {quiz.subject}
                  </span>
                )}
                {quiz.grade && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Lớp {quiz.grade}
                  </span>
                )}
                <span
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-full",
                    difficultyInfo.color
                  )}
                >
                  {difficultyInfo.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  {quiz.question_count ?? quiz.total_questions} câu hỏi
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {quiz.duration} phút
                </span>
                {"teacher_name" in quiz && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-gray-400" />
                    {(quiz as { teacher_name: string }).teacher_name}
                  </span>
                )}
              </div>
            </div>

            {/* Questions List — hidden when backend returns 401 */}
            {!questionsError && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Danh sách câu hỏi
                </h2>

                {questionsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl border border-gray-200 p-5"
                      >
                        <Skeleton className="h-4 w-full mb-3" />
                        <Skeleton className="h-3 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : questions.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">Chưa có câu hỏi nào</p>
                  </div>
                ) : (
                  questions.map((question, idx) => {
                    const qDiff = QUESTION_DIFFICULTY_MAP[
                      question.difficulty
                    ] ?? {
                      label: question.difficulty,
                      color: "bg-gray-100 text-gray-700",
                    };

                    return (
                      <div
                        key={question.id}
                        className="bg-white rounded-xl border border-gray-200 p-5"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <LaTeXRenderer
                              content={question.content}
                              as="div"
                              className="text-sm text-gray-900 font-medium"
                            />
                          </div>
                        </div>

                        {/* Options */}
                        {question.options && question.options.length > 0 && (
                          <div className="ml-10 space-y-2 mb-3">
                            {question.options.map((opt, optIdx) => {
                              const label = String.fromCharCode(65 + optIdx);
                              const text =
                                typeof opt === "string" ? opt : opt.text;
                              return (
                                <div
                                  key={optIdx}
                                  className="flex items-start gap-2 text-sm text-gray-700"
                                >
                                  <span className="font-medium text-gray-500 shrink-0">
                                    {label}.
                                  </span>
                                  <LaTeXRenderer content={text} as="span" />
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Meta */}
                        <div className="ml-10 flex items-center gap-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 text-[11px] font-medium rounded",
                              qDiff.color
                            )}
                          >
                            {qDiff.label}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {question.point} điểm
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
