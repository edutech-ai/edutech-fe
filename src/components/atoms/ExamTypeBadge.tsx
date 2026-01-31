"use client";

import { cn } from "@/lib/utils";
import type { ExamType } from "@/types/classroom";

export interface ExamTypeBadgeProps {
  type: ExamType;
  className?: string;
}

const EXAM_TYPE_CONFIG: Record<ExamType, { label: string; className: string }> =
  {
    quiz: {
      label: "Quiz",
      className: "bg-purple-100 text-purple-700 border-purple-200",
    },
    test: {
      label: "Kiểm tra",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
    midterm: {
      label: "Giữa kỳ",
      className: "bg-orange-100 text-orange-700 border-orange-200",
    },
    final: {
      label: "Cuối kỳ",
      className: "bg-red-100 text-red-700 border-red-200",
    },
    assignment: {
      label: "Bài tập",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    other: {
      label: "Khác",
      className: "bg-gray-100 text-gray-700 border-gray-200",
    },
  };

export function ExamTypeBadge({ type, className }: ExamTypeBadgeProps) {
  const config = EXAM_TYPE_CONFIG[type] || EXAM_TYPE_CONFIG.other;

  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export { EXAM_TYPE_CONFIG };
