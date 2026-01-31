"use client";

import { useState, useEffect } from "react";
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
  useUpdateScore,
  useRecalculateStudentPerformance,
} from "@/services/performanceService";
import type { ScoreBackend, ExamType } from "@/types/classroom";
import { toast } from "sonner";

interface EditScoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroomId: string;
  score: ScoreBackend | null;
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

export function EditScoreModal({
  open,
  onOpenChange,
  classroomId,
  score,
  onSuccess,
}: EditScoreModalProps) {
  const [scoreValue, setScoreValue] = useState("");
  const [maxScore, setMaxScore] = useState("10");
  const [subject, setSubject] = useState("");
  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState<ExamType>("test");
  const [examDate, setExamDate] = useState("");
  const [notes, setNotes] = useState("");

  const updateScoreMutation = useUpdateScore();
  const recalculateMutation = useRecalculateStudentPerformance();

  // Populate form when score changes
  useEffect(() => {
    if (score) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScoreValue(score.score.toString());
      setMaxScore(score.max_score.toString());
      setSubject(score.subject || "");
      setExamName(score.exam_name || "");
      setExamType(score.exam_type);
      setExamDate(score.exam_date.split("T")[0]);
      setNotes(score.notes || "");
    }
  }, [score]);

  const handleSubmit = async () => {
    if (!score) return;

    if (!scoreValue || isNaN(Number(scoreValue))) {
      toast.error("Vui lòng nhập điểm hợp lệ");
      return;
    }
    if (!examDate) {
      toast.error("Vui lòng chọn ngày kiểm tra");
      return;
    }

    const scoreNum = Number(scoreValue);
    const maxScoreNum = Number(maxScore) || 10;

    if (scoreNum < 0 || scoreNum > maxScoreNum) {
      toast.error(`Điểm phải từ 0 đến ${maxScoreNum}`);
      return;
    }

    try {
      await updateScoreMutation.mutateAsync({
        classroomId,
        scoreId: score.id,
        data: {
          score: scoreNum,
          max_score: maxScoreNum,
          subject: subject.trim() || undefined,
          exam_name: examName.trim() || undefined,
          exam_type: examType,
          exam_date: examDate,
          notes: notes.trim() || undefined,
        },
      });

      // Recalculate student performance after updating score
      try {
        await recalculateMutation.mutateAsync({
          classroomId,
          studentId: score.student_id,
        });
      } catch {
        // Ignore recalculate errors - score was still updated
      }

      toast.success("Đã cập nhật điểm thành công!");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err?.response?.data?.message ||
        "Không thể cập nhật điểm. Vui lòng thử lại!";
      toast.error(message);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!score) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Sửa điểm</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin điểm cho{" "}
            <span className="font-medium">
              {score.student?.full_name || "học sinh"}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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
                value={scoreValue}
                onChange={(e) => setScoreValue(e.target.value)}
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
            disabled={updateScoreMutation.isPending}
          >
            {updateScoreMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Cập nhật"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
