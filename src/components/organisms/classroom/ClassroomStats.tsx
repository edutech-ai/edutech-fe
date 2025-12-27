"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentInitials } from "@/components/atoms/StudentInitials";
import { Progress } from "@/components/ui/progress";
import type { ClassroomStats as ClassroomStatsType } from "@/types/classroom";
import { Hand, TrendingUp, BarChart3 } from "lucide-react";

export interface ClassroomStatsProps {
  stats: ClassroomStatsType | null;
  className?: string;
}

export function ClassroomStats({ stats, className }: ClassroomStatsProps) {
  return (
    <Card className={cn("bg-white", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Thống kê lớp học
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top học sinh tích cực */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Top học sinh tích cực
          </h4>
          {stats && stats.topActiveStudents.length > 0 ? (
            <div className="space-y-2">
              {stats.topActiveStudents.slice(0, 5).map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center gap-2 rounded-lg bg-gray-50 p-2"
                >
                  <span className="w-5 text-center text-sm font-semibold text-gray-500">
                    {index + 1}
                  </span>
                  <StudentInitials name={student.name} size="sm" />
                  <span className="flex-1 truncate text-sm text-gray-700">
                    {student.name}
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {student.participationCount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Chưa có dữ liệu</p>
          )}
        </div>

        {/* Tổng lượt giơ tay */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <Hand className="h-4 w-4 text-yellow-500" />
            Tổng lượt giơ tay
          </h4>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.totalRaisedHands || 0}
          </p>
        </div>

        {/* Phân bố theo hàng */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <BarChart3 className="h-4 w-4 text-green-500" />
            Phân bố theo hàng
          </h4>
          {stats && stats.participationByRow.length > 0 ? (
            <div className="space-y-3">
              {stats.participationByRow.map((row) => (
                <div key={row.row} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Hàng {row.row}</span>
                    <span className="font-medium text-gray-700">
                      {row.count} ({row.percentage}%)
                    </span>
                  </div>
                  <Progress value={row.percentage} className="h-2" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Chưa có dữ liệu</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
