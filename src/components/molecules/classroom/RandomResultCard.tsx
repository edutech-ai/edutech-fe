"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentInitials } from "@/components/atoms/StudentInitials";
import type { Student } from "@/types/classroom";
import { Shuffle } from "lucide-react";

export interface RandomResultCardProps {
  selectedStudents: Student[];
  onRandomAgain?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function RandomResultCard({
  selectedStudents,
  onRandomAgain,
  isLoading = false,
  className,
}: RandomResultCardProps) {
  if (selectedStudents.length === 0) {
    return (
      <Card className={cn("bg-white", className)}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Shuffle className="h-12 w-12 text-gray-300" />
          <p className="mt-4 text-lg font-medium text-gray-500">
            Chưa có kết quả
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Chọn một lớp và nhấn nút random để bắt đầu.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-white", className)}>
      <CardContent className="p-6">
        <h3 className="mb-4 text-center text-lg font-semibold text-gray-700">
          Học sinh được chọn
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {selectedStudents.map((student) => (
            <div
              key={student.id}
              className="flex flex-col items-center gap-2 rounded-lg bg-blue-50 p-4"
            >
              <StudentInitials name={student.name} size="xl" />
              <span className="font-medium text-gray-800">{student.name}</span>
            </div>
          ))}
        </div>
        {onRandomAgain && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={onRandomAgain}
              disabled={isLoading}
              className="gap-2"
            >
              <Shuffle className="h-4 w-4" />
              Random lại
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
