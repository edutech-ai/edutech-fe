"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/molecules/classroom/StatCard";
import {
  ScoreDataTable,
  LeaderboardCard,
  StudentScorePanel,
  AddScoreModal,
  EditScoreModal,
} from "@/components/organisms/classroom";
import {
  useClassroomScores,
  useStudentScores,
  useLeaderboard,
  useDeleteScore,
  useUpdateTeacherNotes,
  useRecalculateAllPerformance,
} from "@/services/performanceService";
import { useStudentPerformance } from "@/services/classroomService";
import type { ScoreBackend, StudentBackend } from "@/types/classroom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Award, TrendingUp, Users, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PerformanceTabProps {
  classroomId: string;
  students: StudentBackend[];
}

export function PerformanceTab({ classroomId, students }: PerformanceTabProps) {
  const [showAddScoreModal, setShowAddScoreModal] = useState(false);
  const [scoreToEdit, setScoreToEdit] = useState<ScoreBackend | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentBackend | null>(
    null
  );
  const [scoreToDelete, setScoreToDelete] = useState<ScoreBackend | null>(null);

  // Fetch data
  const {
    data: scoresData,
    isLoading: isLoadingScores,
    refetch: refetchScores,
  } = useClassroomScores(classroomId);
  const { data: leaderboardData, isLoading: isLoadingLeaderboard } =
    useLeaderboard(classroomId, { limit: 10 });

  // Selected student data
  const { data: studentScoresData, isLoading: isLoadingStudentScores } =
    useStudentScores(
      selectedStudent ? classroomId : undefined,
      selectedStudent?.id
    );
  const {
    data: studentPerformanceData,
    isLoading: isLoadingStudentPerformance,
  } = useStudentPerformance(
    selectedStudent ? classroomId : undefined,
    selectedStudent?.id
  );

  // Mutations
  const deleteScoreMutation = useDeleteScore();
  const updateNotesMutation = useUpdateTeacherNotes();
  const recalculateMutation = useRecalculateAllPerformance();

  const scores = Array.isArray(scoresData?.data?.scores)
    ? scoresData.data.scores
    : [];
  const leaderboard = Array.isArray(leaderboardData?.data)
    ? leaderboardData.data
    : [];
  // API returns { scores: [...], statistics: {...} }
  const studentScores = Array.isArray(studentScoresData?.data?.scores)
    ? studentScoresData.data.scores
    : [];
  const studentPerformance = studentPerformanceData?.data || null;

  // Calculate overview stats
  const stats = {
    totalScores: scores.length,
    averageScore:
      scores.length > 0
        ? scores.reduce((sum, s) => sum + (s.score / s.max_score) * 10, 0) /
          scores.length
        : 0,
    totalStudentsWithScores: new Set(scores.map((s) => s.student_id)).size,
    recentScoresCount: scores.filter((s) => {
      const scoreDate = new Date(s.exam_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return scoreDate >= weekAgo;
    }).length,
  };

  const handleScoreClick = useCallback(
    (score: ScoreBackend) => {
      const student = students.find((s) => s.id === score.student_id);
      if (student) {
        setSelectedStudent(student);
      }
    },
    [students]
  );

  const handleDeleteScore = async () => {
    if (!scoreToDelete) return;

    try {
      await deleteScoreMutation.mutateAsync({
        classroomId,
        scoreId: scoreToDelete.id,
      });
      toast.success("Đã xóa điểm thành công!");
      setScoreToDelete(null);
      refetchScores();
    } catch {
      toast.error("Không thể xóa điểm. Vui lòng thử lại!");
    }
  };

  const handleSaveNotes = async (notes: string) => {
    if (!selectedStudent) return;

    try {
      await updateNotesMutation.mutateAsync({
        classroomId,
        studentId: selectedStudent.id,
        data: { teacher_notes: notes },
      });
      toast.success("Đã lưu ghi chú!");
    } catch {
      toast.error("Không thể lưu ghi chú. Vui lòng thử lại!");
    }
  };

  const handleRecalculate = async () => {
    try {
      await recalculateMutation.mutateAsync(classroomId);
      toast.success("Đã tính lại hiệu suất cho tất cả học sinh!");
      refetchScores();
    } catch {
      toast.error("Không thể tính lại hiệu suất. Vui lòng thử lại!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Recalculate Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Tổng quan hiệu suất
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRecalculate}
          disabled={recalculateMutation.isPending}
          className="gap-2"
        >
          <RefreshCw
            className={cn(
              "h-4 w-4",
              recalculateMutation.isPending && "animate-spin"
            )}
          />
          {recalculateMutation.isPending
            ? "Đang tính..."
            : "Tính lại hiệu suất"}
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng số điểm"
          value={stats.totalScores}
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          title="Điểm trung bình"
          value={stats.averageScore.toFixed(1)}
          icon={<Award className="h-5 w-5" />}
          valueClassName={
            stats.averageScore >= 8
              ? "text-green-600"
              : stats.averageScore >= 6.5
                ? "text-blue-600"
                : "text-orange-600"
          }
        />
        <StatCard
          title="Học sinh có điểm"
          value={`${stats.totalStudentsWithScores}/${students.length}`}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Số bài thi của tuần"
          value={stats.recentScoresCount}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Score Table */}
        <div
          className={cn("lg:col-span-2", !selectedStudent && "lg:col-span-3")}
        >
          <ScoreDataTable
            scores={scores}
            isLoading={isLoadingScores}
            onAddScore={() => setShowAddScoreModal(true)}
            onEditScore={setScoreToEdit}
            onScoreClick={handleScoreClick}
            onDeleteScore={setScoreToDelete}
          />
        </div>

        {/* Student Score Panel or Leaderboard */}
        {selectedStudent ? (
          <div className="lg:col-span-1">
            <StudentScorePanel
              student={selectedStudent}
              scores={studentScores}
              performance={studentPerformance}
              isLoadingScores={isLoadingStudentScores}
              isLoadingPerformance={isLoadingStudentPerformance}
              isSavingNotes={updateNotesMutation.isPending}
              onClose={() => setSelectedStudent(null)}
              onSaveNotes={handleSaveNotes}
            />
          </div>
        ) : (
          <div className="lg:col-span-3">
            <LeaderboardCard
              entries={leaderboard}
              isLoading={isLoadingLeaderboard}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <AddScoreModal
        open={showAddScoreModal}
        onOpenChange={setShowAddScoreModal}
        classroomId={classroomId}
        students={students}
        onSuccess={() => refetchScores()}
      />

      <EditScoreModal
        open={!!scoreToEdit}
        onOpenChange={(open) => !open && setScoreToEdit(null)}
        classroomId={classroomId}
        score={scoreToEdit}
        onSuccess={() => refetchScores()}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!scoreToDelete}
        onOpenChange={(open) => !open && setScoreToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa điểm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa điểm này? Hành động này không thể hoàn
              tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteScore}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
