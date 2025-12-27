"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StudentInitials } from "@/components/atoms/StudentInitials";
import type { StudentDetail } from "@/types/classroom";
import { X, TrendingUp, Calendar, FileText, Check } from "lucide-react";

export interface StudentDetailPanelProps {
  student: StudentDetail | null;
  onClose: () => void;
  onSaveNote?: (note: string) => void;
  className?: string;
}

export function StudentDetailPanel({
  student,
  onClose,
  onSaveNote,
  className,
}: StudentDetailPanelProps) {
  const [newNote, setNewNote] = useState("");

  const handleSaveNote = () => {
    if (newNote.trim() && onSaveNote) {
      onSaveNote(newNote.trim());
      setNewNote("");
    }
  };

  if (!student) return null;

  return (
    <Card className={cn("bg-white shadow-lg", className)}>
      <CardHeader className="flex flex-row items-start justify-between pb-4 space-y-0">
        <div className="flex items-center gap-3">
          <StudentInitials name={student.name} size="lg" />
          <div>
            <h3 className="font-semibold text-gray-800">{student.name}</h3>
            <p className="text-sm text-gray-500">
              {student.studentCode} |{" "}
              {student.classId.replace("class-", "Lớp ")}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="shrink-0"
        >
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Chart */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Tiến độ điểm theo thời gian
          </h4>
          <div className="flex items-end justify-between gap-2 rounded-lg bg-gray-50 p-4">
            {student.progressHistory.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div
                  className="w-12 rounded-t bg-blue-500 transition-all"
                  style={{ height: `${item.score * 12}px` }}
                />
                <span className="text-xs font-semibold text-gray-600">
                  {item.score.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Participation Logs */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar className="h-4 w-4 text-green-500" />
            Nhật ký tham gia
          </h4>
          <div className="space-y-2 rounded-lg bg-gray-50 p-3">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 px-2">
              <span>Buổi học</span>
              <span>Số lần phát biểu</span>
            </div>
            {student.participationLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded bg-white px-3 py-2"
              >
                <span className="text-sm text-gray-700">
                  Buổi {log.id.replace("log-", "")} - {log.sessionDate}
                </span>
                <span className="font-semibold text-blue-600">
                  {log.participationCount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Notes */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="h-4 w-4 text-orange-500" />
            Ghi chú của giáo viên
          </h4>
          {student.teacherNotes.length > 0 && (
            <div className="mb-3 space-y-2">
              {student.teacherNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg bg-yellow-50 p-3 text-sm text-gray-700"
                >
                  {note.content}
                </div>
              ))}
            </div>
          )}
          <div className="space-y-2">
            <Textarea
              placeholder="Thêm ghi chú về học sinh..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <Button
              onClick={handleSaveNote}
              disabled={!newNote.trim()}
              className="w-full gap-2"
              size="sm"
            >
              <Check className="h-4 w-4" />
              Lưu ghi chú
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
