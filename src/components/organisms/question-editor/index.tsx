"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FormField } from "@/components/molecules/form-field";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  QuestionData,
  QuestionType,
  QuestionDifficulty,
  QuestionEditorErrors,
} from "./types";

interface QuestionEditorProps {
  question: QuestionData;
  onUpdate: (question: QuestionData) => void;
  onCancel?: () => void;
  onSave?: () => void;
}

export function QuestionEditor({
  question,
  onUpdate,
  onCancel,
  onSave,
}: QuestionEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errors, setErrors] = useState<QuestionEditorErrors>({});

  const handleUpdate = (
    field: keyof QuestionData,
    value: string | number | string[] | boolean | undefined
  ) => {
    onUpdate({ ...question, [field]: value });
  };

  const handleAddAnswer = () => {
    const currentAnswers = question.answers || [];
    handleUpdate("answers", [...currentAnswers, ""]);
  };

  const handleUpdateAnswer = (index: number, value: string) => {
    const newAnswers = [...(question.answers || [])];
    newAnswers[index] = value;
    handleUpdate("answers", newAnswers);
  };

  const handleRemoveAnswer = (index: number) => {
    const newAnswers = (question.answers || []).filter((_, i) => i !== index);
    handleUpdate("answers", newAnswers);
    if (question.correctAnswer === index) {
      handleUpdate("correctAnswer", undefined);
    }
  };

  const questionTypes: { value: QuestionType; label: string }[] = [
    { value: "multiple_choice", label: "Trắc nghiệm" },
    { value: "true_false", label: "Đúng/Sai" },
    { value: "short_answer", label: "Trả lời ngắn" },
    { value: "essay", label: "Tự luận" },
  ];

  const difficulties: { value: QuestionDifficulty; label: string }[] = [
    { value: "easy", label: "Dễ" },
    { value: "medium", label: "Trung bình" },
    { value: "hard", label: "Khó" },
  ];

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {question.id ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
        </h3>

        {/* Question Content */}
        <FormField
          label="Nội dung câu hỏi"
          name="content"
          type="textarea"
          value={question.content}
          onChange={(value) => handleUpdate("content", value)}
          error={errors.content}
          placeholder="Nhập nội dung câu hỏi..."
          required
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Question Type */}
          <div className="space-y-2">
            <Label>
              Loại câu hỏi <span className="text-red-500">*</span>
            </Label>
            <Select
              value={question.type}
              onValueChange={(value: QuestionType) =>
                handleUpdate("type", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label>
              Độ khó <span className="text-red-500">*</span>
            </Label>
            <Select
              value={question.difficulty}
              onValueChange={(value: QuestionDifficulty) =>
                handleUpdate("difficulty", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((diff) => (
                  <SelectItem key={diff.value} value={diff.value}>
                    {diff.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Points */}
          <FormField
            label="Điểm"
            name="points"
            type="number"
            value={question.points}
            onChange={(value) => handleUpdate("points", value)}
            error={errors.points}
            required
          />
        </div>

        {/* Answers Section - Multiple Choice */}
        {question.type === "multiple_choice" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Các đáp án <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAnswer}
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm đáp án
              </Button>
            </div>

            <div className="space-y-2">
              {(question.answers || []).map((answer, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center font-semibold text-gray-700">
                    {String.fromCharCode(65 + index)}.
                  </div>
                  <Input
                    value={answer}
                    onChange={(e) => handleUpdateAnswer(index, e.target.value)}
                    placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleUpdate("correctAnswer", index)}
                    className={cn(
                      question.correctAnswer === index &&
                        "bg-green-100 text-green-700 hover:bg-green-200"
                    )}
                  >
                    ✓
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAnswer(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            {errors.answers && (
              <p className="text-sm text-red-500">{errors.answers}</p>
            )}
          </div>
        )}

        {/* Explanation */}
        <FormField
          label="Giải thích (tùy chọn)"
          name="explanation"
          type="textarea"
          value={question.explanation || ""}
          onChange={(value) => handleUpdate("explanation", value)}
          placeholder="Giải thích đáp án đúng..."
          rows={2}
        />

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Hủy
            </Button>
          )}
          {onSave && (
            <Button type="button" onClick={onSave}>
              {question.id ? "Cập nhật" : "Thêm câu hỏi"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export type { QuestionData, QuestionType, QuestionDifficulty };
