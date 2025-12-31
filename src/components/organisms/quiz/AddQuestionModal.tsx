"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Question } from "@/types";
import { QuestionType, Difficulty } from "@/types";
import { toast } from "sonner";

interface AddQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (question: Question) => void;
  question?: Question | null;
}

const questionTypeOptions = [
  { value: QuestionType.SINGLE_CHOICE, label: "Một đáp án" },
  { value: QuestionType.MULTIPLE_CHOICE, label: "Nhiều đáp án" },
  { value: QuestionType.TRUE_FALSE, label: "Đúng/Sai" },
  { value: QuestionType.SHORT_ANSWER, label: "Trả lời ngắn" },
  { value: QuestionType.ESSAY, label: "Tự luận" },
];

const difficultyOptions = [
  { value: Difficulty.RECOGNITION, label: "Nhận biết" },
  { value: Difficulty.COMPREHENSION, label: "Thông hiểu" },
  { value: Difficulty.APPLICATION, label: "Vận dụng" },
  { value: Difficulty.HIGH_APPLICATION, label: "Vận dụng cao" },
];

export function AddQuestionModal({
  open,
  onOpenChange,
  onSubmit,
  question,
}: AddQuestionModalProps) {
  const [type, setType] = useState<QuestionType>(QuestionType.SINGLE_CHOICE);
  const [content, setContent] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [shortAnswer, setShortAnswer] = useState("");
  const [points, setPoints] = useState("1");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    Difficulty.RECOGNITION
  );
  const [explanation, setExplanation] = useState("");

  // Load question data when editing
  useEffect(() => {
    if (question) {
      setType(question.type);
      setContent(question.content);
      setOptions(question.options || ["", "", "", ""]);
      setCorrectAnswer(
        typeof question.correctAnswer === "number" ? question.correctAnswer : 0
      );
      setCorrectAnswers(
        question.correctAnswers?.map((a) => (typeof a === "number" ? a : 0)) ||
          []
      );
      setShortAnswer(
        typeof question.correctAnswer === "string" ? question.correctAnswer : ""
      );
      setPoints(question.points.toString());
      setDifficulty(question.difficulty);
      setExplanation(question.explanation || "");
    } else {
      // eslint-disable-next-line react-hooks/immutability
      resetForm();
    }
  }, [question, open]);

  const resetForm = () => {
    setType(QuestionType.SINGLE_CHOICE);
    setContent("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    setCorrectAnswers([]);
    setShortAnswer("");
    setPoints("1");
    setDifficulty(Difficulty.RECOGNITION);
    setExplanation("");
  };

  const handleSubmit = () => {
    // Validation
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung câu hỏi");
      return;
    }

    if (
      (type === QuestionType.SINGLE_CHOICE ||
        type === QuestionType.MULTIPLE_CHOICE) &&
      options.some((opt) => !opt.trim())
    ) {
      toast.error("Vui lòng nhập đầy đủ các đáp án");
      return;
    }

    if (type === QuestionType.MULTIPLE_CHOICE && correctAnswers.length === 0) {
      toast.error("Vui lòng chọn ít nhất một đáp án đúng");
      return;
    }

    if (type === QuestionType.SHORT_ANSWER && !shortAnswer.trim()) {
      toast.error("Vui lòng nhập đáp án đúng");
      return;
    }

    const pointsNum = parseFloat(points);
    if (isNaN(pointsNum) || pointsNum < 0 || pointsNum > 10) {
      toast.error("Điểm phải là số từ 0 đến 10");
      return;
    }

    const newQuestion: Question = {
      id: question?.id || `q-${Date.now()}`,
      type,
      content,
      points: pointsNum,
      difficulty,
      explanation: explanation || undefined,
      options:
        type === QuestionType.SINGLE_CHOICE ||
        type === QuestionType.MULTIPLE_CHOICE
          ? options
          : undefined,
      correctAnswer:
        type === QuestionType.SINGLE_CHOICE
          ? correctAnswer
          : type === QuestionType.TRUE_FALSE
            ? correctAnswer
            : type === QuestionType.SHORT_ANSWER
              ? shortAnswer
              : undefined,
      correctAnswers:
        type === QuestionType.MULTIPLE_CHOICE ? correctAnswers : undefined,
    };

    onSubmit(newQuestion);
    if (!question) {
      resetForm();
    }
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      toast.error("Phải có ít nhất 2 đáp án");
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);

    // Adjust correct answers
    if (type === QuestionType.SINGLE_CHOICE && correctAnswer === index) {
      setCorrectAnswer(0);
    } else if (type === QuestionType.MULTIPLE_CHOICE) {
      setCorrectAnswers(
        correctAnswers
          .filter((a) => a !== index)
          .map((a) => (a > index ? a - 1 : a))
      );
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleMultipleChoiceToggle = (index: number, checked: boolean) => {
    if (checked) {
      setCorrectAnswers([...correctAnswers, index]);
    } else {
      setCorrectAnswers(correctAnswers.filter((a) => a !== index));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {question ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin câu hỏi và chọn loại câu hỏi phù hợp
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Question Type */}
          <div className="space-y-2">
            <Label>
              Loại câu hỏi <span className="text-red-500">*</span>
            </Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as QuestionType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {questionTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Question Content */}
          <div className="space-y-2">
            <Label htmlFor="content">
              Nội dung câu hỏi <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung câu hỏi..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Options for Single Choice */}
          {type === QuestionType.SINGLE_CHOICE && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>
                  Các đáp án <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm đáp án
                </Button>
              </div>
              <RadioGroup
                value={correctAnswer.toString()}
                onValueChange={(value) => setCorrectAnswer(parseInt(value))}
              >
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                    />
                    <Input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                      className="flex-1"
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                ))}
              </RadioGroup>
              <p className="text-xs text-gray-500">
                Chọn đáp án đúng bằng cách click vào radio button
              </p>
            </div>
          )}

          {/* Options for Multiple Choice */}
          {type === QuestionType.MULTIPLE_CHOICE && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>
                  Các đáp án <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm đáp án
                </Button>
              </div>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox
                      checked={correctAnswers.includes(index)}
                      onCheckedChange={(checked) =>
                        handleMultipleChoiceToggle(index, checked as boolean)
                      }
                      id={`option-multi-${index}`}
                    />
                    <Input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                      className="flex-1"
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Chọn tất cả các đáp án đúng bằng cách tick vào checkbox
              </p>
            </div>
          )}

          {/* True/False */}
          {type === QuestionType.TRUE_FALSE && (
            <div className="space-y-2">
              <Label>
                Đáp án đúng <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={correctAnswer.toString()}
                onValueChange={(value) => setCorrectAnswer(parseInt(value))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="true" />
                  <Label htmlFor="true" className="cursor-pointer">
                    Đúng
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="false" />
                  <Label htmlFor="false" className="cursor-pointer">
                    Sai
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Short Answer */}
          {type === QuestionType.SHORT_ANSWER && (
            <div className="space-y-2">
              <Label htmlFor="shortAnswer">
                Đáp án đúng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shortAnswer"
                value={shortAnswer}
                onChange={(e) => setShortAnswer(e.target.value)}
                placeholder="Nhập đáp án đúng..."
              />
            </div>
          )}

          {/* Points and Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points">
                Điểm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="points"
                type="text"
                inputMode="decimal"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="1"
              />
              <p className="text-xs text-gray-500">Có thể nhập số thập phân</p>
            </div>

            <div className="space-y-2">
              <Label>
                Độ khó <span className="text-red-500">*</span>
              </Label>
              <Select
                value={difficulty}
                onValueChange={(value) => setDifficulty(value as Difficulty)}
              >
                <SelectTrigger>
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

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">Giải thích (Tùy chọn)</Label>
            <Textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Giải thích đáp án đúng..."
              rows={2}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            {question ? "Lưu thay đổi" : "Thêm câu hỏi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
