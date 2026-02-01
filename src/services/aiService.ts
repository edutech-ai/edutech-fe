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

export interface CreateQuizWithQuestionsResponse {
  success: boolean;
  message: string;
  data: {
    quiz: AIGeneratedQuiz;
    questions: AIGeneratedQuestion[];
    total: number;
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
