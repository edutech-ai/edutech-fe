"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePublicQuizzes, useQuizQuestions } from "@/services/quizService";
import type { Quiz } from "@/types/quiz";
import type { Question } from "@/types/question";
import type { QuestionUI } from "@/types";
import { LaTeXRenderer } from "@/components/atoms/latex-renderer";

interface ImportFromLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (questions: QuestionUI[]) => void;
}

// Convert backend Question → UI QuestionUI (same logic as quiz edit page)
function convertToUIQuestion(q: Question): QuestionUI {
  const convertedOptions = q.options?.map((opt) =>
    typeof opt === "string" ? opt : opt.text
  );

  let correctAnswer: number | string | undefined;
  let correctAnswers: number[] | undefined;

  if (q.type === "TRUE_FALSE") {
    const parsed =
      typeof q.correct_answer === "number"
        ? q.correct_answer
        : parseInt(String(q.correct_answer), 10);
    correctAnswer = isNaN(parsed) ? 0 : parsed;
  } else if (q.type === "ESSAY") {
    correctAnswer = String(q.correct_answer ?? "");
  } else if (q.type === "MULTIPLE_ANSWER" && convertedOptions) {
    const answers = Array.isArray(q.correct_answer)
      ? q.correct_answer
      : [q.correct_answer];
    correctAnswers = answers
      .map((ans) => convertedOptions.findIndex((opt) => opt === ans))
      .filter((idx) => idx >= 0);
  } else if (convertedOptions && q.correct_answer !== undefined) {
    const idx = convertedOptions.findIndex((opt) => opt === q.correct_answer);
    correctAnswer = idx >= 0 ? idx : 0;
  }

  return {
    id: `imported_${q.id}_${Date.now()}`,
    type: q.type,
    content: q.content,
    options: convertedOptions,
    correctAnswer,
    correctAnswers,
    points: q.point,
    difficulty: q.difficulty,
    explanation: q.explanation ?? undefined,
  };
}

const typeLabels: Record<string, string> = {
  MCQ: "1 đáp án",
  MULTIPLE_ANSWER: "Nhiều đáp án",
  TRUE_FALSE: "Đúng/Sai",
  ESSAY: "Tự luận",
};

function QuizQuestionsPanel({
  quiz,
  selectedIds,
  onToggle,
}: {
  quiz: Quiz;
  selectedIds: Set<string>;
  onToggle: (q: Question) => void;
}) {
  const { data, isLoading } = useQuizQuestions(quiz.id, true);
  const questions = data?.data?.questions ?? [];

  if (isLoading) {
    return (
      <div className="px-4 pb-3 space-y-1.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (questions.length === 0) {
    return <p className="px-4 pb-3 text-xs text-gray-400">Không có câu hỏi</p>;
  }

  return (
    <div className="px-4 pb-3 space-y-1.5 max-h-64 overflow-y-auto">
      {questions.map((q) => (
        <label
          key={q.id}
          className="flex items-start gap-2.5 cursor-pointer group"
        >
          <div className="mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={selectedIds.has(q.id)}
              onChange={() => onToggle(q)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <LaTeXRenderer
              content={q.content}
              className="text-sm text-gray-700 group-hover:text-gray-900 line-clamp-2"
            />
            <span className="text-xs text-gray-400">
              {typeLabels[q.type] ?? q.type} · {q.point} điểm
            </span>
          </div>
          {selectedIds.has(q.id) && (
            <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          )}
        </label>
      ))}
    </div>
  );
}

function QuizRow({
  quiz,
  selectedIds,
  onToggle,
}: {
  quiz: Quiz;
  selectedIds: Set<string>;
  onToggle: (q: Question) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {quiz.title}
          </p>
          <p className="text-xs text-gray-500">
            {quiz.subject && <span>{quiz.subject} · </span>}
            {quiz.total_questions} câu
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50">
          <QuizQuestionsPanel
            quiz={quiz}
            selectedIds={selectedIds}
            onToggle={onToggle}
          />
        </div>
      )}
    </div>
  );
}

export function ImportFromLibraryModal({
  open,
  onClose,
  onImport,
}: ImportFromLibraryModalProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<
    Map<string, Question>
  >(new Map());

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = usePublicQuizzes(
    { search: debouncedSearch || undefined, limit: 20 },
    { enabled: open }
  );

  const quizList = data?.data ?? [];
  const selectedIds = new Set(selectedQuestions.keys());

  const handleToggle = (q: Question) => {
    setSelectedQuestions((prev) => {
      const next = new Map(prev);
      if (next.has(q.id)) next.delete(q.id);
      else next.set(q.id, q);
      return next;
    });
  };

  const handleImport = () => {
    const uiQuestions = Array.from(selectedQuestions.values()).map(
      convertToUIQuestion
    );
    onImport(uiQuestions);
    handleClose();
  };

  const handleClose = () => {
    setSelectedQuestions(new Map());
    setSearch("");
    setDebouncedSearch("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Thêm câu hỏi từ Kho học liệu</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm đề thi trong kho..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : quizList.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-10">
              {debouncedSearch
                ? `Không tìm thấy kết quả cho "${debouncedSearch}"`
                : "Chưa có đề thi nào trong kho"}
            </p>
          ) : (
            quizList.map((quiz) => (
              <QuizRow
                key={quiz.id}
                quiz={quiz}
                selectedIds={selectedIds}
                onToggle={handleToggle}
              />
            ))
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 items-center">
          {selectedQuestions.size > 0 && (
            <span className="text-sm text-gray-600 mr-auto">
              Đã chọn{" "}
              <span className="font-semibold text-blue-600">
                {selectedQuestions.size}
              </span>{" "}
              câu hỏi
            </span>
          )}
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            disabled={selectedQuestions.size === 0}
            onClick={handleImport}
          >
            Thêm vào đề ({selectedQuestions.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
