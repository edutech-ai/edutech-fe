"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AttendanceStatus } from "@/types/classroom";

export interface AttendanceBadgeProps {
  status: AttendanceStatus;
  size?: "sm" | "md";
  className?: string;
}

const statusConfig = {
  [AttendanceStatus.PRESENT]: {
    label: "Có mặt",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  [AttendanceStatus.ABSENT]: {
    label: "Vắng",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  [AttendanceStatus.LATE]: {
    label: "Đi muộn",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
};

export function AttendanceBadge({
  status,
  size = "md",
  className,
}: AttendanceBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        config.bgColor,
        config.textColor,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        className
      )}
    >
      {config.label}
    </span>
  );
}
