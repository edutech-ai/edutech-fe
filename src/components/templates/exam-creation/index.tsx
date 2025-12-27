"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Save,
  FileText,
  Sparkles,
  CheckCircle2,
  Eye,
} from "lucide-react";
import {
  BasicExamInfoComponent,
  type BasicExamInfo,
} from "@/components/organisms/basic-exam-info";
import {
  QuestionEditor,
  type QuestionData,
} from "@/components/organisms/question-editor";
import {
  QuestionItem,
  type Question as QuestionItemType,
} from "@/components/molecules/question-item";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { QuizGeneratorForm } from "@/components/features/quiz-generator/QuizGeneratorForm";
import type { Question as AIQuestion } from "@/types";
import { AILoading } from "@/components/atoms/AILoading";
import { PDFPreview } from "@/components/features/quiz-generator/PDFPreview";

export function ExamCreationTemplate() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [examInfo, setExamInfo] = useState<BasicExamInfo>({
    name: "",
    subject: "",
    grade: 10,
    durationMinutes: 45,
    totalScore: 10,
    instructions: "",
  });

  const [questions, setQuestions] = useState<QuestionItemType[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(
    null
  );
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<AIQuestion[]>(
    []
  );
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  // Derive active tab from URL params (single source of truth)
  const activeTab = (() => {
    const tab = searchParams.get("tab");
    return tab === "ai" || tab === "manual" ? tab : "manual";
  })();

  const handleAddQuestion = () => {
    setEditingQuestion({
      content: "",
      type: "multiple_choice",
      difficulty: "medium",
      points: 1,
      answers: ["", "", "", ""],
      correctAnswer: 0,
    });
    setShowQuestionEditor(true);
  };

  const handleSaveQuestion = () => {
    if (editingQuestion) {
      const newQuestion: QuestionItemType = {
        id: editingQuestion.id || `q-${Date.now()}`,
        order: questions.length + 1,
        content: editingQuestion.content,
        type: editingQuestion.type,
        difficulty: editingQuestion.difficulty,
        points: editingQuestion.points,
        answers: editingQuestion.answers,
        correctAnswer: editingQuestion.correctAnswer as number,
      };

      if (editingQuestion.id) {
        // Update existing
        setQuestions(
          questions.map((q) => (q.id === editingQuestion.id ? newQuestion : q))
        );
      } else {
        // Add new
        setQuestions([...questions, newQuestion]);
      }

      setShowQuestionEditor(false);
      setEditingQuestion(null);
    }
  };

  const handleEditQuestion = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      setEditingQuestion({
        id: question.id,
        content: question.content,
        type: question.type,
        difficulty: question.difficulty,
        points: question.points,
        answers: question.answers,
        correctAnswer: question.correctAnswer,
      });
      setShowQuestionEditor(true);
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const handleSaveExam = () => {
    // eslint-disable-next-line no-console
    console.log("Saving exam:", { examInfo, questions });
    // TODO: Call API to save exam
  };

  const convertAIQuestionToQuestionItem = (
    aiQuestion: AIQuestion
  ): QuestionItemType => {
    return {
      id: aiQuestion.id,
      order: questions.length + 1,
      content: aiQuestion.content,
      type: aiQuestion.type === "MULTIPLE_CHOICE" ? "multiple_choice" : "essay",
      difficulty: aiQuestion.difficulty.toLowerCase() as
        | "easy"
        | "medium"
        | "hard",
      points: aiQuestion.points,
      answers: aiQuestion.options,
      correctAnswer: aiQuestion.correctAnswer,
    };
  };

  const handleAIGenerate = (aiQuestions: AIQuestion[]) => {
    setGeneratedQuestions(aiQuestions);
  };

  const handleAddGeneratedQuestions = () => {
    const convertedQuestions = generatedQuestions.map(
      convertAIQuestionToQuestionItem
    );
    setQuestions([...questions, ...convertedQuestions]);
    setGeneratedQuestions([]);
  };

  const handleAddSingleQuestion = (aiQuestion: AIQuestion) => {
    const converted = convertAIQuestionToQuestionItem(aiQuestion);
    setQuestions([...questions, converted]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tạo đề thi</h1>
          <p className="text-gray-500 mt-1">
            Tạo đề thi mới hoặc sử dụng AI để sinh đề tự động
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowPDFPreview(true)}
            variant="outline"
            size="lg"
            disabled={questions.length === 0}
          >
            <Eye className="w-5 h-5 mr-2" />
            Xem trước PDF
          </Button>
          <Button onClick={handleSaveExam} size="lg">
            <Save className="w-5 h-5 mr-2" />
            Lưu đề thi
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          const params = new URLSearchParams();
          params.set("tab", value);
          router.push(`/dashboard/quiz-generator?${params.toString()}`);
        }}
        className="w-full"
      >
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="manual">Tạo thủ công</TabsTrigger>
          <TabsTrigger value="ai">Tạo với AI</TabsTrigger>
        </TabsList>

        {/* Manual Creation Tab */}
        <TabsContent value="manual" className="space-y-6">
          {/* Exam Info */}
          <BasicExamInfoComponent examInfo={examInfo} onUpdate={setExamInfo} />

          {/* Questions Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Danh sách câu hỏi
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {questions.length} câu hỏi - Tổng{" "}
                  {questions.reduce((sum, q) => sum + q.points, 0)} điểm
                </p>
              </div>
              <Button onClick={handleAddQuestion}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm câu hỏi
              </Button>
            </div>

            {/* Question List */}
            <div className="space-y-3">
              {questions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>
                    Chưa có câu hỏi nào. Nhấn &quot;Thêm câu hỏi&quot; để bắt
                    đầu.
                  </p>
                </div>
              ) : (
                questions.map((question) => (
                  <QuestionItem
                    key={question.id}
                    question={question}
                    onEdit={handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                    isDraggable
                  />
                ))
              )}
            </div>
          </Card>

          {/* Question Editor Modal */}
          {showQuestionEditor && editingQuestion && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <QuestionEditor
                  question={editingQuestion}
                  onUpdate={setEditingQuestion}
                  onCancel={() => {
                    setShowQuestionEditor(false);
                    setEditingQuestion(null);
                  }}
                  onSave={handleSaveQuestion}
                />
              </div>
            </div>
          )}
        </TabsContent>

        {/* AI Creation Tab */}
        <TabsContent value="ai" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Generator Form */}
            <div>
              <QuizGeneratorForm
                onGenerate={handleAIGenerate}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </div>

            {/* Right: Generated Questions */}
            <div>
              <Card className="p-6 bg-white border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Câu hỏi đã tạo
                    </h3>
                  </div>
                  {generatedQuestions.length > 0 && (
                    <Button onClick={handleAddGeneratedQuestions} size="sm">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Thêm tất cả ({generatedQuestions.length})
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {isGenerating ? (
                    <AILoading />
                  ) : generatedQuestions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Chưa có câu hỏi nào được tạo</p>
                      <p className="text-sm mt-2">
                        Điền thông tin và nhấn &quot;Tạo đề thi&quot; để bắt đầu
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
                        {generatedQuestions.map((question, index) => (
                          <div
                            key={question.id}
                            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                Câu {index + 1}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleAddSingleQuestion(question)
                                }
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Thêm
                              </Button>
                            </div>
                            <p className="text-gray-900 mb-2">
                              {question.content}
                            </p>
                            {question.options && (
                              <div className="space-y-1 text-sm">
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`pl-3 py-1 rounded ${
                                      question.correctAnswer === optIndex
                                        ? "bg-green-50 text-green-700 font-medium"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optIndex)}.{" "}
                                    {option}
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <span className="px-2 py-1 bg-gray-100 rounded">
                                {question.difficulty}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                {question.points} điểm
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* PDF Preview Modal */}
      <PDFPreview
        examInfo={examInfo}
        questions={questions}
        open={showPDFPreview}
        onClose={() => setShowPDFPreview(false)}
      />
    </div>
  );
}
