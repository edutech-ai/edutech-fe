"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentInitials } from "@/components/atoms/StudentInitials";
import { ScoreBadge } from "@/components/atoms/ScoreBadge";
import type { LeaderboardEntry } from "@/types/classroom";
import { Trophy, Medal, Award } from "lucide-react";

export interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
  maxItems?: number;
  className?: string;
}

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) {
    return <Trophy className="h-5 w-5 text-yellow-500" />;
  }
  if (rank === 2) {
    return <Medal className="h-5 w-5 text-gray-400" />;
  }
  if (rank === 3) {
    return <Award className="h-5 w-5 text-amber-600" />;
  }
  return (
    <span className="flex h-5 w-5 items-center justify-center text-sm font-medium text-gray-500">
      {rank}
    </span>
  );
};

const RankBadge = ({ rank }: { rank: number }) => {
  const bgColors: Record<number, string> = {
    1: "bg-yellow-100 border-yellow-300",
    2: "bg-gray-100 border-gray-300",
    3: "bg-amber-100 border-amber-300",
  };

  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border-2",
        bgColors[rank] || "bg-white border-gray-200"
      )}
    >
      <RankIcon rank={rank} />
    </div>
  );
};

export function LeaderboardCard({
  entries,
  isLoading,
  maxItems = 10,
  className,
}: LeaderboardCardProps) {
  const displayedEntries = entries.slice(0, maxItems);

  return (
    <Card className={cn("bg-white", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Bảng xếp hạng
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-gray-400">Đang tải...</span>
          </div>
        ) : displayedEntries.length > 0 ? (
          <div className="divide-y">
            {displayedEntries.map((entry, index) => (
              <div
                key={entry.student_id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50",
                  index < 3 && "bg-linear-to-r from-yellow-50/50 to-transparent"
                )}
              >
                <RankBadge rank={index + 1} />
                <StudentInitials name={entry.full_name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {entry.full_name}
                  </p>
                  {entry.student_code && (
                    <p className="text-xs text-gray-500">
                      {entry.student_code}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <ScoreBadge score={entry.average_score} size="sm" />
                  <p className="mt-0.5 text-xs text-gray-500">
                    {entry.total_exams} bài
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <span className="text-gray-400">Chưa có dữ liệu</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
