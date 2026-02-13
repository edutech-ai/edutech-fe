"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StudentInitials } from "@/components/atoms/StudentInitials";
import { ScoreBadge } from "@/components/atoms/ScoreBadge";
import { ExamTypeBadge } from "@/components/atoms/ExamTypeBadge";
import type {
  ScoreBackend,
  StudentPerformanceBackend,
  StudentBackend,
} from "@/types/classroom";
import {
  X,
  TrendingUp,
  TrendingDown,
  FileText,
  Calendar,
  Save,
  Loader2,
  BookOpen,
  Award,
} from "lucide-react";

export interface StudentScorePanelProps {
  student: StudentBackend;
  scores: ScoreBackend[];
  performance?: StudentPerformanceBackend | null;
  isLoadingScores?: boolean;
  isLoadingPerformance?: boolean;
  isSavingNotes?: boolean;
  onClose: () => void;
  onSaveNotes?: (notes: string) => void;
  className?: string;
}

export function StudentScorePanel({
  student,
  scores,
  performance,
  isLoadingScores,
  isLoadingPerformance,
  isSavingNotes,
  onClose,
  onSaveNotes,
  className,
}: StudentScorePanelProps) {
  const [teacherNotes, setTeacherNotes] = useState(
    performance?.teacher_notes || ""
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveNotes = () => {
    onSaveNotes?.(teacherNotes);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculate stats from scores
  const stats = {
    totalExams: scores.length,
    averageScore:
      scores.length > 0
        ? scores.reduce((sum, s) => sum + (s.score / s.max_score) * 10, 0) /
          scores.length
        : 0,
    highestScore:
      scores.length > 0
        ? Math.max(...scores.map((s) => (s.score / s.max_score) * 10))
        : 0,
    lowestScore:
      scores.length > 0
        ? Math.min(...scores.map((s) => (s.score / s.max_score) * 10))
        : 0,
  };

  // Use performance data if available
  const displayStats = performance
    ? {
        totalExams: performance.total_exams,
        averageScore: performance.average_score,
        highestScore: stats.highestScore,
        lowestScore: stats.lowestScore,
      }
    : stats;

  return (
    <Card className={cn("bg-white sticky top-4", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <StudentInitials name={student.full_name} size="lg" />
            <div>
              <CardTitle className="text-lg">{student.full_name}</CardTitle>
              {student.student_code && (
                <p className="text-sm text-gray-500">{student.student_code}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-blue-50 p-3">
            <div className="flex items-center gap-2 text-blue-600">
              <Award className="h-4 w-4" />
              <span className="text-xs font-medium">Điểm TB</span>
            </div>
            <p className="mt-1 text-xl font-bold text-blue-700">
              {isLoadingPerformance ? (
                <span className="text-sm text-gray-400">...</span>
              ) : (
                displayStats.averageScore.toFixed(1)
              )}
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-3">
            <div className="flex items-center gap-2 text-green-600">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-medium">Số bài</span>
            </div>
            <p className="mt-1 text-xl font-bold text-green-700">
              {isLoadingPerformance ? (
                <span className="text-sm text-gray-400">...</span>
              ) : (
                displayStats.totalExams
              )}
            </p>
          </div>
          <div className="rounded-lg bg-purple-50 p-3">
            <div className="flex items-center gap-2 text-purple-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Cao nhất</span>
            </div>
            <p className="mt-1 text-xl font-bold text-purple-700">
              {isLoadingScores ? (
                <span className="text-sm text-gray-400">...</span>
              ) : scores.length > 0 ? (
                displayStats.highestScore.toFixed(1)
              ) : (
                "-"
              )}
            </p>
          </div>
          <div className="rounded-lg bg-orange-50 p-3">
            <div className="flex items-center gap-2 text-orange-600">
              <TrendingDown className="h-4 w-4" />
              <span className="text-xs font-medium">Thấp nhất</span>
            </div>
            <p className="mt-1 text-xl font-bold text-orange-700">
              {isLoadingScores ? (
                <span className="text-sm text-gray-400">...</span>
              ) : scores.length > 0 ? (
                displayStats.lowestScore.toFixed(1)
              ) : (
                "-"
              )}
            </p>
          </div>
        </div>

        {/* Recent Scores */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="h-4 w-4" />
            Lịch sử điểm
          </h4>
          {isLoadingScores ? (
            <div className="py-4 text-center text-sm text-gray-400">
              Đang tải...
            </div>
          ) : scores.length > 0 ? (
            <div className="max-h-50 space-y-2 overflow-y-auto">
              {scores.slice(0, 10).map((score) => (
                <div
                  key={score.id}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {score.exam_name || "Bài kiểm tra"}
                      </span>
                      <ExamTypeBadge type={score.exam_type} />
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(score.exam_date)}
                      {score.subject && <span>• {score.subject}</span>}
                    </div>
                  </div>
                  <ScoreBadge
                    score={score.score}
                    maxScore={score.max_score}
                    size="sm"
                    showMax
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-sm text-gray-400">
              Chưa có điểm nào
            </div>
          )}
        </div>

        {/* Teacher Notes */}
        {onSaveNotes && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">
              Ghi chú của giáo viên
            </h4>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  placeholder="Nhập ghi chú về học sinh..."
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTeacherNotes(performance?.teacher_notes || "");
                      setIsEditing(false);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                  >
                    {isSavingNotes ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-3 h-3 mr-1" />
                        Lưu
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="cursor-pointer rounded-lg border border-dashed p-3 text-sm text-gray-600 hover:bg-gray-50"
                onClick={() => setIsEditing(true)}
              >
                {teacherNotes || performance?.teacher_notes || (
                  <span className="text-gray-400">Nhấp để thêm ghi chú...</span>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
