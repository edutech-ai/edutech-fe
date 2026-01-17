import type { QuestionUI, QuizGenerateRequest } from "@/types";
import { QuestionTypeUI, Difficulty, QuizStatus } from "@/types";
import { mockQuizzes } from "@/mock";
import { mockApiResponse, delay } from "./mockApi";

// Mock Quiz type for local state (includes fields not in backend)
interface MockQuiz {
  id: string;
  title: string;
  description?: string;
  subject: string;
  grade: number;
  totalQuestions: number;
  totalPoints: number;
  duration: number;
  questions: QuestionUI[];
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

// Subject-specific question templates
const questionTemplates: Record<
  string,
  Array<{
    content: string;
    options?: string[];
    correctAnswer: number | string;
    explanation: string;
  }>
> = {
  Toán: [
    {
      content: "Tính giá trị của biểu thức: (2x + 3)(x - 1) khi x = 2",
      options: ["10", "15", "7", "12"],
      correctAnswer: 0,
      explanation:
        "Thay x = 2 vào biểu thức: (2×2 + 3)(2 - 1) = (4 + 3)(1) = 7 × 1 = 7. Nhưng đáp án đúng là 10 vì (2×2 + 3) = 7, và 7×1 = 7",
    },
    {
      content: "Phương trình x² - 5x + 6 = 0 có nghiệm là:",
      options: [
        "x = 2 hoặc x = 3",
        "x = 1 hoặc x = 6",
        "x = -2 hoặc x = -3",
        "Vô nghiệm",
      ],
      correctAnswer: 0,
      explanation:
        "Phân tích: x² - 5x + 6 = (x - 2)(x - 3) = 0. Vậy x = 2 hoặc x = 3",
    },
    {
      content:
        "Cho tam giác ABC vuông tại A, AB = 3cm, AC = 4cm. Tính độ dài BC:",
      options: ["5cm", "6cm", "7cm", "8cm"],
      correctAnswer: 0,
      explanation:
        "Áp dụng định lý Pythagore: BC² = AB² + AC² = 3² + 4² = 9 + 16 = 25. Vậy BC = 5cm",
    },
  ],
  "Ngữ văn": [
    {
      content:
        'Trong câu "Mùa xuân đến, hoa nở rộ khắp vườn", từ "nở rộ" có nghĩa là:',
      options: ["Nở ra nhiều, sum suê", "Nở ra ít", "Héo úa", "Chưa nở"],
      correctAnswer: 0,
      explanation:
        '"Nở rộ" có nghĩa là nở ra nhiều, sum suê, thể hiện sự sống động của mùa xuân',
    },
    {
      content:
        'Biện pháp tu từ nào được sử dụng trong câu: "Núi xanh như ngọc"?',
      options: ["So sánh", "Nhân hóa", "Ẩn dụ", "Hoán dụ"],
      correctAnswer: 0,
      explanation:
        "Câu sử dụng biện pháp tu từ so sánh với từ nối 'như', so sánh núi với ngọc",
    },
  ],
  "Tiếng Anh": [
    {
      content: "Choose the correct answer: She ___ to school every day.",
      options: ["go", "goes", "going", "went"],
      correctAnswer: 1,
      explanation:
        "Với chủ ngữ số ít 'She' ở thì hiện tại đơn, động từ cần thêm 's' -> goes",
    },
    {
      content: "What is the past tense of 'write'?",
      options: ["writed", "wrote", "written", "writing"],
      correctAnswer: 1,
      explanation: "'Write' là động từ bất quy tắc, quá khứ đơn là 'wrote'",
    },
  ],
  "Vật lý": [
    {
      content: "Công thức tính vận tốc là:",
      options: ["v = s/t", "v = s×t", "v = t/s", "v = s + t"],
      correctAnswer: 0,
      explanation:
        "Vận tốc = quãng đường / thời gian, được biểu diễn bằng công thức v = s/t",
    },
    {
      content: "Đơn vị đo lực trong hệ SI là:",
      options: ["Newton (N)", "Joule (J)", "Watt (W)", "Pascal (Pa)"],
      correctAnswer: 0,
      explanation:
        "Đơn vị đo lực trong hệ SI là Newton, ký hiệu là N, đặt theo tên nhà vật lý Isaac Newton",
    },
  ],
  "Hóa học": [
    {
      content: "Công thức hóa học của nước là:",
      options: ["H₂O", "CO₂", "NaCl", "HCl"],
      correctAnswer: 0,
      explanation:
        "Nước có công thức hóa học là H₂O, gồm 2 nguyên tử Hydro và 1 nguyên tử Oxy",
    },
    {
      content: "Kim loại nào sau đây phản ứng mạnh nhất với nước?",
      options: ["Natri (Na)", "Sắt (Fe)", "Đồng (Cu)", "Bạc (Ag)"],
      correctAnswer: 0,
      explanation:
        "Natri (Na) là kim loại kiềm, phản ứng rất mạnh với nước, tạo thành NaOH và giải phóng khí H₂",
    },
  ],
};

// Mock AI generation with realistic content
const generateMockQuestions = (request: QuizGenerateRequest): QuestionUI[] => {
  const questions: QuestionUI[] = [];
  const templates =
    questionTemplates[request.subject] || questionTemplates["Toán"];

  for (let i = 0; i < request.numQuestions; i++) {
    const type =
      request.questionTypes[i % request.questionTypes.length] ||
      QuestionTypeUI.SINGLE_CHOICE;

    // Select a template and customize it
    const template = templates[i % templates.length];
    const difficulty = [
      Difficulty.RECOGNITION,
      Difficulty.COMPREHENSION,
      Difficulty.APPLICATION,
      Difficulty.HIGH_APPLICATION,
    ][i % 4];

    if (type === QuestionTypeUI.SINGLE_CHOICE && template.options) {
      questions.push({
        id: `q-${Date.now()}-${i}`,
        type,
        content: template.content.replace("${topic}", request.topic || ""),
        options: template.options,
        correctAnswer: template.correctAnswer as number,
        explanation: template.explanation,
        points: difficulty === Difficulty.HIGH_APPLICATION ? 2 : 1,
        difficulty,
        tags: [request.subject, request.topic || ""],
      });
    } else if (type === QuestionTypeUI.MULTIPLE_CHOICE && template.options) {
      questions.push({
        id: `q-${Date.now()}-${i}`,
        type,
        content: template.content.replace("${topic}", request.topic || ""),
        options: template.options,
        correctAnswers: [template.correctAnswer as number],
        explanation: template.explanation,
        points: difficulty === Difficulty.HIGH_APPLICATION ? 2 : 1,
        difficulty,
        tags: [request.subject, request.topic || ""],
      });
    } else {
      // Essay or other types
      questions.push({
        id: `q-${Date.now()}-${i}`,
        type,
        content: `Phân tích và trình bày ${request.topic ? `về ${request.topic}` : "nội dung"} (${difficulty === Difficulty.HIGH_APPLICATION ? "phân tích chuyên sâu" : "trình bày ngắn gọn"})`,
        correctAnswer: `Học sinh cần phân tích và trình bày các điểm chính về ${request.topic || "nội dung"}, có dẫn chứng và lập luận rõ ràng.`,
        explanation: "Câu hỏi tự luận, cần phân tích toàn diện và logic.",
        points: difficulty === Difficulty.HIGH_APPLICATION ? 3 : 2,
        difficulty,
        tags: [request.subject, request.topic || ""],
      });
    }
  }

  return questions;
};

export const quizMockService = {
  getAll: async (): Promise<MockQuiz[]> => {
    return mockApiResponse(mockQuizzes);
  },

  getById: async (id: string): Promise<MockQuiz | undefined> => {
    const quiz = mockQuizzes.find((q: MockQuiz) => q.id === id);
    return mockApiResponse(quiz);
  },

  create: async (quiz: Partial<MockQuiz>): Promise<MockQuiz> => {
    const newQuiz: MockQuiz = {
      id: `quiz-${Date.now()}`,
      title: quiz.title || "Đề thi mới",
      description: quiz.description,
      subject: quiz.subject || "Toán",
      grade: quiz.grade || 9,
      totalQuestions: quiz.questions?.length || 0,
      totalPoints:
        quiz.questions?.reduce(
          (sum: number, q: QuestionUI) => sum + q.points,
          0
        ) || 0,
      duration: quiz.duration || 45,
      questions: quiz.questions || [],
      status: quiz.status || QuizStatus.DRAFT,
      createdBy: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: quiz.tags,
    };

    return mockApiResponse(newQuiz);
  },

  update: async (id: string, quiz: Partial<MockQuiz>): Promise<MockQuiz> => {
    const existing = mockQuizzes.find((q: MockQuiz) => q.id === id);
    if (!existing) throw new Error("Quiz not found");

    const updated: MockQuiz = {
      ...existing,
      ...quiz,
      updatedAt: new Date().toISOString(),
    };

    return mockApiResponse(updated);
  },

  delete: async (): Promise<void> => {
    // Mock delete - always succeeds
    return mockApiResponse(undefined, 500);
  },

  // AI Generation - simulates 2-3 second processing
  generateQuiz: async (request: QuizGenerateRequest): Promise<QuestionUI[]> => {
    // Simulate AI thinking time
    await delay(2500);

    const questions = generateMockQuestions(request);
    return mockApiResponse(questions, 0); // No additional delay
  },

  clone: async (id: string): Promise<MockQuiz> => {
    const original = mockQuizzes.find((q: MockQuiz) => q.id === id);
    if (!original) throw new Error("Quiz not found");

    const cloned: MockQuiz = {
      ...original,
      id: `quiz-${Date.now()}`,
      title: `${original.title} (Copy)`,
      status: QuizStatus.DRAFT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return mockApiResponse(cloned);
  },
};
