/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  Quiz,
  QuizWithDetails,
  QuizApiResponse,
  QuizListResponse,
  CreateQuizRequest,
  UpdateQuizRequest,
  QuizQueryParams,
  QuizStats,
  QuizQuestionsResponse,
} from "@/types";

// ==================== QUERY KEYS ====================
export const QUIZ_KEYS = {
  all: ["quizzes"] as const,
  lists: () => [...QUIZ_KEYS.all, "list"] as const,
  list: (filters: QuizQueryParams) => [...QUIZ_KEYS.lists(), filters] as const,
  myQuizzes: (filters: QuizQueryParams) =>
    [...QUIZ_KEYS.all, "my-quizzes", filters] as const,
  publicQuizzes: (filters: QuizQueryParams) =>
    [...QUIZ_KEYS.all, "public", filters] as const,
  details: () => [...QUIZ_KEYS.all, "detail"] as const,
  detail: (id: string) => [...QUIZ_KEYS.details(), id] as const,
  stats: (id: string) => [...QUIZ_KEYS.all, "stats", id] as const,
  questions: (id: string) => [...QUIZ_KEYS.all, "questions", id] as const,
  byExamCode: (examCode: string) =>
    [...QUIZ_KEYS.all, "exam-code", examCode] as const,
};

// ==================== QUERY HOOKS ====================

/**
 * Get quizzes created by current teacher
 */
export const useMyQuizzes = (
  filters: QuizQueryParams = {},
  options?: any
): UseQueryResult<QuizListResponse, AxiosError> => {
  return useQuery({
    queryKey: QUIZ_KEYS.myQuizzes(filters),
    queryFn: async () => {
      const { data } = await axiosInstance.get<QuizListResponse>(
        API_ENDPOINTS.QUIZ.MY_QUIZZES,
        { params: filters }
      );
      return data;
    },
    ...options,
  });
};

/**
 * Get public quizzes
 */
export const usePublicQuizzes = (
  filters: QuizQueryParams = {},
  options?: any
): UseQueryResult<QuizListResponse, AxiosError> => {
  return useQuery({
    queryKey: QUIZ_KEYS.publicQuizzes(filters),
    queryFn: async () => {
      const { data } = await axiosInstance.get<QuizListResponse>(
        API_ENDPOINTS.QUIZ.PUBLIC,
        { params: filters }
      );
      return data;
    },
    ...options,
  });
};

/**
 * Get quiz by ID with details
 */
export const useQuizById = (
  id?: string,
  options?: any
): UseQueryResult<QuizApiResponse<QuizWithDetails>, AxiosError> => {
  return useQuery({
    queryKey: QUIZ_KEYS.detail(id!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        QuizApiResponse<QuizWithDetails>
      >(API_ENDPOINTS.QUIZ.BY_ID(id!));
      return data;
    },
    enabled: !!id,
    ...options,
  });
};

/**
 * Get quiz by exam code
 */
export const useQuizByExamCode = (
  examCode?: string,
  options?: any
): UseQueryResult<QuizApiResponse<Quiz>, AxiosError> => {
  return useQuery({
    queryKey: QUIZ_KEYS.byExamCode(examCode!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<QuizApiResponse<Quiz>>(
        API_ENDPOINTS.QUIZ.BY_EXAM_CODE(examCode!)
      );
      return data;
    },
    enabled: !!examCode,
    ...options,
  });
};

/**
 * Get quiz questions
 */
export const useQuizQuestions = (
  id?: string,
  includeAnswers: boolean = false,
  options?: any
): UseQueryResult<QuizQuestionsResponse, AxiosError> => {
  return useQuery({
    queryKey: [...QUIZ_KEYS.questions(id!), includeAnswers],
    queryFn: async () => {
      const { data } = await axiosInstance.get<QuizQuestionsResponse>(
        API_ENDPOINTS.QUIZ.QUESTIONS(id!),
        { params: { includeAnswers: includeAnswers ? "true" : "false" } }
      );
      return data;
    },
    enabled: !!id,
    ...options,
  });
};

/**
 * Get quiz statistics
 */
export const useQuizStats = (
  id?: string,
  options?: any
): UseQueryResult<QuizApiResponse<QuizStats>, AxiosError> => {
  return useQuery({
    queryKey: QUIZ_KEYS.stats(id!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<QuizApiResponse<QuizStats>>(
        API_ENDPOINTS.QUIZ.STATS(id!)
      );
      return data;
    },
    enabled: !!id,
    ...options,
  });
};

// ==================== MUTATION HOOKS ====================

/**
 * Create new quiz
 */
export const useCreateQuiz = (): UseMutationResult<
  QuizApiResponse<Quiz>,
  AxiosError,
  CreateQuizRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateQuizRequest) => {
      const response = await axiosInstance.post<QuizApiResponse<Quiz>>(
        API_ENDPOINTS.QUIZ.BASE,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all quiz lists to refetch
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.all });
    },
  });
};

/**
 * Update quiz
 */
export const useUpdateQuiz = (): UseMutationResult<
  QuizApiResponse<Quiz>,
  AxiosError,
  { id: string; data: UpdateQuizRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateQuizRequest;
    }) => {
      const response = await axiosInstance.put<QuizApiResponse<Quiz>>(
        API_ENDPOINTS.QUIZ.BY_ID(id),
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific quiz detail
      queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.detail(variables.id),
      });
      // Invalidate quiz lists
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.all });
    },
  });
};

/**
 * Delete quiz (soft delete)
 */
export const useDeleteQuiz = (): UseMutationResult<
  QuizApiResponse<void>,
  AxiosError,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete<QuizApiResponse<void>>(
        API_ENDPOINTS.QUIZ.BY_ID(id)
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QUIZ_KEYS.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.all });
    },
  });
};
