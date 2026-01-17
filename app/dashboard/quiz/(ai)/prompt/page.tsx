"use client";

import { useState } from "react";
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
import { SUBJECTS, GRADES, QuestionTypeUI, Difficulty } from "@/types";
import { toast } from "sonner";

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
  {
    value: QuestionTypeUI.MULTIPLE_CHOICE,
    label: "Nhiều đáp án",
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

export default function PromptBasedGeneratorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
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

  const handleQuestionTypeToggle = (type: string) => {
    const newTypes = new Set(selectedQuestionTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
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
      toast.error("Vui lòng nhập chủ đề hoặc mô tả nội dung");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Call AI service to generate quiz based on prompt
      const questionTypesArray = Array.from(selectedQuestionTypes);
      const multipleCorrectConfig = Object.fromEntries(multipleCorrectAnswers);

      // eslint-disable-next-line no-console
      console.log("Generating quiz with:", {
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

      // Generate a mock request ID
      const requestId = `ai-${Date.now()}`;

      // Navigate to quiz editor with AI-generated content
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
          message="AI đang tạo đề thi từ chủ đề..."
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
    </div>
  );
}
