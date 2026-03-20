/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { QUIZ_KEYS } from "./quizService";
import type {
  AnalyzeQuizRequest,
  AnalyzeQuizResponse,
} from "@/types/quizAnalysis";

// ==================== TYPES ====================

export interface CreateQuizWithQuestionsRequest {
  title?: string;
  description?: string;
  subject: string;
  grade: number;
  duration?: number;
  difficulty?: "easy" | "medium" | "hard";
  status?: "draft" | "public" | "private";
  topic?: string;
  numberOfQuestions?: number;
  questionTypes?: string[];
  customPrompt?: string;
  quizMatrix?: Record<string, any>;
}

export interface AIGeneratedQuestion {
  id: string;
  quiz_id: string;
  content: string;
  options: string[];
  correct_answer: string;
  type: string;
  point: number;
  explanation?: string;
  difficulty?: string;
}

export interface AIGeneratedQuiz {
  id: string;
  title: string;
  description?: string;
  subject: string;
  grade: number;
  duration?: number;
  difficulty?: string;
  status?: string;
  exam_code?: string;
  question_count: number;
  created_at: string;
}

export interface ValidationErrorData {
  is_test_description: boolean;
  comment: string;
  suggested_fix: string;
  validation_result?: {
    is_test_description: boolean;
    comment: string;
    signals?: Record<string, boolean>;
    confidence?: number;
    suggested_fix: string;
  };
}

export interface CreateQuizWithQuestionsResponse {
  success: boolean;
  message: string;
  data:
    | {
        quiz: AIGeneratedQuiz;
        questions: AIGeneratedQuestion[];
        total: number;
      }
    | ValidationErrorData;
}

export interface ConvertExamRequest {
  file: File;
  title?: string;
  subject?: string;
  grade?: number;
  duration?: number;
}

export interface ConvertedQuestion {
  id: string;
  content: string;
  type: string;
  options?: any[];
  correct_answer: string | string[];
  explanation?: string | null;
  point: number;
  difficulty?: string;
}

export interface ConvertExamResponse {
  success: boolean;
  message: string;
  data: {
    quiz: {
      id: string;
      title: string;
      subject: string;
      grade: number;
      duration: number;
      difficulty: string;
      status: string;
      total_questions: number;
      questions: ConvertedQuestion[];
    };
    document: {
      id: string;
      name: string;
      file_url: string;
    };
    conversionInfo: {
      total_questions: number;
      total_score: number;
      total_minutes: number;
    };
  };
}

// ==================== MUTATION HOOKS ====================

/**
 * Create quiz with AI-generated questions
 */
export const useCreateQuizWithAI = (): UseMutationResult<
  CreateQuizWithQuestionsResponse,
  AxiosError,
  CreateQuizWithQuestionsRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateQuizWithQuestionsRequest) => {
      const response =
        await axiosInstance.post<CreateQuizWithQuestionsResponse>(
          API_ENDPOINTS.AI.CREATE_QUIZ_WITH_QUESTIONS,
          data
        );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate quiz lists to refetch
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.all });
    },
  });
};

/**
 * Convert exam PDF to quiz using AI
 */
export const useConvertExam = (): UseMutationResult<
  ConvertExamResponse,
  AxiosError,
  ConvertExamRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, title, subject, grade, duration }) => {
      const formData = new FormData();
      formData.append("file", file);
      if (title) formData.append("title", title);
      if (subject) formData.append("subject", subject);
      if (grade !== undefined) formData.append("grade", grade.toString());
      if (duration !== undefined)
        formData.append("duration", duration.toString());

      const response = await axiosInstance.post<ConvertExamResponse>(
        API_ENDPOINTS.AI.CONVERT_EXAM,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.all });
    },
  });
};

/**
 * Analyze quiz quality with AI
 */
export const useAnalyzeQuiz = (): UseMutationResult<
  AnalyzeQuizResponse,
  AxiosError,
  AnalyzeQuizRequest
> => {
  return useMutation({
    mutationFn: async (data: AnalyzeQuizRequest) => {
      const response = await axiosInstance.post<AnalyzeQuizResponse>(
        API_ENDPOINTS.AI.ANALYZE_QUIZ,
        data
      );
      return response.data;
    },
  });
};
