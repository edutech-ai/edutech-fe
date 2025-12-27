"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface StudentInitialsProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showBorder?: boolean;
  borderColor?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

const colors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-cyan-500",
];

export function StudentInitials({
  name,
  size = "md",
  className,
  showBorder = false,
  borderColor = "border-white",
}: StudentInitialsProps) {
  // Get first letter of last word (Vietnamese naming convention)
  const nameParts = name.trim().split(" ");
  const initial = nameParts[nameParts.length - 1]?.[0]?.toUpperCase() || "?";

  // Consistent color based on name
  const colorIndex = name.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white font-semibold",
        sizeClasses[size],
        bgColor,
        showBorder && `border-2 ${borderColor}`,
        className
      )}
    >
      {initial}
    </div>
  );
}
