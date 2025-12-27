"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnswerOptionProps {
  label: string;
  content: string;
  isCorrect?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  showFeedback?: boolean;
  className?: string;
}

export function AnswerOption({
  label,
  content,
  isCorrect = false,
  isSelected = false,
  onClick,
  disabled = false,
  showFeedback = false,
  className,
}: AnswerOptionProps) {
  const getStyles = () => {
    if (showFeedback) {
      if (isCorrect) {
        return "border-green-500 bg-green-50 text-green-900";
      }
      if (isSelected && !isCorrect) {
        return "border-red-500 bg-red-50 text-red-900";
      }
    }
    if (isSelected) {
      return "border-blue-500 bg-blue-50 text-blue-900";
    }
    return "border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50";
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full text-left px-4 py-3 rounded-lg border-2 transition-all",
        "flex items-start gap-3",
        getStyles(),
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && !showFeedback && "cursor-pointer",
        className
      )}
    >
      {/* Label (A, B, C, D) */}
      <div
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-semibold text-sm",
          showFeedback && isCorrect && "bg-green-500 text-white",
          showFeedback && isSelected && !isCorrect && "bg-red-500 text-white",
          isSelected && !showFeedback && "bg-blue-500 text-white",
          !isSelected && !showFeedback && "bg-gray-200 text-gray-700"
        )}
      >
        {label}
      </div>

      {/* Content */}
      <div className="flex-1 pt-0.5">
        <p className="text-sm">{content}</p>
      </div>

      {/* Feedback Icon */}
      {showFeedback && (
        <div className="flex-shrink-0">
          {isCorrect ? (
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          ) : isSelected ? (
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </div>
          ) : null}
        </div>
      )}
    </button>
  );
}
