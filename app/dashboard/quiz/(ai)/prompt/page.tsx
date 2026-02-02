"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AILoading } from "@/components/atoms/AILoading";
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
import { SUBJECTS, GRADES, Difficulty } from "@/types";
import { toast } from "sonner";
import { ActionButton } from "@/components/molecules/action-button";
import {
  useCreateQuizWithAI,
  type ValidationErrorData,
} from "@/services/aiService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

const difficultyOptions = [
  { value: Difficulty.RECOGNITION, label: "Dễ" },
  { value: Difficulty.COMPREHENSION, label: "Trung bình" },
  { value: Difficulty.HIGH_APPLICATION, label: "Khó" },
];

export default function PromptBasedGeneratorPage() {
  const router = useRouter();
  const createQuizWithAI = useCreateQuizWithAI();
  const isLoading = createQuizWithAI.isPending;

  // Form state
  const [subject, setSubject] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<string>("5");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    Difficulty.RECOGNITION
  );
  const [learningObjectives, setLearningObjectives] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [duration, setDuration] = useState<string>("45");
  const [validationError, setValidationError] =
    useState<ValidationErrorData | null>(null);

  const handleGenerate = async () => {
    // Validation
    if (!subject) {
      toast.error("Vui lòng chọn môn học");
      return;
    }
    if (!grade) {
      toast.error("Vui lòng chọn lớp");
      return;
    }
    if (!prompt.trim()) {
      toast.error("Vui lòng nhập chủ đề hoặc mô tả nội dung");
      return;
    }

    const count = parseInt(questionCount);
    if (count < 1 || count > 25) {
      toast.error("Chọn tối đa 25 câu hỏi để có trải nghiệm tốt nhất.");
      return;
    }

    const durationValue = parseInt(duration);
    if (durationValue < 1 || durationValue > 180) {
      toast.error("Thời gian làm bài phải từ 1 đến 180 phút.");
      return;
    }

    // Map difficulty from Vietnamese enum to API enum
    const difficultyMap: Record<string, "easy" | "medium" | "hard"> = {
      [Difficulty.RECOGNITION]: "easy",
      [Difficulty.COMPREHENSION]: "medium",
      [Difficulty.HIGH_APPLICATION]: "hard",
    };

    createQuizWithAI.mutate(
      {
        subject,
        grade: parseInt(grade),
        numberOfQuestions: count,
        duration: durationValue,
        difficulty: difficultyMap[difficulty] || "medium",
        customPrompt: prompt,
        topic: learningObjectives || undefined,
        status: "draft",
      },
      {
        onSuccess: (response) => {
          if (!response.success) {
            // Handle validation error
            const errorData = response.data as ValidationErrorData;
            if (errorData.is_test_description === false) {
              setValidationError(errorData);
              return;
            }
            toast.error(response.message || "Có lỗi xảy ra khi tạo đề thi");
            return;
          }

          toast.success("Tạo đề thi thành công!");
          // Navigate to the created quiz detail page
          const quizData = response.data as { quiz: { id: string } };
          router.push(`/dashboard/quiz/${quizData.quiz.id}`);
        },
        onError: (error) => {
          console.error("Error generating quiz:", error);
          const errorMessage =
            (error.response?.data as { message?: string })?.message ||
            "Có lỗi xảy ra khi tạo đề thi";
          toast.error(errorMessage);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <AILoading
          message="AI đang tạo đề thi từ chủ đề..."
          submessage="Quá trình này có thể mất vài giây"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* Back Button */}
      <ActionButton isBack label="Quay lại" href="/dashboard/quiz" />

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Topic/Prompt */}
        <div className="space-y-2">
          <Label htmlFor="prompt">
            Chủ đề / Nội dung cần kiểm tra{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ví dụ: Tạo đề kiểm tra về Chiến tranh Việt Nam, tập trung vào các sự kiện quan trọng từ 1945-1975, bao gồm Điện Biên Phủ, Hiệp định Paris..."
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">
            Mô tả chi tiết chủ đề, nội dung, phạm vi kiến thức cần kiểm tra.
            Càng cụ thể càng tốt.
          </p>
        </div>

        {/* Subject & Grade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject">
              Môn học <span className="text-red-500">*</span>
            </Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((subj) => (
                  <SelectItem key={subj} value={subj}>
                    {subj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">
              Lớp <span className="text-red-500">*</span>
            </Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger id="grade">
                <SelectValue placeholder="Chọn lớp" />
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

        {/* Question Count, Difficulty & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="questionCount">
              Số lượng câu hỏi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="questionCount"
              type="number"
              min="1"
              max="25"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              placeholder="Tối đa 25"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">
              Độ khó <span className="text-red-500">*</span>
            </Label>
            <Select
              value={difficulty}
              onValueChange={(value) => setDifficulty(value as Difficulty)}
            >
              <SelectTrigger id="difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">
              Thời gian (phút) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="180"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Ví dụ: 45"
            />
          </div>
        </div>

        {/* Learning Objectives (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="learningObjectives">
            Mục tiêu học tập (Tùy chọn)
          </Label>
          <Textarea
            id="learningObjectives"
            value={learningObjectives}
            onChange={(e) => setLearningObjectives(e.target.value)}
            placeholder="Ví dụ: Học sinh hiểu được diễn biến các sự kiện lịch sử, phân tích được nguyên nhân và ý nghĩa..."
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">
            Các mục tiêu cụ thể mà đề thi cần đánh giá
          </p>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Link href="/dashboard/quiz">
            <Button variant="outline">Hủy</Button>
          </Link>
          <Button onClick={handleGenerate}>
            <Sparkles className="w-4 h-4 mr-2" />
            Tạo đề thi với AI
          </Button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-2">
          Lưu ý khi tạo đề từ chủ đề
        </h3>
        <ul className="space-y-1 text-sm text-purple-800">
          <li>• Cách linh hoạt và nhanh nhất để tạo đề thi với AI</li>
          <li>
            • Mô tả càng chi tiết, câu hỏi sẽ càng sát với nhu cầu của bạn
          </li>
          <li>• Có thể chỉ định phạm vi kiến thức, trọng tâm cần tập trung</li>
          <li>• Phù hợp cho mọi môn học và cấp độ</li>
          <li>• Bạn có thể chỉnh sửa đề thi sau khi AI tạo xong</li>
        </ul>
      </div>

      {/* Examples */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Ví dụ mô tả chủ đề</h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Toán học</p>
            <p className="text-sm text-gray-700">
              Tạo đề kiểm tra về phương trình bậc hai, bao gồm: giải phương
              trình, tính delta, tìm nghiệm, vẽ đồ thị parabol, và các bài toán
              ứng dụng thực tế
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Tiếng Anh</p>
            <p className="text-sm text-gray-700">
              Kiểm tra từ vựng và ngữ pháp Unit 5-7, tập trung vào present
              perfect tense, passive voice, và từ vựng về môi trường và du lịch
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Lịch sử</p>
            <p className="text-sm text-gray-700">
              Đề thi về Cách mạng Tháng Tám 1945, bao gồm nguyên nhân, diễn
              biến, ý nghĩa lịch sử, và vai trò của Đảng và Bác Hồ
            </p>
          </div>
        </div>
      </div>

      {/* Validation Error Dialog */}
      <Dialog
        open={validationError !== null}
        onOpenChange={(open) => !open && setValidationError(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <DialogTitle>Mô tả chưa hợp lệ</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              {validationError?.comment ||
                "Mô tả bài kiểm tra chưa đủ thông tin hoặc không hợp lệ"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {validationError?.suggested_fix && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Gợi ý cải thiện:
                </p>
                <p className="text-sm text-blue-800">
                  {validationError.suggested_fix}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setValidationError(null)}>Đã hiểu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
