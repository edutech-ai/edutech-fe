/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuizInfoTab } from "@/components/organisms/quiz/QuizInfoTab";
import { QuestionListTab } from "@/components/organisms/quiz/QuestionListTab";
import { PDFPreview } from "@/components/features/quiz-generator/PDFPreview";
import type { Quiz, UpdateQuizRequest } from "@/types/quiz";
import type { Question } from "@/types/question";
import type { QuestionUI } from "@/types";
import { toast } from "sonner";
import {
  useQuizById,
  useQuizQuestions,
  useUpdateQuiz,
} from "@/services/quizService";
import {
  useBulkCreateQuestions,
  useDeleteQuestionsByQuizId,
} from "@/services/questionService";
import { ActionButton } from "@/components/molecules/action-button";

export default function QuizEditPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [activeTab, setActiveTab] = useState("info");
  const [isSaving, setIsSaving] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // API hooks
  const { data: quizResponse, isLoading: isLoadingQuiz } = useQuizById(quizId);
  const { data: questionsResponse, isLoading: isLoadingQuestions } =
    useQuizQuestions(quizId, true);

  const updateQuizMutation = useUpdateQuiz();
  const bulkCreateQuestionsMutation = useBulkCreateQuestions();
  const deleteQuestionsMutation = useDeleteQuestionsByQuizId();

  // Quiz state (Quiz + questions array in UI format)
  const [quiz, setQuiz] = useState<Partial<Quiz> & { questions: QuestionUI[] }>(
    {
      title: "",
      description: "",
      subject: "",
      grade: undefined,
      duration: 60,
      difficulty: "medium",
      status: "draft",
      questions: [],
    }
  );

  // Convert backend Question to UI format
  const convertToUIQuestion = (q: Question): QuestionUI => {
    // Convert options to string array (QuestionOption can be string or {id, text})
    const convertedOptions = q.options?.map((opt) =>
      typeof opt === "string" ? opt : opt.text
    );

    let correctAnswer: number | string | undefined;
    let correctAnswers: number[] | undefined;

    if (q.type === "TRUE_FALSE") {
      // TRUE_FALSE: correct_answer is 0 (false) or 1 (true), can be number or string
      const parsed =
        typeof q.correct_answer === "number"
          ? q.correct_answer
          : parseInt(String(q.correct_answer), 10);
      correctAnswer = isNaN(parsed) ? 0 : parsed;
    } else if (q.type === "ESSAY") {
      // ESSAY: correct_answer is a string
      correctAnswer = String(q.correct_answer ?? "");
    } else if (q.type === "MULTIPLE_ANSWER" && convertedOptions) {
      // MULTIPLE_ANSWER: correct_answer is an array of option texts
      const answers = Array.isArray(q.correct_answer)
        ? q.correct_answer
        : [q.correct_answer];
      correctAnswers = answers
        .map((ans) => convertedOptions.findIndex((opt) => opt === ans))
        .filter((idx) => idx >= 0);
    } else if (convertedOptions && q.correct_answer !== undefined) {
      // MCQ: find index of correct answer in options
      const correctAnswerIndex = convertedOptions.findIndex(
        (opt) => opt === q.correct_answer
      );
      correctAnswer = correctAnswerIndex >= 0 ? correctAnswerIndex : 0;
    }

    return {
      id: q.id,
      type: q.type,
      content: q.content,
      options: convertedOptions,
      correctAnswer,
      correctAnswers,
      points: q.point,
      difficulty: q.difficulty,
      explanation: q.explanation ?? undefined,
    };
  };

  // Load quiz data when fetched
  useEffect(() => {
    if (quizResponse?.data && questionsResponse?.data && !isLoaded) {
      const backendQuiz = quizResponse.data;
      const backendQuestions = questionsResponse.data.questions;

      setQuiz({
        ...backendQuiz,
        // Convert backend questions to UI format
        questions: backendQuestions.map(convertToUIQuestion),
      });

      setIsLoaded(true);
    }
  }, [quizResponse, questionsResponse, isLoaded]);

  const handleSave = async (isDraft: boolean = true) => {
    // Validation
    if (!quiz.title?.trim()) {
      toast.error("Vui lòng nhập tên đề thi");
      setActiveTab("info");
      return;
    }

    if (!isDraft && (!quiz.questions || quiz.questions.length === 0)) {
      toast.error("Vui lòng thêm ít nhất một câu hỏi trước khi xuất bản");
      setActiveTab("questions");
      return;
    }

    setIsSaving(true);

    try {
      // Step 1: Update quiz info
      const updateData: UpdateQuizRequest = {
        title: quiz.title,
        description: quiz.description ?? undefined,
        difficulty: quiz.difficulty,
        subject: quiz.subject,
        grade: quiz.grade,
        duration: quiz.duration,
        status: isDraft ? "draft" : "public",
      };

      await updateQuizMutation.mutateAsync({
        id: quizId,
        data: updateData,
      });

      // Step 2: Delete all old questions
      await deleteQuestionsMutation.mutateAsync(quizId);

      // Step 3: Create new questions
      if (quiz.questions && quiz.questions.length > 0) {
        await bulkCreateQuestionsMutation.mutateAsync({
          quiz_id: quizId,
          questions: quiz.questions.map((q) => {
            let correct_answer: string | string[];

            if (q.type === "TRUE_FALSE") {
              // TRUE_FALSE: send as string "0" or "1"
              correct_answer = String(
                typeof q.correctAnswer === "number" ? q.correctAnswer : 0
              );
            } else if (q.type === "ESSAY") {
              // ESSAY: send as string
              correct_answer = String(q.correctAnswer ?? "");
            } else if (
              q.type === "MULTIPLE_ANSWER" &&
              q.correctAnswers &&
              q.options
            ) {
              // MULTIPLE_ANSWER: convert array of indices to array of option texts
              correct_answer = q.correctAnswers
                .map((idx) => q.options![idx])
                .filter(Boolean);
            } else if (typeof q.correctAnswer === "number" && q.options) {
              // MCQ: convert index to option text
              correct_answer = q.options[q.correctAnswer] ?? "";
            } else {
              correct_answer = String(q.correctAnswer ?? "");
            }

            return {
              content: q.content,
              options: q.options ?? undefined,
              correct_answer,
              type: q.type as
                | "MCQ"
                | "MULTIPLE_ANSWER"
                | "TRUE_FALSE"
                | "ESSAY",
              point: q.points,
              explanation: q.explanation ?? undefined,
            };
          }),
        });

        toast.success(
          `Đã cập nhật đề thi với ${quiz.questions.length} câu hỏi!`
        );
      } else {
        toast.success("Đã cập nhật đề thi thành công!");
      }

      // Navigate back to detail page
      router.push(`/dashboard/quiz/${quizId}`);
    } catch (error: any) {
      console.error("Error updating quiz:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi cập nhật đề thi";

      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = () => {
    if (!quiz.title?.trim()) {
      toast.error("Vui lòng nhập tên đề thi trước khi xuất PDF");
      return;
    }
    if (!quiz.questions || quiz.questions.length === 0) {
      toast.warning("Chưa có câu hỏi nào để xuất PDF");
      return;
    }
    setShowPDFPreview(true);
  };

  const updateQuizInfo = (updates: Partial<Quiz>) => {
    setQuiz((prev) => ({ ...prev, ...updates }));
  };

  const updateQuestions = (questions: QuestionUI[]) => {
    setQuiz((prev) => ({ ...prev, questions }));
  };

  // Prepare data for PDF export
  const examInfo = {
    name: quiz.title || "Đề thi",
    subject: quiz.subject || "",
    grade: quiz.grade || 0,
    durationMinutes: quiz.duration || 60,
    totalScore:
      quiz.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0,
    instructions: quiz.description ?? undefined,
  };

  const pdfQuestions = (quiz.questions || []).map((q, index) => ({
    id: q.id || `q${index + 1}`,
    order: index + 1,
    content: q.content,
    type: q.type,
    answers: q.options,
    points: q.points,
  }));

  if (isLoadingQuiz || isLoadingQuestions || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full mx-auto">
      <ActionButton
        label="Quay lại đề thi"
        href={`/dashboard/quiz/${quizId}`}
        isBack={true}
      />
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {quiz.title || "Chỉnh sửa đề thi"}
            </h1>
            <p className="text-gray-600 text-sm">Chỉnh sửa thông tin đề thi</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            Xuất PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave(true)}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? "Đang lưu..." : "Lưu bản nháp"}
          </Button>
          <Button onClick={() => handleSave(false)} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật đề thi"
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="info">Thông tin đề thi</TabsTrigger>
          <TabsTrigger value="questions">
            Danh sách câu hỏi ({quiz.questions?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <QuizInfoTab quiz={quiz} onUpdate={updateQuizInfo} />
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <QuestionListTab
            questions={quiz.questions || []}
            onUpdate={updateQuestions}
          />
        </TabsContent>
      </Tabs>

      {/* PDF Preview Modal */}
      <PDFPreview
        examInfo={examInfo}
        questions={pdfQuestions}
        open={showPDFPreview}
        onClose={() => setShowPDFPreview(false)}
      />
    </div>
  );
}
