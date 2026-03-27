"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  FileText,
  CheckCircle2,
  Clock,
  BookOpen,
  GraduationCap,
  AlertCircle,
  Library,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AILoading } from "@/components/atoms/AILoading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SUBJECTS, GRADES } from "@/types";
import { toast } from "sonner";
import { ActionButton } from "@/components/molecules/action-button";
import {
  useConvertExam,
  type ConvertExamResponse,
  type ConvertedQuestion,
} from "@/services/aiService";
import { QuestionPreviewCard } from "@/components/features/quiz-upload/QuestionPreviewCard";
import { useDeleteQuiz } from "@/services/quizService";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

type Step = "form" | "loading" | "preview";

export default function UploadBasedGeneratorPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [result, setResult] = useState<ConvertExamResponse | null>(null);
  const [questions, setQuestions] = useState<ConvertedQuestion[]>([]);

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertMutation = useConvertExam();
  const deleteQuizMutation = useDeleteQuiz();

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    if (!validTypes.includes(f.type)) {
      toast.error("Chỉ hỗ trợ PDF, Word, JPG, PNG");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File quá lớn, tối đa 5MB");
      return;
    }
    setFile(f);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleConvert = async () => {
    if (!file) {
      toast.error("Vui lòng chọn file đề thi");
      return;
    }
    setStep("loading");
    try {
      const res = await convertMutation.mutateAsync({
        file,
        title: title.trim() || undefined,
        subject: subject || undefined,
        grade: grade ? parseInt(grade) : undefined,
      });

      // Fetch questions separately — quiz detail doesn't include them
      try {
        const qRes = await axiosInstance.get(
          `${API_ENDPOINTS.QUESTION.BY_QUIZ_ID(res.data.quiz.id)}?includeAnswers=true`
        );
        const qs = qRes.data?.data?.questions ?? qRes.data?.data ?? [];
        setQuestions(Array.isArray(qs) ? qs : []);
      } catch {
        setQuestions([]);
      }

      setResult(res);
      setStep("preview");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message || "Chuyển đổi thất bại. Vui lòng thử lại!"
      );
      setStep("form");
    }
  };

  const handleSave = () => {
    if (!result) return;
    router.push(`/dashboard/quiz/${result.data.quiz.id}/edit`);
  };

  const handleCancel = async () => {
    if (result?.data.quiz.id) {
      try {
        await deleteQuizMutation.mutateAsync(result.data.quiz.id);
      } catch {}
    }
    router.push("/dashboard/quiz");
  };

  if (step === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <AILoading
          message="AI đang phân tích và chuyển đổi đề thi..."
          submessage="Quá trình này có thể mất 15–30 giây"
        />
      </div>
    );
  }

  // ── Preview ──
  if (step === "preview" && result) {
    const { quiz, document: doc, conversionInfo } = result.data;

    return (
      <div className="flex flex-col space-y-4">
        <div className="mx-2">
          <ActionButton
            isBack
            label="Quay lại"
            onClick={() => setStep("form")}
          />
        </div>
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800">
          <Library className="w-4 h-4 shrink-0" />
          <span>
            File <strong>{doc.name}</strong> đã được lưu vào{" "}
            <strong>Thư viện tài liệu</strong> của bạn.
          </span>
        </div>

        {/* Quiz info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {quiz.title}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Đề thi đã được chuyển đổi và lưu tạm. Xem lại và bấm{" "}
                <strong>Lưu đề thi</strong> để tiếp tục chỉnh sửa.
              </p>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 bg-yellow-50 text-yellow-700 border-yellow-200"
            >
              Nháp
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quiz.subject && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Môn học</p>
                  <p className="text-sm font-medium text-gray-800">
                    {quiz.subject}
                  </p>
                </div>
              </div>
            )}
            {quiz.grade && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <GraduationCap className="w-4 h-4 text-purple-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Lớp</p>
                  <p className="text-sm font-medium text-gray-800">
                    {quiz.grade}
                  </p>
                </div>
              </div>
            )}
            {(conversionInfo.total_minutes || quiz.duration) && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Thời gian</p>
                  <p className="text-sm font-medium text-gray-800">
                    {conversionInfo.total_minutes || quiz.duration} phút
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <FileText className="w-4 h-4 text-green-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Câu hỏi</p>
                <p className="text-sm font-medium text-gray-800">
                  {questions.length} câu / {conversionInfo.total_score ?? "?"}{" "}
                  điểm
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions list */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">
              Danh sách câu hỏi ({questions.length})
            </h3>
            <p className="text-xs text-gray-500">
              Nhấn vào từng câu để xem chi tiết
            </p>
          </div>

          {questions.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Không trích xuất được câu hỏi nào. Vui lòng kiểm tra lại file.
            </div>
          ) : (
            <div className="space-y-2">
              {questions.map((q, i) => (
                <QuestionPreviewCard key={q.id ?? i} question={q} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={deleteQuizMutation.isPending}
          >
            {deleteQuizMutation.isPending ? "Đang hủy..." : "Hủy"}
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Lưu đề thi
          </Button>
        </div>
      </div>
    );
  }

  // ── Form ──
  return (
    <div className="flex flex-col space-y-4">
      <ActionButton isBack label="Quay lại" href="/dashboard/quiz" />

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Tải lên đề thi
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            AI sẽ đọc và chuyển đổi đề thi sang hệ thống. File sẽ tự động lưu
            vào thư viện tài liệu.
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <Label>
            File đề thi <span className="text-red-500">*</span>
          </Label>

          {file ? (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="shrink-0 w-9 h-9 bg-white rounded border border-green-200 flex items-center justify-center">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFile(null)}
                className="shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
              }`}
            >
              <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Kéo thả file vào đây hoặc{" "}
                <span className="text-blue-600">chọn file</span>
              </p>
              <p className="text-xs text-gray-400">
                PDF, Word, JPG, PNG — tối đa 5MB
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {/* Optional fields */}
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Các trường bên dưới không bắt buộc — AI sẽ tự phát hiện từ đề thi.
          </p>

          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề đề thi</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Để trống để AI tự đặt tên"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Môn học</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="AI tự phát hiện" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Lớp</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger id="grade">
                  <SelectValue placeholder="AI tự phát hiện" />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g.toString()}>
                      Lớp {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/quiz")}
          >
            Hủy
          </Button>
          <Button onClick={handleConvert} disabled={!file}>
            <Upload className="w-4 h-4 mr-2" />
            Chuyển đổi đề thi
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 space-y-1">
        <p className="font-semibold">Lưu ý</p>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>File được lưu vào thư viện tài liệu ngay khi chuyển đổi</li>
          <li>AI tự động phát hiện môn học, lớp, thời gian từ nội dung đề</li>
          <li>Sau khi xem trước, bạn có thể chỉnh sửa trước khi lưu</li>
        </ul>
      </div>
    </div>
  );
}
