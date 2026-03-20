"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LaTeXRenderer } from "@/components/atoms/latex-renderer";
import type { ConvertedQuestion } from "@/services/aiService";

const QUESTION_TYPE_LABELS: Record<string, string> = {
  MCQ: "Trắc nghiệm",
  MULTIPLE_ANSWER: "Nhiều đáp án",
  TRUE_FALSE: "Đúng/Sai",
  ESSAY: "Tự luận",
};

interface QuestionPreviewCardProps {
  question: ConvertedQuestion;
  index: number;
}

export function QuestionPreviewCard({
  question,
  index,
}: QuestionPreviewCardProps) {
  const [expanded, setExpanded] = useState(false);

  const options = question.options as
    | Array<{ id?: string; text?: string } | string>
    | undefined;

  // Pre-compute correct indices — covers text match, letter (A/B/C/D), and index match
  const correctIndices = new Set<number>();
  if (question.correct_answer && options) {
    const answers = Array.isArray(question.correct_answer)
      ? question.correct_answer
      : [question.correct_answer];
    options.forEach((opt, i) => {
      const optText = (typeof opt === "string" ? opt : (opt.text ?? "")).trim();
      const optLetter = String.fromCharCode(65 + i);
      answers.forEach((ans) => {
        if (!ans) return;
        const a = String(ans).trim();
        if (a === optText || a === optLetter || a === String(i)) {
          correctIndices.add(i);
        }
      });
    });
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center">
          {index + 1}
        </span>
        <LaTeXRenderer
          as="span"
          content={question.content}
          className="flex-1 text-sm text-gray-800 line-clamp-2"
        />
        <div className="shrink-0 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {QUESTION_TYPE_LABELS[question.type] ?? question.type}
          </Badge>
          <span className="text-xs text-gray-500">{question.point}đ</span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-gray-50 space-y-3">
          {options && options.length > 0 && (
            <div className="space-y-1.5">
              {options.map((opt, i) => {
                const optText =
                  typeof opt === "string" ? opt : (opt.text ?? "");
                const optId =
                  typeof opt === "string"
                    ? String.fromCharCode(65 + i)
                    : (opt.id ?? String.fromCharCode(65 + i));
                const isCorrect = correctIndices.has(i);
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-2 px-3 py-2 rounded-md text-sm ${
                      isCorrect
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-white border border-gray-200 text-gray-700"
                    }`}
                  >
                    <span className="font-semibold shrink-0">{optId}.</span>
                    <LaTeXRenderer as="span" content={optText} />
                    {isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {question.explanation && (
            <div className="bg-blue-50 border border-blue-100 rounded-md px-3 py-2 text-sm text-blue-800">
              <span className="font-semibold">Giải thích: </span>
              <LaTeXRenderer as="span" content={question.explanation!} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
