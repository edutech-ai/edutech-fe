"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Copy,
  Trash2,
  FileText,
  Loader2,
  Sparkles,
  Globe,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useQuizById,
  useQuizQuestions,
  useDeleteQuiz,
  useUpdateVisibility,
} from "@/services/quizService";
import { toast } from "sonner";
import { useState } from "react";
import { ActionButton } from "@/components/molecules/action-button";
import LaTeXRenderer from "@/components/atoms/latex-renderer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AnalyzeQuizDialog } from "@/components/organisms/quiz/AnalyzeQuizDialog";

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAnalyzeDialog, setShowAnalyzeDialog] = useState(false);

  // Fetch quiz and questions
  const {
    data: quizResponse,
    isLoading: isLoadingQuiz,
    error: quizError,
  } = useQuizById(quizId);

  const { data: questionsResponse, isLoading: isLoadingQuestions } =
    useQuizQuestions(quizId, true); // includeAnswers = true for owner

  const deleteQuizMutation = useDeleteQuiz();
  const updateVisibilityMutation = useUpdateVisibility();

  const quiz = quizResponse?.data ?? null;

  const questions = questionsResponse?.data?.questions || [];

  const handleEdit = () => {
    router.push(`/dashboard/quiz/${quizId}/edit`);
  };

  const handleDuplicate = () => {
    router.push(`/dashboard/quiz/new?duplicateFrom=${quizId}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      await deleteQuizMutation.mutateAsync(quizId);
      toast.success("Đã xóa đề thi thành công!");
      router.push("/dashboard/library?tab=quizzes");
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Không thể xóa đề thi. Vui lòng thử lại!");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleToggleVisibility = async () => {
    if (!quiz) return;
    const isCommunity = quiz.visibility === "community";
    const next = isCommunity ? "private" : "community";
    setIsUpdatingVisibility(true);
    try {
      await updateVisibilityMutation.mutateAsync({
        id: quizId,
        visibility: next,
      });
      toast.success(
        next === "community"
          ? "Đã công khai đề thi!"
          : "Đã đặt đề thi thành riêng tư!"
      );
    } catch {
      toast.error("Không thể cập nhật quyền hiển thị. Vui lòng thử lại!");
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  if (isLoadingQuiz || isLoadingQuestions) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Đang tải đề thi...</span>
      </div>
    );
  }

  if (quizError || !quiz) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Không tìm thấy đề thi
        </h3>
        <p className="text-gray-600 mb-4">
          Đề thi không tồn tại hoặc bạn không có quyền truy cập
        </p>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  const getDifficultyColor = (difficulty?: string) => {
    const colors = {
      easy: "bg-green-500 text-white border-0 rounded-sm",
      medium: "bg-yellow-500 text-white border-0 rounded-sm",
      hard: "bg-red-500 text-white border-0 rounded-sm",
    };
    return (
      colors[difficulty as keyof typeof colors] ||
      "bg-gray-400 text-white border-0 rounded-sm"
    );
  };

  const renderDifficultyText = (difficulty?: string) => {
    if (!difficulty) return null;
    const texts: { [key: string]: string } = {
      easy: "Dễ",
      medium: "Trung bình",
      hard: "Khó",
    };
    return texts[difficulty] || difficulty;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ActionButton
        isBack
        label="Danh sách đề thi"
        href="/dashboard/library?tab=quizzes"
      />
      <div className="flex flex-wrap items-start justify-between gap-4 mt-2">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
            {quiz.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-sm text-gray-900 font-bold">
              {quiz.subject} • Lớp {quiz.grade || "Không xác định"}
            </span>
            {quiz.difficulty && (
              <Badge className={getDifficultyColor(quiz.difficulty)}>
                {renderDifficultyText(quiz.difficulty)}
              </Badge>
            )}

            {quiz.visibility === "community" && (
              <Badge className="bg-green-500 text-white border-0 rounded-sm">
                Công khai
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={quiz.visibility === "community" ? "outline" : "default"}
            onClick={handleToggleVisibility}
            disabled={isUpdatingVisibility}
          >
            {isUpdatingVisibility ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : quiz.visibility === "community" ? (
              <Lock className="w-4 h-4 mr-2" />
            ) : (
              <Globe className="w-4 h-4 mr-2" />
            )}
            <span className="hidden sm:inline">
              {quiz.visibility === "community" ? "Đặt riêng tư" : "Công khai"}
            </span>
            <span className="sm:hidden">
              {quiz.visibility === "community" ? "Riêng tư" : "Công khai"}
            </span>
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Chỉnh sửa</span>
          </Button>
          <Button variant="outline" onClick={handleDuplicate}>
            <Copy className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Sao chép</span>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteClick}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin sm:mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">Xóa</span>
          </Button>
        </div>
      </div>

      {/* button Analyze quiz */}
      <Button onClick={() => setShowAnalyzeDialog(true)}>
        <Sparkles className="w-4 h-4 mr-2" />
        Phân tích đề thi với AI
      </Button>

      {/* Quiz Info Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Thông tin đề thi
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Tổng số câu hỏi</p>
            <p className="text-2xl font-bold text-gray-900">
              {quiz.question_count}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Thời gian</p>
            <p className="text-2xl font-bold text-gray-900">
              {quiz.duration || "N/A"} phút
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Mã đề</p>
            <p className="text-lg font-semibold text-gray-900">
              {quiz.exam_code || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Ngày tạo</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(quiz.created_at).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {quiz.description && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Mô tả</h3>
            <p className="text-gray-700">{quiz.description}</p>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Danh sách câu hỏi ({questions.length})
        </h2>

        {questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Chưa có câu hỏi nào</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{question.type}</Badge>
                      <span className="text-sm text-gray-600">
                        {question.point} điểm
                      </span>
                    </div>
                    <LaTeXRenderer
                      content={question.content}
                      className="mb-4 text-gray-900"
                    />

                    {/* Options */}
                    {question.options && question.options.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {question.options.map((option, optIndex) => {
                          const optionText =
                            typeof option === "string" ? option : option.text;
                          const isCorrect = Array.isArray(
                            question.correct_answer
                          )
                            ? question.correct_answer.includes(optionText) ||
                              question.correct_answer.includes(
                                String.fromCharCode(65 + optIndex)
                              )
                            : question.correct_answer === optionText ||
                              question.correct_answer ===
                                String.fromCharCode(65 + optIndex);

                          return (
                            <div
                              key={optIndex}
                              className={`flex items-center gap-2 p-3 rounded-lg ${
                                isCorrect
                                  ? "bg-green-50 border border-green-200"
                                  : "bg-gray-50"
                              }`}
                            >
                              <span className="font-medium text-gray-700">
                                {String.fromCharCode(65 + optIndex)}.
                              </span>
                              <LaTeXRenderer
                                content={optionText}
                                className="text-gray-800 flex-1"
                                as="span"
                              />
                              {isCorrect && (
                                <Badge className="ml-auto bg-green-600">
                                  Đáp án đúng
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Explanation */}
                    {question.explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          Giải thích:
                        </p>
                        <LaTeXRenderer
                          content={question.explanation}
                          className="text-sm text-blue-800"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        title="Xóa đề thi"
        description="Bạn có chắc chắn muốn xóa đề thi này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
      />

      <AnalyzeQuizDialog
        open={showAnalyzeDialog}
        onOpenChange={setShowAnalyzeDialog}
        quizId={quizId}
        quizTitle={quiz.title}
      />
    </div>
  );
}
