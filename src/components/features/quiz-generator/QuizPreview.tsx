"use client";

import { Eye, Download, Save, Edit, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/atoms/Loading";
import type { Question } from "@/types";
import { QuestionType } from "@/types";

interface QuizPreviewProps {
  questions: Question[] | null;
  isGenerating: boolean;
}

export function QuizPreview({ questions, isGenerating }: QuizPreviewProps) {
  if (isGenerating) {
    return <Loading message="AI đang tạo câu hỏi..." size="3xl" fullScreen />;
  }

  if (!questions) {
    return (
      <Card className="p-6 bg-white border-gray-200">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <Eye className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Xem trước đề thi
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            Điền thông tin bên trái và nhấn Tạo đề thi với AI để xem kết quả
          </p>
        </div>
      </Card>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Dễ";
      case "medium":
        return "Trung bình";
      case "hard":
        return "Khó";
      default:
        return difficulty;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Actions */}
      <Card className="p-4 bg-white border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-900">
              {questions.length} câu hỏi đã được tạo
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Lưu
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Xuất file
          </Button>
        </div>
      </Card>

      {/* Questions List */}
      <Card className="p-6 bg-white border-gray-200 max-h-[600px] overflow-y-auto">
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between mb-3">
                <span className="font-semibold text-gray-900">
                  Câu {index + 1}
                </span>
                <div className="flex gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}
                  >
                    {getDifficultyText(question.difficulty)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    {question.points} điểm
                  </span>
                </div>
              </div>

              {/* Question Content */}
              <p className="text-gray-800 mb-3">{question.content}</p>

              {/* Options for Multiple Choice */}
              {question.type === QuestionType.MULTIPLE_CHOICE &&
                question.options && (
                  <div className="space-y-2 ml-4">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`flex items-center gap-2 p-2 rounded ${
                          question.correctAnswer === optIndex
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50"
                        }`}
                      >
                        <span className="font-medium text-gray-700">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        <span className="text-gray-800">{option}</span>
                        {question.correctAnswer === optIndex && (
                          <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

              {/* Explanation */}
              {question.explanation && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Giải thích:
                  </p>
                  <p className="text-sm text-blue-800">
                    {question.explanation}
                  </p>
                </div>
              )}

              {/* Tags */}
              {question.tags && question.tags.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {question.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
