"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateScore,
  useRecalculateStudentPerformance,
} from "@/services/performanceService";
import type { ExamType, StudentBackend } from "@/types/classroom";
import { toast } from "sonner";

interface AddScoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroomId: string;
  students: StudentBackend[];
  onSuccess?: () => void;
}

const EXAM_TYPES: { value: ExamType; label: string }[] = [
  { value: "quiz", label: "Quiz" },
  { value: "test", label: "Kiểm tra" },
  { value: "midterm", label: "Giữa kỳ" },
  { value: "final", label: "Cuối kỳ" },
  { value: "assignment", label: "Bài tập" },
  { value: "other", label: "Khác" },
];

export function AddScoreModal({
  open,
  onOpenChange,
  classroomId,
  students,
  onSuccess,
}: AddScoreModalProps) {
  const [studentId, setStudentId] = useState("");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("10");
  const [subject, setSubject] = useState("");
  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState<ExamType>("test");
  const [examDate, setExamDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");

  const createScoreMutation = useCreateScore();
  const recalculateMutation = useRecalculateStudentPerformance();

  const resetForm = () => {
    setStudentId("");
    setScore("");
    setMaxScore("10");
    setSubject("");
    setExamName("");
    setExamType("test");
    setExamDate(new Date().toISOString().split("T")[0]);
    setNotes("");
  };

  const handleSubmit = async () => {
    if (!studentId) {
      toast.error("Vui lòng chọn học sinh");
      return;
    }
    if (!score || isNaN(Number(score))) {
      toast.error("Vui lòng nhập điểm hợp lệ");
      return;
    }
    if (!examDate) {
      toast.error("Vui lòng chọn ngày kiểm tra");
      return;
    }

    const scoreValue = Number(score);
    const maxScoreValue = Number(maxScore) || 10;

    if (scoreValue < 0 || scoreValue > maxScoreValue) {
      toast.error(`Điểm phải từ 0 đến ${maxScoreValue}`);
      return;
    }

    try {
      await createScoreMutation.mutateAsync({
        classroomId,
        data: {
          student_id: studentId,
          score: scoreValue,
          max_score: maxScoreValue,
          subject: subject.trim() || undefined,
          exam_name: examName.trim() || undefined,
          exam_type: examType,
          exam_date: examDate,
          notes: notes.trim() || undefined,
        },
      });

      // Recalculate student performance after adding score
      try {
        await recalculateMutation.mutateAsync({
          classroomId,
          studentId,
        });
      } catch {
        // Ignore recalculate errors - score was still added
      }

      toast.success("Đã thêm điểm thành công!");
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err?.response?.data?.message ||
        "Không thể thêm điểm. Vui lòng thử lại!";
      toast.error(message);
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Thêm điểm học sinh</DialogTitle>
          <DialogDescription>
            Nhập thông tin điểm số cho học sinh
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="student">
              Học sinh <span className="text-red-500">*</span>
            </Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn học sinh" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.full_name}{" "}
                    {student.student_code && `(${student.student_code})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score">
                Điểm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="score"
                type="number"
                step="0.1"
                min="0"
                max={maxScore}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="8.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxScore">Thang điểm</Label>
              <Input
                id="maxScore"
                type="number"
                min="1"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                placeholder="10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="examType">Loại bài</Label>
              <Select
                value={examType}
                onValueChange={(v) => setExamType(v as ExamType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXAM_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="examDate">
                Ngày kiểm tra <span className="text-red-500">*</span>
              </Label>
              <Input
                id="examDate"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="examName">Tên bài kiểm tra</Label>
            <Input
              id="examName"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="Kiểm tra 15 phút - Chương 1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Môn học</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Toán"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú về bài kiểm tra..."
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createScoreMutation.isPending}
          >
            {createScoreMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Thêm điểm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
