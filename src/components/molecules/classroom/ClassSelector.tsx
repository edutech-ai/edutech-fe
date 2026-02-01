"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Classroom } from "@/types/classroom";

export interface ClassSelectorProps {
  classrooms: Classroom[];
  selectedClassId?: string;
  selectedSubject?: string;
  onClassChange: (classId: string) => void;
  onSubjectChange: (subject: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ClassSelector({
  classrooms,
  selectedClassId,
  selectedSubject,
  onClassChange,
  onSubjectChange,
  className,
  disabled = false,
}: ClassSelectorProps) {
  const selectedClass = classrooms.find((c) => c.id === selectedClassId);
  const availableSubjects = selectedClass?.subjects || [];

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Chọn lớp</label>
        <Select
          value={selectedClassId}
          onValueChange={onClassChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-40 bg-white">
            <SelectValue placeholder="Chọn lớp" />
          </SelectTrigger>
          <SelectContent>
            {classrooms.map((classroom) => (
              <SelectItem key={classroom.id} value={classroom.id}>
                {classroom.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Chọn môn học
        </label>
        <Select
          value={selectedSubject}
          onValueChange={onSubjectChange}
          disabled={disabled || !selectedClassId}
        >
          <SelectTrigger className="w-40 bg-white">
            <SelectValue placeholder="Chọn môn" />
          </SelectTrigger>
          <SelectContent>
            {availableSubjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
