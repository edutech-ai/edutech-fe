/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { stripHtmlToLatex } from "@/lib/html-sanitizer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuizInfoTab } from "@/components/organisms/quiz/QuizInfoTab";
import { QuestionListTab } from "@/components/organisms/quiz/QuestionListTab";
import { PDFPreview } from "@/components/features/quiz-generator/PDFPreview";
import type { Quiz, CreateQuizRequest } from "@/types/quiz";
import type { Question, Difficulty } from "@/types/question";
import type { QuestionUI } from "@/types";
import { toast } from "sonner";
import {
  useCreateQuiz,
  useDeleteQuiz,
  useQuizById,
  useQuizQuestions,
} from "@/services/quizService";
import { useBulkCreateQuestions } from "@/services/questionService";
import { QuizNewTour } from "@/components/organisms/tour-guide/quiz-new-tour";

export default function QuizNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // MANUAL or AI
  // const type = searchParams.get("type");
  const aiGenRequestId = searchParams.get("aiGenRequestId");
  const duplicateFromId = searchParams.get("duplicateFrom");

  const [activeTab, setActiveTab] = useState("info");
  const [isSaving, setIsSaving] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  // API mutations
  const createQuizMutation = useCreateQuiz();
  const deleteQuizMutation = useDeleteQuiz();
  const bulkCreateQuestionsMutation = useBulkCreateQuestions();

  // Fetch quiz for duplication
  const { data: duplicateQuizResponse } = useQuizById(
    duplicateFromId || undefined,
    {
      enabled: !!duplicateFromId,
    }
  );
  const { data: duplicateQuestionsResponse } = useQuizQuestions(
    duplicateFromId || undefined,
    true,
    { enabled: !!duplicateFromId }
  );

  // Quiz state (Quiz + questions array)
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

    const resolveOptionIndex = (ans: string): number => {
      if (!convertedOptions) return -1;
      let idx = convertedOptions.findIndex((opt) => opt === ans);
      if (idx === -1 && /^[A-Za-z]$/.test(ans)) {
        const letterIdx = ans.toUpperCase().charCodeAt(0) - 65;
        if (letterIdx >= 0 && letterIdx < convertedOptions.length)
          idx = letterIdx;
      }
      return idx;
    };

    let correctAnswer: number | string | undefined = undefined;
    let correctAnswers: number[] | undefined = undefined;

    if (q.type === "MULTIPLE_ANSWER" && Array.isArray(q.correct_answer)) {
      correctAnswers = (q.correct_answer as string[])
        .map(resolveOptionIndex)
        .filter((idx) => idx !== -1);
    } else if (q.type === "TRUE_FALSE") {
      const val = String(q.correct_answer);
      correctAnswer = val === "1" ? 1 : 0;
    } else if (q.type === "ESSAY") {
      correctAnswer =
        typeof q.correct_answer === "string" ? q.correct_answer : "";
    } else if (convertedOptions) {
      if (typeof q.correct_answer === "number") {
        const idx = q.correct_answer;
        correctAnswer =
          idx >= 0 && idx < convertedOptions.length ? idx : undefined;
      } else if (typeof q.correct_answer === "string") {
        const idx = resolveOptionIndex(q.correct_answer);
        correctAnswer = idx >= 0 ? idx : undefined;
      }
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

  // Load quiz for duplication
  useEffect(() => {
    if (
      duplicateFromId &&
      duplicateQuizResponse?.data &&
      duplicateQuestionsResponse?.data
    ) {
      const sourceQuiz = duplicateQuizResponse.data;
      const sourceQuestions = duplicateQuestionsResponse.data.questions;

      setQuiz({
        title: `${sourceQuiz.title} (Copy)`,
        description: sourceQuiz.description || "",
        subject: sourceQuiz.subject,
        grade: sourceQuiz.grade,
        duration: sourceQuiz.duration,
        difficulty: sourceQuiz.difficulty,
        status: "draft", // Always draft for duplicates
        // Convert backend questions to UI format
        questions: sourceQuestions.map(convertToUIQuestion),
      });

      toast.success("Đã tải dữ liệu để sao chép!");
    }
  }, [duplicateFromId, duplicateQuizResponse, duplicateQuestionsResponse]);

  // Load AI-generated quiz if aiGenRequestId exists
  useEffect(() => {
    if (aiGenRequestId) {
      // TODO: Fetch AI-generated quiz by ID
      // Mock data with 10 Math questions for grade 9 - Circle theory
      setQuiz({
        title: "Đề kiểm tra Toán lớp 9 - Đường tròn",
        description:
          "Kiểm tra lý thuyết về góc nội tiếp, tứ giác nội tiếp và tam giác đồng dạng",
        subject: "Toán",
        grade: 9,
        duration: 45,
        questions: [
          {
            id: "q1",
            type: "SINGLE_CHOICE",
            content:
              "Góc ở tâm chắn cùng một cung với góc nội tiếp thì có số đo:",
            options: [
              "Bằng góc nội tiếp",
              "Lớn hơn góc nội tiếp",
              "Gấp đôi góc nội tiếp",
              "Bằng nửa góc nội tiếp",
            ],
            correctAnswer: 2,
            points: 0.5,
            difficulty: "RECOGNITION",
            explanation:
              "Góc ở tâm có số đo bằng số đo cung bị chắn, góc nội tiếp có số đo bằng nửa số đo cung bị chắn. Vậy góc ở tâm gấp đôi góc nội tiếp cùng chắn một cung.",
            quiz_id: "",
            is_deleted: false,
            created_at: "",
            updated_at: "",
          },
          {
            id: "q2",
            type: "SINGLE_CHOICE",
            content: "Số đo góc nội tiếp bằng:",
            options: [
              "Số đo cung bị chắn",
              "Nửa số đo cung bị chắn",
              "Gấp đôi số đo cung bị chắn",
              "Tổng hai cung kề",
            ],
            correctAnswer: 1,
            points: 0.5,
            difficulty: "RECOGNITION",
            explanation:
              "Định lý: Trong một đường tròn, số đo góc nội tiếp bằng nửa số đo cung bị chắn.",
            quiz_id: "",
            is_deleted: false,
            created_at: "",
            updated_at: "",
          },
          {
            id: "q3",
            type: "SINGLE_CHOICE",
            content: "Góc nội tiếp chắn nửa đường tròn có số đo:",
            options: ["30 độ", "45 độ", "60 độ", "90 độ"],
            correctAnswer: 3,
            points: 0.5,
            difficulty: "RECOGNITION",
            explanation:
              "Nửa đường tròn có số đo 180°. Góc nội tiếp chắn nửa đường tròn có số đo = 180°/2 = 90°.",
            quiz_id: "",
            is_deleted: false,
            created_at: "",
            updated_at: "",
          },
          {
            id: "q4",
            type: "SINGLE_CHOICE",
            content:
              "Nếu một tứ giác có tổng hai góc đối bằng 180 độ thì tứ giác đó:",
            options: [
              "Là hình thang",
              "Là hình chữ nhật",
              "Nội tiếp được đường tròn",
              "Là hình bình hành",
            ],
            correctAnswer: 2,
            points: 0.5,
            difficulty: "COMPREHENSION",
            explanation:
              "Định lý: Tứ giác nội tiếp đường tròn khi và chỉ khi tổng hai góc đối bằng 180°.",
            quiz_id: "",
            is_deleted: false,
            created_at: "",
            updated_at: "",
          },
          {
            id: "q5",
            type: "SINGLE_CHOICE",
            content:
              "Hai tiếp tuyến của một đường tròn cắt nhau tại một điểm thì:",
            options: [
              "Hai đoạn nối từ điểm đó đến tiếp điểm bằng nhau",
              "Hai đoạn nối đó vuông góc",
              "Hai đoạn nối đó song song",
              "Không có mối liên hệ",
            ],
            correctAnswer: 0,
            points: 0.5,
            difficulty: "COMPREHENSION",
            explanation:
              "Tính chất hai tiếp tuyến cắt nhau: Nếu hai tiếp tuyến của một đường tròn cắt nhau tại một điểm thì điểm đó cách đều hai tiếp điểm.",
            quiz_id: "",
            is_deleted: false,
            created_at: "",
            updated_at: "",
          },
          {
            id: "q6",
            type: "SINGLE_CHOICE",
            content: "Góc tạo bởi tia tiếp tuyến và dây cung bằng:",
            options: [
              "Góc ở tâm chắn cùng cung",
              "Nửa góc ở tâm chắn cùng cung",
              "Góc nội tiếp chắn cùng cung",
              "Hai lần góc nội tiếp chắn cùng cung",
            ],
            correctAnswer: 2,
            points: 0.5,
            difficulty: "COMPREHENSION",
            explanation:
              "Định lý: Góc tạo bởi tia tiếp tuyến và dây cung bằng góc nội tiếp cùng chắn một cung.",
            quiz_id: "",
            is_deleted: false,
            created_at: "",
            updated_at: "",
          },
          {
            id: "q7",
            type: "SINGLE_CHOICE",
            content: "Trong một đường tròn, dây lớn hơn thì:",
            options: [
              "Gần tâm hơn",
              "Xa tâm hơn",
              "Cách đều tâm",
              "Không so sánh được",
            ],
            correctAnswer: 0,
            points: 0.5,
            difficulty: "COMPREHENSION",
            explanation:
              "Định lý: Trong hai dây của một đường tròn, dây nào lớn hơn thì gần tâm hơn và ngược lại.",
            quiz_id: "",
            is_deleted: false,
            created_at: "",
            updated_at: "",
          },
          {
            id: "q8",
            type: "SINGLE_CHOICE",
            content: "Điều kiện đủ để một tứ giác nội tiếp đường tròn là:",
            options: [
              "Có hai cạnh đối song song",
              "Có hai góc đối bằng nhau",
              "Có hai góc kề bù nhau",
              "Có hai góc đối bù nhau",
            ],
            correctAnswer: 3,
            points: 0.5,
            difficulty: "APPLICATION",
            explanation:
              "Dấu hiệu nhận biết tứ giác nội tiếp: Tứ giác có tổng hai góc đối bằng 180° (bù nhau) thì nội tiếp được đường tròn.",
            quiz_id: "",
            is_deleted: false,
            created_at: "",
            updated_at: "",
          },
          {
            id: "q9",
            type: "SINGLE_CHOICE",
            content: "Hai tam giác đồng dạng khi:",
            options: [
              "Có hai cạnh bằng nhau",
              "Có ba góc bằng nhau",
              "Có một góc bằng nhau",
              "Có diện tích bằng nhau",
            ],
            correctAnswer: 1,
            points: 0.5,
            difficulty: "RECOGNITION",
            explanation:
              "Trường hợp đồng dạng g.g.g: Nếu hai tam giác có ba góc tương ứng bằng nhau thì hai tam giác đó đồng dạng.",
            quiz_id: "",
            is_deleted: false,
            created_at: "",
            updated_at: "",
          },
          {
            id: "q10",
            type: "SINGLE_CHOICE",
            content:
              "Nếu một đường thẳng song song với một cạnh của tam giác thì:",
            options: [
              "Tạo ra tam giác bằng tam giác ban đầu",
              "Cắt hai cạnh còn lại theo tỉ lệ bằng nhau",
              "Luôn đi qua trung điểm",
              "Tạo góc vuông với cạnh đó",
            ],
            correctAnswer: 1,
            points: 0.5,
            difficulty: "COMPREHENSION",
            explanation:
              "Định lý Ta-lét: Nếu một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ.",
            quiz_id: "",
            is_deleted: false,
            created_at: "",
            updated_at: "",
          },
        ] as any,
        status: "draft",
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
      // Step 1: Create quiz
      const createData: CreateQuizRequest = {
        title: quiz.title!,
        description: quiz.description || undefined,
        difficulty: quiz.difficulty,
        subject: quiz.subject,
        grade: quiz.grade,
        duration: quiz.duration,
        status: isDraft ? "draft" : "public",
      };

      const quizResponse = await createQuizMutation.mutateAsync(createData);

      if (!quizResponse.success || !quizResponse.data) {
        throw new Error("Failed to create quiz");
      }

      const newQuizId = quizResponse.data.id;

      // Step 2: Create questions if any
      if (quiz.questions && quiz.questions.length > 0) {
        try {
          await bulkCreateQuestionsMutation.mutateAsync({
            quiz_id: newQuizId,
            questions: quiz.questions.map((q) => {
              let correct_answer: string | string[];

              if (q.type === "TRUE_FALSE") {
                correct_answer = String(
                  typeof q.correctAnswer === "number" ? q.correctAnswer : 0
                );
              } else if (q.type === "ESSAY") {
                correct_answer = String(q.correctAnswer ?? "");
              } else if (
                q.type === "MULTIPLE_ANSWER" &&
                q.correctAnswers &&
                q.options
              ) {
                correct_answer = q.correctAnswers
                  .map((idx) => q.options![idx])
                  .filter(Boolean);
              } else if (typeof q.correctAnswer === "number" && q.options) {
                correct_answer = q.options[q.correctAnswer] ?? "";
              } else {
                correct_answer = String(q.correctAnswer ?? "");
              }

              return {
                content: stripHtmlToLatex(q.content),
                options: q.options?.map(stripHtmlToLatex),
                correct_answer: Array.isArray(correct_answer)
                  ? correct_answer.map(stripHtmlToLatex)
                  : stripHtmlToLatex(correct_answer),
                type: q.type as
                  | "MCQ"
                  | "MULTIPLE_ANSWER"
                  | "TRUE_FALSE"
                  | "ESSAY",
                point: q.points,
                difficulty: q.difficulty as Difficulty,
                explanation: q.explanation
                  ? stripHtmlToLatex(q.explanation)
                  : undefined,
              };
            }),
          });
        } catch (questionError: any) {
          try {
            await deleteQuizMutation.mutateAsync(newQuizId);
          } catch {
            // ignore rollback error
          }

          const errorData = questionError?.response?.data;
          let errorMessage = "Câu hỏi không hợp lệ, vui lòng kiểm tra lại";
          if (errorData?.errors?.length > 0) {
            const firstError = errorData.errors[0];
            if (firstError.path?.includes("correct_answer")) {
              const match = firstError.path.match(/questions\[(\d+)\]/);
              const qNum = match ? Number(match[1]) + 1 : null;
              errorMessage = qNum
                ? `Câu hỏi số ${qNum} chưa có đáp án đúng`
                : "Có câu hỏi chưa có đáp án đúng";
            } else {
              errorMessage =
                firstError.msg || errorData.message || errorMessage;
            }
          } else if (errorData?.message) {
            errorMessage = errorData.message;
          } else if (questionError?.message) {
            errorMessage = questionError.message;
          }

          toast.error(errorMessage);
          return;
        }

        toast.success(
          isDraft
            ? `Đã lưu bản nháp với ${quiz.questions.length} câu hỏi!`
            : `Đã xuất bản đề thi với ${quiz.questions.length} câu hỏi!`
        );
      } else {
        toast.success(
          isDraft
            ? "Đã lưu bản nháp thành công!"
            : "Đã xuất bản đề thi thành công!"
        );
      }

      // Navigate to library
      router.push("/dashboard/library?tab=quizzes");
    } catch (error: any) {
      console.error("Error saving quiz:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi lưu đề thi";

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

  return (
    <div className="space-y-6 w-full mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {quiz.title || "Tạo đề thi mới"}
            </h1>
            <p className="text-gray-600 text-sm">
              {duplicateFromId
                ? "Sao chép từ đề thi có sẵn"
                : aiGenRequestId
                  ? "Chỉnh sửa đề thi được tạo bởi AI"
                  : "Tạo đề thi thủ công"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div data-tour="quiz-actions" className="flex items-center gap-2">
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
                Đang xuất bản...
              </>
            ) : (
              "Xuất bản đề thi"
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          data-tour="quiz-tabs"
          className="grid w-full max-w-md grid-cols-2"
        >
          <TabsTrigger data-tour="tab-info" value="info">
            Thông tin đề thi
          </TabsTrigger>
          <TabsTrigger data-tour="tab-questions" value="questions">
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

      {/* Tour Guide */}
      <QuizNewTour />
    </div>
  );
}
