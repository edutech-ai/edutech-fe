"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StudentInitials } from "@/components/atoms/StudentInitials";
import { ScoreBadge } from "@/components/atoms/ScoreBadge";
import { ExamTypeBadge } from "@/components/atoms/ExamTypeBadge";
import {
  useStudentScores,
  useUpdateTeacherNotes,
} from "@/services/performanceService";
import { useStudentPerformance } from "@/services/classroomService";
import type { Student } from "@/types/classroom";
import {
  X,
  TrendingUp,
  FileText,
  Save,
  Loader2,
  Award,
  BookOpen,
  Calendar,
  Hand,
} from "lucide-react";
import { toast } from "sonner";

export interface StudentDetailPanelProps {
  student: Student | null;
  classroomId: string;
  onClose: () => void;
  className?: string;
}

export function StudentDetailPanel({
  student,
  classroomId,
  onClose,
  className,
}: StudentDetailPanelProps) {
  const [teacherNotes, setTeacherNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch real data
  const { data: scoresData, isLoading: isLoadingScores } = useStudentScores(
    student ? classroomId : undefined,
    student?.id
  );
  const { data: performanceData, isLoading: isLoadingPerformance } =
    useStudentPerformance(student ? classroomId : undefined, student?.id);

  const updateNotesMutation = useUpdateTeacherNotes();

  // API returns { scores: [...], statistics: {...} }
  const scores = Array.isArray(scoresData?.data?.scores)
    ? scoresData.data.scores
    : [];
  const performance = performanceData?.data || null;

  // Update teacherNotes when performance data changes
  useEffect(() => {
    if (performance?.teacher_notes) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTeacherNotes(performance.teacher_notes);
    } else {
      setTeacherNotes("");
    }
  }, [performance?.teacher_notes]);

  const handleSaveNotes = async () => {
    if (!student) return;

    try {
      await updateNotesMutation.mutateAsync({
        classroomId,
        studentId: student.id,
        data: { teacher_notes: teacherNotes },
      });
      toast.success("Đã lưu ghi chú!");
      setIsEditing(false);
    } catch {
      toast.error("Không thể lưu ghi chú. Vui lòng thử lại!");
    }
  };

  if (!student) return null;

  // Calculate stats
  const stats = {
    totalExams: performance?.total_exams || scores.length,
    averageScore:
      performance?.average_score ||
      (scores.length > 0
        ? scores.reduce((sum, s) => sum + (s.score / s.max_score) * 10, 0) /
          scores.length
        : 0),
    totalHandRaises: performance?.total_hand_raises || 0,
  };

  // Get recent scores for progress chart (last 6)
  const recentScores = [...(scores || [])]
    .sort(
      (a, b) =>
        new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
    )
    .slice(-6);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <Card className={cn("bg-white shadow-lg", className)}>
      <CardHeader className="flex flex-row items-start justify-between pb-4 space-y-0">
        <div className="flex items-center gap-3">
          <StudentInitials name={student.name} size="lg" />
          <div>
            <h3 className="font-semibold text-gray-800">{student.name}</h3>
            <p className="text-sm text-gray-500">{student.studentCode}</p>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-blue-50 p-3 text-center">
            <Award className="mx-auto h-4 w-4 text-blue-600" />
            <p className="mt-1 text-lg font-bold text-blue-700">
              {isLoadingPerformance ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                stats.averageScore.toFixed(1)
              )}
            </p>
            <p className="text-xs text-blue-600">Điểm TB</p>
          </div>
          <div className="rounded-lg bg-green-50 p-3 text-center">
            <BookOpen className="mx-auto h-4 w-4 text-green-600" />
            <p className="mt-1 text-lg font-bold text-green-700">
              {isLoadingPerformance ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                stats.totalExams
              )}
            </p>
            <p className="text-xs text-green-600">Số bài</p>
          </div>
          <div className="rounded-lg bg-purple-50 p-3 text-center">
            <Hand className="mx-auto h-4 w-4 text-purple-600" />
            <p className="mt-1 text-lg font-bold text-purple-700">
              {isLoadingPerformance ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                stats.totalHandRaises
              )}
            </p>
            <p className="text-xs text-purple-600">Giơ tay</p>
          </div>
        </div>

        {/* Progress Chart */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Tiến độ điểm gần đây
          </h4>
          {isLoadingScores ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : recentScores.length > 0 ? (
            <div className="flex items-end justify-between gap-2 rounded-lg bg-gray-50 p-4">
              {recentScores.map((score) => {
                const normalizedScore = (score.score / score.max_score) * 10;
                return (
                  <div
                    key={score.id}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className={cn(
                        "w-10 rounded-t-lg transition-all",
                        normalizedScore >= 8
                          ? "bg-green-500"
                          : normalizedScore >= 6.5
                            ? "bg-blue-500"
                            : normalizedScore >= 5
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      )}
                      style={{ height: `${normalizedScore * 10}px` }}
                    />
                    <span className="text-xs font-semibold text-gray-600">
                      {normalizedScore.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(score.exam_date)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-400">
              Chưa có điểm nào
            </div>
          )}
        </div>

        {/* Recent Scores List */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar className="h-4 w-4 text-green-500" />
            Lịch sử điểm
          </h4>
          {isLoadingScores ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : scores.length > 0 ? (
            <div className="max-h-37.5 space-y-2 overflow-y-auto rounded-lg bg-gray-50 p-3">
              {scores.slice(0, 5).map((score) => (
                <div
                  key={score.id}
                  className="flex items-center justify-between rounded bg-white px-3 py-2"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-700 truncate block">
                      {score.exam_name || "Bài kiểm tra"}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <ExamTypeBadge type={score.exam_type} />
                      <span className="text-xs text-gray-400">
                        {formatDate(score.exam_date)}
                      </span>
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
            <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-400">
              Chưa có điểm nào
            </div>
          )}
        </div>

        {/* Teacher Notes */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="h-4 w-4 text-orange-500" />
            Ghi chú của giáo viên
          </h4>
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                placeholder="Nhập ghi chú về học sinh..."
                value={teacherNotes}
                onChange={(e) => setTeacherNotes(e.target.value)}
                className="min-h-20 resize-none"
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
                  disabled={updateNotesMutation.isPending}
                >
                  {updateNotesMutation.isPending ? (
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
              {teacherNotes || (
                <span className="text-gray-400">Nhấp để thêm ghi chú...</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
