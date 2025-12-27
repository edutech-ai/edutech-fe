"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { StudentInitials } from "@/components/atoms/StudentInitials";
import type { RandomHistory } from "@/types/classroom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export interface RandomHistoryItemProps {
  history: RandomHistory;
  className?: string;
}

export function RandomHistoryItem({
  history,
  className,
}: RandomHistoryItemProps) {
  const timeAgo = formatDistanceToNow(new Date(history.timestamp), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-100 bg-gray-50 p-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {history.className} - {history.selectedStudents.length} học sinh
        </span>
        <span className="text-xs text-gray-400">{timeAgo}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {history.selectedStudents.map((student) => (
          <div
            key={student.id}
            className="flex items-center gap-1.5 rounded-full bg-white px-2 py-1"
          >
            <StudentInitials name={student.name} size="sm" />
            <span className="text-xs text-gray-600">{student.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
