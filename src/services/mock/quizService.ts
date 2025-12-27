import {
  Quiz,
  Question,
  QuizGenerateRequest,
  QuestionType,
  Difficulty,
  QuizStatus,
} from "@/types";
import { mockQuizzes } from "@/mock-data";
import { mockApiResponse, delay } from "./mockApi";

// Mock AI generation
const generateMockQuestions = (request: QuizGenerateRequest): Question[] => {
  const questions: Question[] = [];

  for (let i = 0; i < request.numQuestions; i++) {
    const type =
      request.questionTypes[i % request.questionTypes.length] ||
      QuestionType.MULTIPLE_CHOICE;

    questions.push({
      id: `q-${Date.now()}-${i}`,
      type,
      content: `Câu hỏi ${i + 1} về ${request.topic}`,
      options:
        type === QuestionType.MULTIPLE_CHOICE
          ? ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"]
          : undefined,
      correctAnswer: type === QuestionType.MULTIPLE_CHOICE ? 0 : "Đáp án mẫu",
      explanation: `Giải thích cho câu ${i + 1}`,
      points: type === QuestionType.ESSAY ? 2 : 1,
      difficulty:
        request.difficulty === Difficulty.MIXED
          ? [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD][i % 3]
          : request.difficulty,
      tags: [request.subject, request.topic],
    });
  }

  return questions;
};

export const quizMockService = {
  getAll: async (): Promise<Quiz[]> => {
    return mockApiResponse(mockQuizzes);
  },

  getById: async (id: string): Promise<Quiz | undefined> => {
    const quiz = mockQuizzes.find((q) => q.id === id);
    return mockApiResponse(quiz);
  },

  create: async (quiz: Partial<Quiz>): Promise<Quiz> => {
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: quiz.title || "Đề thi mới",
      description: quiz.description,
      subject: quiz.subject || "Toán",
      grade: quiz.grade || 9,
      totalQuestions: quiz.questions?.length || 0,
      totalPoints: quiz.questions?.reduce((sum, q) => sum + q.points, 0) || 0,
      duration: quiz.duration,
      questions: quiz.questions || [],
      status: quiz.status || QuizStatus.DRAFT,
      createdBy: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: quiz.tags,
    };

    return mockApiResponse(newQuiz);
  },

  update: async (id: string, quiz: Partial<Quiz>): Promise<Quiz> => {
    const existing = mockQuizzes.find((q) => q.id === id);
    if (!existing) throw new Error("Quiz not found");

    const updated: Quiz = {
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
  generateQuiz: async (request: QuizGenerateRequest): Promise<Question[]> => {
    // Simulate AI thinking time
    await delay(2500);

    const questions = generateMockQuestions(request);
    return mockApiResponse(questions, 0); // No additional delay
  },

  clone: async (id: string): Promise<Quiz> => {
    const original = mockQuizzes.find((q) => q.id === id);
    if (!original) throw new Error("Quiz not found");

    const cloned: Quiz = {
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
