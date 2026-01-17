"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
import { Checkbox } from "@/components/ui/checkbox";
import { examMatrixMockService } from "@/services/mock";
import type { ExamMatrix } from "@/types";
import { toast } from "sonner";
import { SUBJECTS, GRADES, QuestionTypeUI, Difficulty } from "@/types";

interface QuestionTypeOption {
  value: string;
  label: string;
  allowMultiple: boolean;
}

const questionTypeOptions: QuestionTypeOption[] = [
  {
    value: QuestionTypeUI.SINGLE_CHOICE,
    label: "Một đáp án",
    allowMultiple: false,
  },
  { value: QuestionTypeUI.TRUE_FALSE, label: "Đúng/Sai", allowMultiple: false },
  { value: QuestionTypeUI.ESSAY, label: "Tự luận", allowMultiple: false },
];

const difficultyOptions = [
  { value: Difficulty.RECOGNITION, label: "Nhận biết" },
  { value: Difficulty.COMPREHENSION, label: "Thông hiểu" },
  { value: Difficulty.APPLICATION, label: "Vận dụng" },
  { value: Difficulty.HIGH_APPLICATION, label: "Vận dụng cao" },
];

export default function MatrixBasedGeneratorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [matrices, setMatrices] = useState<ExamMatrix[]>([]);
  const [loadingMatrices, setLoadingMatrices] = useState(true);

  // Form state
  const [selectedMatrix, setSelectedMatrix] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<string>("20");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    Difficulty.RECOGNITION
  );
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<
    Set<string>
  >(new Set([QuestionTypeUI.SINGLE_CHOICE]));
  const [multipleCorrectAnswers, setMultipleCorrectAnswers] = useState<
    Map<string, boolean>
  >(new Map());
  const [learningObjectives, setLearningObjectives] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");

  // Load matrices on mount
  useEffect(() => {
    loadMatrices();
  }, []);

  // Filter matrices when subject/grade changes
  useEffect(() => {
    if (subject || grade) {
      loadMatrices({
        subject: subject || undefined,
        grade: grade ? parseInt(grade) : undefined,
      });
    }
  }, [subject, grade]);

  async function loadMatrices(filters?: { subject?: string; grade?: number }) {
    try {
      setLoadingMatrices(true);
      const data = await examMatrixMockService.getAll(filters);
      setMatrices(data);
    } catch (error) {
      console.error("Error loading matrices:", error);
    } finally {
      setLoadingMatrices(false);
    }
  }

  const handleQuestionTypeToggle = (type: string) => {
    const newTypes = new Set(selectedQuestionTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
      // Remove multiple correct setting if type is removed
      const newMultiple = new Map(multipleCorrectAnswers);
      newMultiple.delete(type);
      setMultipleCorrectAnswers(newMultiple);
    } else {
      newTypes.add(type);
    }
    setSelectedQuestionTypes(newTypes);
  };

  const handleMultipleCorrectToggle = (type: string, checked: boolean) => {
    const newMultiple = new Map(multipleCorrectAnswers);
    newMultiple.set(type, checked);
    setMultipleCorrectAnswers(newMultiple);
  };

  const handleGenerate = async () => {
    // Validation
    if (!selectedMatrix) {
      toast.error("Vui lòng chọn ma trận đề thi");
      return;
    }
    if (!subject) {
      toast.error("Vui lòng chọn môn học");
      return;
    }
    if (!grade) {
      toast.error("Vui lòng chọn lớp");
      return;
    }
    if (selectedQuestionTypes.size === 0) {
      toast.error("Vui lòng chọn ít nhất một loại câu hỏi");
      return;
    }
    if (!prompt.trim()) {
      toast.error("Vui lòng nhập chủ đề hoặc yêu cầu cụ thể");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Call AI service to generate quiz based on matrix
      const questionTypesArray = Array.from(selectedQuestionTypes);
      const multipleCorrectConfig = Object.fromEntries(multipleCorrectAnswers);

      // eslint-disable-next-line no-console
      console.log("Generating quiz with:", {
        matrixId: selectedMatrix,
        subject,
        grade: parseInt(grade),
        questionCount: parseInt(questionCount),
        difficulty,
        questionTypes: questionTypesArray,
        multipleCorrectAnswers: multipleCorrectConfig,
        learningObjectives,
        prompt,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate a mock request ID and navigate to quiz editor
      const requestId = `ai-${Date.now()}`;
      router.push(
        `/dashboard/quiz/new?type=MANUAL&aiGenRequestId=${requestId}`
      );
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Có lỗi xảy ra khi tạo đề thi");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <AILoading
          message="AI đang tạo đề thi từ ma trận..."
          submessage="Quá trình này có thể mất vài giây"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* Back Button */}
      <Link href="/dashboard/quiz">
        <Button
          variant="ghost"
          className="gap-2 text-primary-text font-bold hover:text-primary-text/80"
        >
          <Image
            src="/images/util/back2.svg"
            alt="Back"
            width={20}
            height={20}
          />
          Back
        </Button>
      </Link>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Matrix Selection */}
        <div className="space-y-2">
          <Label htmlFor="matrix">
            Ma trận đề thi <span className="text-red-500">*</span>
          </Label>
          <Select value={selectedMatrix} onValueChange={setSelectedMatrix}>
            <SelectTrigger id="matrix" disabled={loadingMatrices}>
              <SelectValue
                placeholder={
                  loadingMatrices
                    ? "Đang tải ma trận..."
                    : "Chọn ma trận đề thi"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {matrices.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 text-center">
                  {loadingMatrices
                    ? "Đang tải..."
                    : "Không có ma trận nào. Vui lòng tạo ma trận mới."}
                </div>
              ) : (
                matrices.map((matrix) => (
                  <SelectItem key={matrix.id} value={matrix.id}>
                    {matrix.name} - {matrix.subject} lớp {matrix.grade}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Ma trận đề thi sẽ quyết định cấu trúc và phân bổ câu hỏi theo mức độ
            nhận thức
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

        {/* Question Count & Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="questionCount">
              Số lượng câu hỏi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="questionCount"
              type="number"
              min="1"
              max="100"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              placeholder="Nhập số câu hỏi"
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
        </div>

        {/* Question Types */}
        <div className="space-y-3">
          <Label>
            Loại câu hỏi <span className="text-red-500">*</span>
          </Label>
          <div className="space-y-3 border border-gray-200 rounded-lg p-4">
            {questionTypeOptions.map((option) => (
              <div key={option.value} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={option.value}
                    checked={selectedQuestionTypes.has(option.value)}
                    onCheckedChange={() =>
                      handleQuestionTypeToggle(option.value)
                    }
                  />
                  <Label
                    htmlFor={option.value}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>

                {/* Multiple correct answers option for MULTIPLE_CHOICE */}
                {option.value === QuestionTypeUI.MULTIPLE_CHOICE &&
                  selectedQuestionTypes.has(option.value) && (
                    <div className="ml-6 flex items-center gap-2">
                      <Checkbox
                        id={`${option.value}-multiple`}
                        checked={
                          multipleCorrectAnswers.get(option.value) || false
                        }
                        onCheckedChange={(checked) =>
                          handleMultipleCorrectToggle(
                            option.value,
                            checked as boolean
                          )
                        }
                      />
                      <Label
                        htmlFor={`${option.value}-multiple`}
                        className="text-sm text-gray-600 cursor-pointer"
                      >
                        Cho phép nhiều đáp án đúng
                      </Label>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* Prompt/Topic */}
        <div className="space-y-2">
          <Label htmlFor="prompt">
            Chủ đề / Yêu cầu cụ thể <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ví dụ: Tạo đề kiểm tra về phương trình bậc hai, tập trung vào việc giải phương trình và ứng dụng..."
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">
            Mô tả chi tiết nội dung cần kiểm tra để AI tạo câu hỏi phù hợp
          </p>
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
            placeholder="Ví dụ: Học sinh có khả năng giải các phương trình bậc hai, phân tích được nghiệm..."
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          💡 Lưu ý khi tạo đề theo ma trận
        </h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>
            • Ma trận đã được thiết lập phân bổ câu hỏi theo mức độ nhận thức
          </li>
          <li>
            • AI sẽ tạo câu hỏi phù hợp với cấu trúc và điểm số trong ma trận
          </li>
          <li>
            • Số câu hỏi và độ khó sẽ được điều chỉnh để phù hợp với ma trận đã
            chọn
          </li>
          <li>• Bạn có thể chỉnh sửa đề thi sau khi AI tạo xong</li>
        </ul>
      </div>
    </div>
  );
}
