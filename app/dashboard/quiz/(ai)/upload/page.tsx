"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Upload,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { SUBJECTS, GRADES, QuestionTypeUI, Difficulty } from "@/types";
import { toast } from "sonner";
import { ActionButton } from "@/components/molecules/action-button";

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

interface UploadedFile {
  file: File;
  preview?: string;
}

export default function UploadBasedGeneratorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    Array.from(files).forEach((file) => {
      // Check file type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];

      if (!validTypes.includes(file.type)) {
        toast.error(`File ${file.name} không được hỗ trợ`);
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} quá lớn (tối đa 10MB)`);
        return;
      }

      newFiles.push({ file });
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
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

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

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
    if (uploadedFiles.length === 0) {
      toast.error("Vui lòng tải lên ít nhất một tài liệu");
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

    setIsLoading(true);

    try {
      // TODO: Upload files and call AI service to generate quiz
      const questionTypesArray = Array.from(selectedQuestionTypes);
      const multipleCorrectConfig = Object.fromEntries(multipleCorrectAnswers);

      // eslint-disable-next-line no-console
      console.log("Generating quiz with:", {
        files: uploadedFiles.map((f) => f.file.name),
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

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <AILoading
          message="AI đang tạo đề thi từ tài liệu..."
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
        {/* File Upload */}
        <div className="space-y-3">
          <Label>
            Tải lên tài liệu <span className="text-red-500">*</span>
          </Label>

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-green-400"
            }`}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-700 font-medium mb-1">
              Kéo thả tài liệu vào đây hoặc
            </p>
            <label htmlFor="file-upload">
              <span className="text-green-600 hover:text-green-700 cursor-pointer font-medium">
                chọn file từ máy tính
              </span>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Hỗ trợ PDF, Word, JPG, PNG (Tối đa 10MB mỗi file)
            </p>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">
                Đã tải lên ({uploadedFiles.length})
              </Label>
              <div className="space-y-2">
                {uploadedFiles.map((uploadedFile, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="shrink-0 w-8 h-8 bg-white rounded border border-gray-200 flex items-center justify-center">
                      {getFileIcon(uploadedFile.file)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
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

        {/* Prompt/Topic (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="prompt">Yêu cầu bổ sung (Tùy chọn)</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ví dụ: Tập trung vào các khái niệm chính, tránh các chi tiết quá cụ thể..."
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">
            Thêm hướng dẫn cụ thể để AI tạo câu hỏi phù hợp hơn
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
            placeholder="Ví dụ: Học sinh có khả năng hiểu và vận dụng các kiến thức trong tài liệu..."
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
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">
          💡 Lưu ý khi tạo đề từ tài liệu
        </h3>
        <ul className="space-y-1 text-sm text-green-800">
          <li>• AI sẽ phân tích và trích xuất nội dung từ tài liệu của bạn</li>
          <li>
            • Câu hỏi được tạo sẽ dựa trên kiến thức có trong tài liệu đã tải
            lên
          </li>
          <li>• Tài liệu nên có cấu trúc rõ ràng để AI phân tích tốt hơn</li>
          <li>• Bạn có thể tải lên nhiều tài liệu để tạo đề thi đa dạng hơn</li>
          <li>• Bạn có thể chỉnh sửa đề thi sau khi AI tạo xong</li>
        </ul>
      </div>
    </div>
  );
}
