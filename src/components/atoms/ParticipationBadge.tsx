"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ParticipationStatus } from "@/types/classroom";

export interface ParticipationBadgeProps {
  status: ParticipationStatus;
  size?: "sm" | "md";
  className?: string;
}

const statusConfig = {
  [ParticipationStatus.NOT_PARTICIPATED]: {
    label: "Chưa tham gia",
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
    dotColor: "bg-gray-400",
  },
  [ParticipationStatus.RAISED_HAND]: {
    label: "Giơ tay",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    dotColor: "bg-yellow-500",
  },
  [ParticipationStatus.CALLED]: {
    label: "Được gọi",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
  },
  [ParticipationStatus.ANSWERED]: {
    label: "Đã trả lời",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    dotColor: "bg-green-500",
  },
};

export function ParticipationBadge({
  status,
  size = "md",
  className,
}: ParticipationBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        config.bgColor,
        config.textColor,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <span
        className={cn(
          "rounded-full",
          config.dotColor,
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"
        )}
      />
      {config.label}
    </span>
  );
}
