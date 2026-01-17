"use client";

import { useState } from "react";
import { Plus, GripVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddQuestionModal } from "./AddQuestionModal";
import type { QuestionUI } from "@/types";
import { QuestionTypeUI } from "@/types";

interface QuestionListTabProps {
  questions: QuestionUI[];
  onUpdate: (questions: QuestionUI[]) => void;
}

const questionTypeLabels: Record<string, string> = {
  MCQ: "Một đáp án",
  MULTIPLE_ANSWER: "Nhiều đáp án",
  TRUE_FALSE: "Đúng/Sai",
  ESSAY: "Tự luận",
};

const difficultyLabels: Record<string, string> = {
  RECOGNITION: "Nhận biết",
  COMPREHENSION: "Thông hiểu",
  APPLICATION: "Vận dụng",
  HIGH_APPLICATION: "Vận dụng cao",
};

export function QuestionListTab({ questions, onUpdate }: QuestionListTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionUI | null>(
    null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddQuestion = (question: QuestionUI) => {
    onUpdate([...questions, question]);
    setShowAddModal(false);
  };

  const handleEditQuestion = (question: QuestionUI) => {
    const newQuestions = questions.map((q) =>
      q.id === question.id ? question : q
    );
    onUpdate(newQuestions);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id: string) => {
    onUpdate(questions.filter((q) => q.id !== id));
    setDeleteConfirm(null);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newQuestions = [...questions];
    const draggedQuestion = newQuestions[draggedIndex];

    newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(index, 0, draggedQuestion);

    setDraggedIndex(index);
    onUpdate(newQuestions);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
        <div>
          <p className="text-sm text-gray-600">
            Tổng số câu hỏi:{" "}
            <span className="font-semibold">{questions.length}</span>
          </p>
          <p className="text-sm text-gray-600">
            Tổng điểm: <span className="font-semibold">{totalPoints}</span>
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm câu hỏi
        </Button>
      </div>

      {/* Question List */}
      <div className="bg-white rounded-xl border border-gray-200">
        {questions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">Chưa có câu hỏi nào</p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm câu hỏi đầu tiên
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {questions.map((question, index) => (
              <div
                key={question.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  draggedIndex === index ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Drag Handle */}
                  <button className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-5 h-5" />
                  </button>

                  {/* Question Number */}
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {index + 1}
                    </span>
                  </div>

                  {/* Question Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <p className="text-gray-900 font-medium">
                        {question.content}
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingQuestion(question)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm(question.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>

                    {/* Question Options (for choice questions) */}
                    {question.options && question.options.length > 0 && (
                      <div className="space-y-1 mb-2">
                        {question.options.map((option, optIndex) => {
                          const isCorrect =
                            question.type === QuestionTypeUI.MULTIPLE_CHOICE
                              ? question.correctAnswers?.includes(optIndex)
                              : question.correctAnswer === optIndex;

                          return (
                            <div
                              key={optIndex}
                              className={`text-sm px-2 py-1 rounded ${
                                isCorrect
                                  ? "bg-green-50 text-green-700 font-medium"
                                  : "text-gray-600"
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}. {option}
                              {isCorrect && " ✓"}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Question Meta */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {questionTypeLabels[question.type]}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {difficultyLabels[question.difficulty]}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                        {question.points} điểm
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Question Modal */}
      <AddQuestionModal
        open={showAddModal || editingQuestion !== null}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddModal(false);
            setEditingQuestion(null);
          }
        }}
        onSubmit={editingQuestion ? handleEditQuestion : handleAddQuestion}
        question={editingQuestion}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa câu hỏi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteConfirm && handleDeleteQuestion(deleteConfirm)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
