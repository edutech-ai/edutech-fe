"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Copy, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuizQuestions, useCreateQuiz } from "@/services/quizService";
import { useBulkCreateQuestions } from "@/services/questionService";
import type { Quiz } from "@/types/quiz";
import type { Question } from "@/types/question";
import { LaTeXRenderer } from "@/components/atoms/latex-renderer";
import { toast } from "sonner";

interface QuizDetailModalProps {
  quiz: Quiz | null;
  open: boolean;
  onClose: () => void;
}

const difficultyLabels: Record<string, string> = {
  RECOGNITION: "Nhận biết",
  COMPREHENSION: "Thông hiểu",
  APPLICATION: "Vận dụng",
  HIGH_APPLICATION: "Vận dụng cao",
};

const typeLabels: Record<string, string> = {
  MCQ: "1 đáp án",
  MULTIPLE_ANSWER: "Nhiều đáp án",
  TRUE_FALSE: "Đúng/Sai",
  ESSAY: "Tự luận",
};

function QuestionPreviewItem({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const options = question.options ?? [];

  return (
    <div className="border border-gray-100 rounded-lg p-3 hover:border-gray-200 transition-colors">
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold flex items-center justify-center mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 justify-between">
            <LaTeXRenderer
              content={question.content}
              className="text-sm text-gray-800 flex-1"
            />
            {options.length > 0 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-gray-400 hover:text-gray-600 p-1 shrink-0"
              >
                {expanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
              {typeLabels[question.type] ?? question.type}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
              {difficultyLabels[question.difficulty] ?? question.difficulty}
            </span>
            <span className="text-xs text-gray-400">{question.point} điểm</span>
          </div>

          {expanded && options.length > 0 && (
            <div className="mt-2 space-y-1">
              {options.map((opt, i) => {
                const optText = typeof opt === "string" ? opt : opt.text;
                const correctAns = question.correct_answer;
                const isCorrect = Array.isArray(correctAns)
                  ? correctAns.includes(optText)
                  : correctAns === optText;
                return (
                  <div
                    key={i}
                    className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                      isCorrect
                        ? "bg-green-50 text-green-700 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    <span className="font-medium">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    <LaTeXRenderer content={optText} as="span" />
                    {isCorrect && <span className="ml-auto">✓</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function QuizDetailModal({ quiz, open, onClose }: QuizDetailModalProps) {
  const router = useRouter();
  const [isCopying, setIsCopying] = useState(false);

  const { data: questionsData, isLoading } = useQuizQuestions(quiz?.id, true, {
    enabled: open && !!quiz?.id,
  });

  const createQuiz = useCreateQuiz();
  const bulkCreate = useBulkCreateQuestions();

  const questions = questionsData?.data?.questions ?? [];

  const handleCopy = async () => {
    if (!quiz || questions.length === 0) return;

    setIsCopying(true);
    try {
      // Step 1: Create new quiz with same metadata
      const newQuiz = await createQuiz.mutateAsync({
        title: `${quiz.title} (bản sao)`,
        description: quiz.description ?? undefined,
        subject: quiz.subject,
        grade: quiz.grade,
        difficulty: quiz.difficulty,
        duration: quiz.duration,
        status: "draft",
      });

      const newQuizId = newQuiz.data.id;

      // Step 2: Bulk create all questions in new quiz
      await bulkCreate.mutateAsync({
        quiz_id: newQuizId,
        questions: questions.map((q) => ({
          content: q.content,
          options: q.options ?? undefined,
          correct_answer: q.correct_answer,
          type: q.type,
          point: q.point,
          difficulty: q.difficulty,
          explanation: q.explanation ?? undefined,
        })),
      });

      toast.success("Đã tạo đề thi mới từ bản sao");
      onClose();
      router.push(`/dashboard/quiz/${newQuizId}/edit`);
    } catch {
      toast.error("Không thể sao chép đề thi, vui lòng thử lại");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="pr-8 line-clamp-2">{quiz?.title}</DialogTitle>
        </DialogHeader>

        {/* Quiz meta */}
        <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
          {quiz?.subject && (
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
              {quiz.subject}
            </span>
          )}
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {quiz?.total_questions} câu hỏi
          </span>
          {quiz?.duration && <span>{quiz.duration} phút</span>}
        </div>

        {/* Copy button */}
        <div className="flex justify-end">
          <Button
            disabled={isLoading || questions.length === 0 || isCopying}
            onClick={handleCopy}
          >
            {isCopying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang sao chép...
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Sao chép đề thi
              </>
            )}
          </Button>
        </div>

        {/* Questions list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : questions.length === 0 ? (
            <p className="text-center text-gray-500 py-10 text-sm">
              Không có câu hỏi nào
            </p>
          ) : (
            questions.map((q, i) => (
              <QuestionPreviewItem key={q.id} question={q} index={i} />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
