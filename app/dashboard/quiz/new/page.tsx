/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuizInfoTab } from "@/components/organisms/quiz/QuizInfoTab";
import { QuestionListTab } from "@/components/organisms/quiz/QuestionListTab";
import { PDFPreview } from "@/components/features/quiz-generator/PDFPreview";
import type { Quiz, Question } from "@/types";
import { QuizStatus } from "@/types";
import { toast } from "sonner";

export default function QuizNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // MANUAL or AI
  // const type = searchParams.get("type");
  const aiGenRequestId = searchParams.get("aiGenRequestId");

  const [activeTab, setActiveTab] = useState("info");
  const [isSaving, setIsSaving] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  // Quiz state
  const [quiz, setQuiz] = useState<Partial<Quiz>>({
    title: "",
    description: "",
    subject: "",
    grade: undefined,
    duration: 60,
    questions: [],
    status: QuizStatus.DRAFT,
    tags: [],
  });

  // Load AI-generated quiz if aiGenRequestId exists
  useEffect(() => {
    if (aiGenRequestId) {
      // TODO: Fetch AI-generated quiz by ID
      // console.log("Loading AI-generated quiz:", aiGenRequestId);
      // Mock data with sample questions
      setQuiz({
        title: "Đề thi Toán học lớp 10 - Được tạo bởi AI",
        description: "Đề kiểm tra về phương trình bậc hai và ứng dụng",
        subject: "Toán",
        grade: 10,
        duration: 60,
        questions: [
          {
            id: "q1",
            type: "SINGLE_CHOICE" as any,
            content: "Phương trình bậc hai có dạng tổng quát là gì?",
            options: [
              "ax + b = 0",
              "ax² + bx + c = 0",
              "ax³ + bx² + cx + d = 0",
              "ax² + b = 0",
            ],
            correctAnswer: 1,
            points: 1,
            difficulty: "RECOGNITION" as any,
          },
          {
            id: "q2",
            type: "SINGLE_CHOICE" as any,
            content:
              "Delta (Δ) của phương trình ax² + bx + c = 0 được tính bằng công thức nào?",
            options: ["b² - 4ac", "b² + 4ac", "b - 4ac", "b + 4ac"],
            correctAnswer: 0,
            points: 1.5,
            difficulty: "COMPREHENSION" as any,
          },
        ],
        status: QuizStatus.DRAFT,
        tags: [],
      });
    }
  }, [aiGenRequestId]);

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
      // const quizData = {
      //   ...quiz,
      //   status: isDraft ? QuizStatus.DRAFT : QuizStatus.PUBLISHED,
      // };

      // TODO: Call API to save quiz
      // console.log("Saving quiz:", quizData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        isDraft
          ? "Đã lưu bản nháp thành công!"
          : "Đã xuất bản đề thi thành công!"
      );

      router.push("/dashboard/library?tab=quizzes");
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Có lỗi xảy ra khi lưu đề thi");
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

  const updateQuestions = (questions: Question[]) => {
    setQuiz((prev) => ({ ...prev, questions }));
  };

  // Prepare data for PDF export
  const examInfo = {
    name: quiz.title || "Đề thi",
    subject: quiz.subject || "",
    grade: quiz.grade || 0,
    durationMinutes: quiz.duration || 60,
    totalScore:
      quiz.totalPoints ||
      quiz.questions?.reduce((sum, q) => sum + (q.points || 0), 0) ||
      0,
    instructions: quiz.description,
  };

  const pdfQuestions = (quiz.questions || []).map((q, index) => ({
    id: q.id || `q${index + 1}`,
    order: index + 1,
    content: q.content,
    type: q.type,
    answers: q.options,
    correctAnswer: q.correctAnswer,
    points: q.points,
  }));

  return (
    <div className="space-y-6 w-full mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {quiz.title || "Tạo đề thi mới"}
            </h1>
            <p className="text-gray-600 text-sm">
              {aiGenRequestId
                ? "Chỉnh sửa đề thi được tạo bởi AI"
                : "Tạo đề thi thủ công"}
            </p>
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
            <Save className="w-4 h-4 mr-2" />
            Lưu bản nháp
          </Button>
          <Button onClick={() => handleSave(false)} disabled={isSaving}>
            Xuất bản đề thi
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
