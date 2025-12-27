"use client";

import * as React from "react";
import { Edit, Trash2, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Question {
  id: string;
  order: number;
  content: string;
  type: "multiple_choice" | "true_false" | "short_answer" | "essay";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  answers?: string[];
  correctAnswer?: string | number;
}

interface QuestionItemProps {
  question: Question;
  onEdit?: (questionId: string) => void;
  onDelete?: (questionId: string) => void;
  isDraggable?: boolean;
  className?: string;
}

const difficultyConfig = {
  easy: { label: "Dễ", color: "bg-green-100 text-green-700" },
  medium: { label: "Trung bình", color: "bg-yellow-100 text-yellow-700" },
  hard: { label: "Khó", color: "bg-red-100 text-red-700" },
};

const typeConfig = {
  multiple_choice: "Trắc nghiệm",
  true_false: "Đúng/Sai",
  short_answer: "Trả lời ngắn",
  essay: "Tự luận",
};

export function QuestionItem({
  question,
  onEdit,
  onDelete,
  isDraggable = false,
  className,
}: QuestionItemProps) {
  return (
    <div
      className={cn(
        "group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex gap-3">
        {/* Drag Handle */}
        {isDraggable && (
          <div className="flex items-start pt-1 cursor-grab active:cursor-grabbing">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>
        )}

        {/* Question Number */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
          {question.order}
        </div>

        {/* Question Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-base font-medium text-gray-900 flex-1">
              {question.content}
            </h4>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(question.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700"
                  onClick={() => onDelete(question.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="outline" className="text-xs">
              {typeConfig[question.type]}
            </Badge>
            <Badge
              className={cn(
                "text-xs",
                difficultyConfig[question.difficulty].color
              )}
            >
              {difficultyConfig[question.difficulty].label}
            </Badge>
            <span className="text-gray-500 text-xs">
              {question.points} điểm
            </span>
          </div>

          {/* Answers Preview (for MCQ) */}
          {question.type === "multiple_choice" && question.answers && (
            <div className="mt-3 space-y-1.5">
              {question.answers.map((answer, index) => (
                <div
                  key={index}
                  className={cn(
                    "text-sm px-3 py-1.5 rounded border",
                    index === question.correctAnswer
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  )}
                >
                  <span className="font-medium mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {answer}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
