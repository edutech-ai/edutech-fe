"use client";

import { cn } from "@/lib/utils";

export interface ScoreBadgeProps {
  score: number | null | undefined;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
  showMax?: boolean;
  className?: string;
}

export function ScoreBadge({
  score,
  maxScore = 10,
  size = "md",
  showMax = false,
  className,
}: ScoreBadgeProps) {
  // Handle null/undefined score
  if (score === null || score === undefined) {
    return (
      <span
        className={cn(
          "inline-flex items-center font-semibold rounded-md border bg-gray-100 text-gray-500 border-gray-200",
          size === "sm" && "text-xs px-1.5 py-0.5",
          size === "md" && "text-sm px-2 py-1",
          size === "lg" && "text-base px-3 py-1.5",
          className
        )}
      >
        -
      </span>
    );
  }

  const percentage = (score / maxScore) * 100;

  const getColorClass = () => {
    if (percentage >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (percentage >= 65) return "bg-blue-100 text-blue-700 border-blue-200";
    if (percentage >= 50)
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-md border",
        getColorClass(),
        sizeClasses[size],
        className
      )}
    >
      {score.toFixed(1)}
      {showMax && <span className="font-normal opacity-70">/{maxScore}</span>}
    </span>
  );
}
