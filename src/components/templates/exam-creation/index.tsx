"use client";

import React, { useState } from "react";
import { Plus, Save, FileText } from "lucide-react";
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
  type Question,
} from "@/components/molecules/question-item";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export function ExamCreationTemplate() {
  const [examInfo, setExamInfo] = useState<BasicExamInfo>({
    name: "",
    subject: "",
    grade: 10,
    durationMinutes: 45,
    totalScore: 10,
    instructions: "",
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(
    null
  );
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);

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
      const newQuestion: Question = {
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
        <Button onClick={handleSaveExam} size="lg">
          <Save className="w-5 h-5 mr-2" />
          Lưu đề thi
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="manual" className="w-full">
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
          <Card className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tạo đề thi với AI</h3>
              <p className="text-gray-600 mb-6">
                Sử dụng AI để tự động sinh đề thi dựa trên chủ đề và yêu cầu của
                bạn
              </p>
              <Button size="lg" className="w-full">
                Bắt đầu với AI
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
