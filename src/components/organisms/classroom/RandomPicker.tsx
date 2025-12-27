"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { RandomResultCard } from "@/components/molecules/classroom/RandomResultCard";
import { RandomHistoryItem } from "@/components/molecules/classroom/RandomHistoryItem";
import type { Classroom, Student, RandomHistory } from "@/types/classroom";
import { Users } from "lucide-react";

export interface RandomPickerProps {
  classrooms: Classroom[];
  randomHistory: RandomHistory[];
  onRandomSelect: (
    classId: string,
    count: number,
    onlyPresent: boolean
  ) => Student[];
  onAddHistory: (history: RandomHistory) => void;
  getPresentCount: (classId: string) => number;
  className?: string;
}

export function RandomPicker({
  classrooms,
  randomHistory,
  onRandomSelect,
  onAddHistory,
  getPresentCount,
  className,
}: RandomPickerProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [onlyPresent, setOnlyPresent] = useState(true);
  const [studentCount, setStudentCount] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedClass = classrooms.find((c) => c.id === selectedClassId);
  const presentCount = selectedClassId ? getPresentCount(selectedClassId) : 0;

  const handleRandom = () => {
    if (!selectedClassId || !selectedClass) return;

    setIsLoading(true);

    // Simulate loading
    setTimeout(() => {
      const students = onRandomSelect(
        selectedClassId,
        studentCount,
        onlyPresent
      );
      setSelectedStudents(students);

      if (students.length > 0) {
        const history: RandomHistory = {
          id: `random-${Date.now()}`,
          classId: selectedClassId,
          className: selectedClass.name,
          timestamp: new Date().toISOString(),
          selectedStudents: students.map((s) => ({
            id: s.id,
            name: s.name,
            studentCode: s.studentCode,
          })),
        };
        onAddHistory(history);
      }

      setIsLoading(false);
    }, 500);
  };

  const handleRandomAgain = () => {
    handleRandom();
  };

  return (
    <div className={cn("grid gap-6 lg:grid-cols-3", className)}>
      {/* Left Panel - Controls */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Chọn Ngẫu Nhiên Học Sinh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Class Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Chọn lớp
            </label>
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger className="w-full">
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

          {/* Only Present Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="only-present"
              checked={onlyPresent}
              onCheckedChange={(checked) => setOnlyPresent(checked as boolean)}
            />
            <label
              htmlFor="only-present"
              className="text-sm font-medium text-gray-700"
            >
              Chỉ học sinh có mặt
            </label>
          </div>

          {/* Student Count Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Kích thước nhóm:
              </label>
              <span className="text-sm font-semibold text-blue-600">
                {studentCount} học sinh
              </span>
            </div>
            <Slider
              value={[studentCount]}
              onValueChange={(value) => setStudentCount(value[0])}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>

          {/* Random Button */}
          <Button
            onClick={handleRandom}
            disabled={!selectedClassId || isLoading}
            className="w-full gap-2"
          >
            <Users className="h-4 w-4" />
            Random {studentCount} học sinh
          </Button>

          {/* Present Count */}
          <p className="text-sm text-gray-500">
            Số học sinh hiện có:{" "}
            <span className="font-medium">{presentCount}</span>{" "}
            <span className="text-gray-400">(đang có mặt)</span>
          </p>
        </CardContent>
      </Card>

      {/* Center Panel - Result */}
      <RandomResultCard
        selectedStudents={selectedStudents}
        onRandomAgain={handleRandomAgain}
        isLoading={isLoading}
      />

      {/* Right Panel - History */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Lịch sử random gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          {randomHistory.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {randomHistory.map((history) => (
                <RandomHistoryItem key={history.id} history={history} />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-400 py-8">
              Chưa có lịch sử random.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
