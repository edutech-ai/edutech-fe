"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentSeat } from "@/components/molecules/classroom/StudentSeat";
import type {
  SeatingChart as SeatingChartType,
  Student,
} from "@/types/classroom";
import { BookOpen } from "lucide-react";

export interface SeatingChartProps {
  seatingChart: SeatingChartType | null;
  selectedStudent?: Student | null;
  onStudentClick?: (student: Student) => void;
  className?: string;
  title?: string;
}

export function SeatingChart({
  seatingChart,
  selectedStudent,
  onStudentClick,
  className,
  title = "Chọn lớp học",
}: SeatingChartProps) {
  if (!seatingChart) {
    return (
      <Card className={cn("bg-white", className)}>
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5" />
            {title} - Chọn môn học
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="rounded-full bg-gray-100 p-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <p className="mt-4 text-gray-500">
            Vui lòng chọn lớp học để hiển thị sơ đồ chỗ ngồi
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-white", className)}>
      <CardHeader className="bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {seatingChart.seats.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-2">
              <div className="w-16 shrink-0 text-sm font-medium text-gray-500">
                Hàng {rowIndex + 1}
              </div>
              <div className="flex flex-wrap gap-2">
                {row.map((seat, colIndex) => (
                  <StudentSeat
                    key={`${rowIndex}-${colIndex}`}
                    seatData={seat}
                    onClick={onStudentClick}
                    isSelected={selectedStudent?.id === seat.student?.id}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
