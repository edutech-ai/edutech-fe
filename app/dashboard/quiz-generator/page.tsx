"use client";

import { useState } from "react";
import { Brain, Sparkles, FileText } from "lucide-react";
import { QuizGeneratorForm } from "@/components/features/quiz-generator/QuizGeneratorForm";
import { QuizPreview } from "@/components/features/quiz-generator/QuizPreview";
import type { Question } from "@/types";

export default function QuizGeneratorPage() {
  const [generatedQuestions, setGeneratedQuestions] = useState<
    Question[] | null
  >(null);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tạo Đề Thi với AI
              </h1>
              <p className="text-gray-600 mt-1">
                Tạo đề thi tự động với công nghệ AI, tiết kiệm thời gian và đảm
                bảo chất lượng
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đề thi đã tạo</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Câu hỏi đã tạo</p>
                  <p className="text-2xl font-bold text-gray-900">1,248</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Brain className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Thời gian tiết kiệm</p>
                  <p className="text-2xl font-bold text-gray-900">48h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Configuration Form */}
          <QuizGeneratorForm
            onGenerate={(questions) => setGeneratedQuestions(questions)}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />

          {/* Right: Preview */}
          <QuizPreview
            questions={generatedQuestions}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
}
