"use client";

import { useState, useRef } from "react";
import { Loader2, Upload, FileSpreadsheet, X } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  useUploadScores,
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
  const [activeTab, setActiveTab] = useState<"manual" | "upload">("manual");

  // --- Manual tab state ---
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

  // --- Upload tab state ---
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSubject, setUploadSubject] = useState("");
  const [uploadExamName, setUploadExamName] = useState("");
  const [uploadExamType, setUploadExamType] = useState<ExamType>("test");
  const [uploadMaxScore, setUploadMaxScore] = useState("10");
  const [uploadExamDate, setUploadExamDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createScoreMutation = useCreateScore();
  const recalculateMutation = useRecalculateStudentPerformance();
  const uploadScoresMutation = useUploadScores();

  const resetManual = () => {
    setStudentId("");
    setScore("");
    setMaxScore("10");
    setSubject("");
    setExamName("");
    setExamType("test");
    setExamDate(new Date().toISOString().split("T")[0]);
    setNotes("");
  };

  const resetUpload = () => {
    setUploadFile(null);
    setUploadSubject("");
    setUploadExamName("");
    setUploadExamType("test");
    setUploadMaxScore("10");
    setUploadExamDate(new Date().toISOString().split("T")[0]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    resetManual();
    resetUpload();
    setActiveTab("manual");
    onOpenChange(false);
  };

  // --- Manual submit ---
  const handleManualSubmit = async () => {
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

      try {
        await recalculateMutation.mutateAsync({ classroomId, studentId });
      } catch {
        // Ignore recalculate errors
      }

      toast.success("Đã thêm điểm thành công!");
      resetManual();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message || "Không thể thêm điểm. Vui lòng thử lại!"
      );
    }
  };

  // --- Upload submit ---
  const handleUploadSubmit = async () => {
    if (!uploadFile) {
      toast.error("Vui lòng chọn file XLSX");
      return;
    }
    if (!uploadSubject.trim()) {
      toast.error("Vui lòng nhập môn học");
      return;
    }
    if (!uploadExamName.trim()) {
      toast.error("Vui lòng nhập tên bài kiểm tra");
      return;
    }

    try {
      const result = await uploadScoresMutation.mutateAsync({
        classroomId,
        file: uploadFile,
        subject: uploadSubject.trim(),
        exam_name: uploadExamName.trim(),
        exam_type: uploadExamType,
        max_score: Number(uploadMaxScore) || 10,
        exam_date: uploadExamDate || undefined,
      });

      const imported = result?.data?.imported ?? 0;
      const failed = result?.data?.failed ?? 0;
      if (failed > 0) {
        toast.warning(`Đã import ${imported} điểm, ${failed} dòng bị lỗi.`);
      } else {
        toast.success(`Đã import thành công ${imported} điểm!`);
      }

      resetUpload();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message || "Upload thất bại. Vui lòng thử lại!"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Thêm điểm học sinh</DialogTitle>
          <DialogDescription>
            Nhập điểm thủ công hoặc upload file XLSX hàng loạt
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "manual" | "upload")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Thêm thủ công</TabsTrigger>
            <TabsTrigger value="upload">Upload XLSX</TabsTrigger>
          </TabsList>

          {/* ── Tab 1: Manual ── */}
          <TabsContent value="manual" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
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
                <Label>
                  Điểm <span className="text-red-500">*</span>
                </Label>
                <Input
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
                <Label>Thang điểm</Label>
                <Input
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
                <Label>Loại bài</Label>
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
                <Label>
                  Ngày kiểm tra <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tên bài kiểm tra</Label>
              <Input
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Kiểm tra 15 phút - Chương 1"
              />
            </div>

            <div className="space-y-2">
              <Label>Môn học</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Toán"
              />
            </div>

            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú về bài kiểm tra..."
                rows={2}
              />
            </div>
          </TabsContent>

          {/* ── Tab 2: Upload XLSX ── */}
          <TabsContent value="upload" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                File XLSX <span className="text-red-500">*</span>
              </Label>
              {uploadFile ? (
                <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2">
                  <FileSpreadsheet className="h-4 w-4 shrink-0 text-green-600" />
                  <span className="flex-1 truncate text-sm text-green-700">
                    {uploadFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500 transition-colors hover:border-blue-300 hover:bg-blue-50/40 hover:text-blue-600"
                >
                  <Upload className="h-6 w-6" />
                  <span>Nhấn để chọn file .xlsx</span>
                  <span className="text-xs text-gray-400">
                    Cột bắt buộc: student_code, student_name, score
                  </span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Môn học <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value)}
                  placeholder="Toán"
                />
              </div>
              <div className="space-y-2">
                <Label>Thang điểm</Label>
                <Input
                  type="number"
                  min="1"
                  value={uploadMaxScore}
                  onChange={(e) => setUploadMaxScore(e.target.value)}
                  placeholder="10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Tên bài kiểm tra <span className="text-red-500">*</span>
              </Label>
              <Input
                value={uploadExamName}
                onChange={(e) => setUploadExamName(e.target.value)}
                placeholder="Kiểm tra 15 phút - Chương 1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Loại bài <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={uploadExamType}
                  onValueChange={(v) => setUploadExamType(v as ExamType)}
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
                <Label>Ngày kiểm tra</Label>
                <Input
                  type="date"
                  value={uploadExamDate}
                  onChange={(e) => setUploadExamDate(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          {activeTab === "manual" ? (
            <Button
              onClick={handleManualSubmit}
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
          ) : (
            <Button
              onClick={handleUploadSubmit}
              disabled={uploadScoresMutation.isPending}
            >
              {uploadScoresMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang upload...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload điểm
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
