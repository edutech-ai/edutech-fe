"use client";

import React, { useState, useEffect } from "react";
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
import { ExamStorageService } from "@/services/storage/examStorage";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export function ExamCreationTemplate() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [examInfo, setExamInfo] = useState<BasicExamInfo>({
    name: "Đề thi mẫu - Test",
    subject: "Tiếng Anh",
    grade: 8,
    durationMinutes: 45,
    totalScore: 10,
    instructions: "Học sinh làm bài vào giấy thi. Không được sử dụng tài liệu.",
  });

  // 3 câu hỏi mẫu để test drag & drop
  const [questions, setQuestions] = useState<QuestionItemType[]>([
    {
      id: "sample-1",
      order: 1,
      content: "What is the capital of Vietnam?",
      type: "multiple_choice",
      difficulty: "easy",
      points: 2,
      answers: ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hue"],
      correctAnswer: 0,
    },
    {
      id: "sample-2",
      order: 2,
      content: "She _____ to school every day.",
      type: "multiple_choice",
      difficulty: "medium",
      points: 2,
      answers: ["go", "goes", "going", "went"],
      correctAnswer: 1,
    },
    {
      id: "sample-3",
      order: 3,
      content: "Translate to English: 'Tôi thích học tiếng Anh'",
      type: "short_answer",
      difficulty: "medium",
      points: 3,
      answers: [],
      correctAnswer: undefined,
    },
  ]);
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(
    null
  );
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<AIQuestion[]>(
    []
  );
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [currentExamId, setCurrentExamId] = useState<string | undefined>();

  // Derive active tab from URL params (single source of truth)
  const activeTab = (() => {
    const tab = searchParams.get("tab");
    return tab === "ai" || tab === "manual" ? tab : "manual";
  })();

  // Load existing exam if exam ID is in URL
  useEffect(() => {
    const examId = searchParams.get("exam");
    if (examId) {
      const savedExam = ExamStorageService.getExamById(examId);
      if (savedExam) {
        // Loading initial data from localStorage is a valid use case
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExamInfo(savedExam.examInfo);
        setQuestions(savedExam.questions);
        setCurrentExamId(savedExam.id);
      }
    }
  }, [searchParams]);

  // Drag & drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        // Update order numbers
        return reorderedItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));
      });
    }
  };

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
    try {
      // Validate exam info
      if (!examInfo.name || !examInfo.subject) {
        toast.error("Vui lòng điền đầy đủ thông tin đề thi!");
        return;
      }

      if (questions.length === 0) {
        toast.error("Vui lòng thêm ít nhất 1 câu hỏi!");
        return;
      }

      // Save to localStorage
      const savedExam = ExamStorageService.saveExam(
        examInfo,
        questions,
        currentExamId
      );

      setCurrentExamId(savedExam.id);
      toast.success("Đã lưu đề thi thành công!");
    } catch (error) {
      console.error("Error saving exam:", error);
      toast.error("Có lỗi xảy ra khi lưu đề thi!");
    }
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
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
                  <SortableContext
                    items={questions.map((q) => q.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {questions.map((question) => (
                      <QuestionItem
                        key={question.id}
                        question={question}
                        onEdit={handleEditQuestion}
                        onDelete={handleDeleteQuestion}
                        isDraggable
                      />
                    ))}
                  </SortableContext>
                )}
              </div>
            </DndContext>
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
