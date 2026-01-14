/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  Question,
  QuestionApiResponse,
  QuestionListResponse,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  BulkCreateQuestionsRequest,
  BulkCreateQuestionsResponse,
} from "@/types";
import { QUIZ_KEYS } from "./quizService";

// ==================== QUERY KEYS ====================
export const QUESTION_KEYS = {
  all: ["questions"] as const,
  lists: () => [...QUESTION_KEYS.all, "list"] as const,
  list: (filters: any) => [...QUESTION_KEYS.lists(), filters] as const,
  details: () => [...QUESTION_KEYS.all, "detail"] as const,
  detail: (id: string) => [...QUESTION_KEYS.details(), id] as const,
  byQuizId: (quizId: string) =>
    [...QUESTION_KEYS.all, "by-quiz", quizId] as const,
  byDocumentId: (documentId: string) =>
    [...QUESTION_KEYS.all, "by-document", documentId] as const,
};

// ==================== QUERY HOOKS ====================

/**
 * Get question by ID
 */
export const useQuestionById = (
  id?: string,
  options?: any
): UseQueryResult<QuestionApiResponse<Question>, AxiosError> => {
  return useQuery({
    queryKey: QUESTION_KEYS.detail(id!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<QuestionApiResponse<Question>>(
        API_ENDPOINTS.QUESTION.BY_ID(id!)
      );
      return data;
    },
    enabled: !!id,
    ...options,
  });
};

/**
 * Get questions by quiz ID
 */
export const useQuestionsByQuizId = (
  quizId?: string,
  includeAnswers: boolean = false,
  options?: any
): UseQueryResult<QuestionListResponse, AxiosError> => {
  return useQuery({
    queryKey: [...QUESTION_KEYS.byQuizId(quizId!), includeAnswers],
    queryFn: async () => {
      const { data } = await axiosInstance.get<QuestionListResponse>(
        API_ENDPOINTS.QUESTION.BY_QUIZ_ID(quizId!),
        { params: { includeAnswers: includeAnswers ? "true" : "false" } }
      );
      return data;
    },
    enabled: !!quizId,
    ...options,
  });
};

/**
 * Get questions by document ID
 */
export const useQuestionsByDocumentId = (
  documentId?: string,
  options?: any
): UseQueryResult<QuestionListResponse, AxiosError> => {
  return useQuery({
    queryKey: QUESTION_KEYS.byDocumentId(documentId!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<QuestionListResponse>(
        API_ENDPOINTS.QUESTION.BY_DOCUMENT_ID(documentId!)
      );
      return data;
    },
    enabled: !!documentId,
    ...options,
  });
};

// ==================== MUTATION HOOKS ====================

/**
 * Create new question
 */
export const useCreateQuestion = (): UseMutationResult<
  QuestionApiResponse<Question>,
  AxiosError,
  CreateQuestionRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateQuestionRequest) => {
      const response = await axiosInstance.post<QuestionApiResponse<Question>>(
        API_ENDPOINTS.QUESTION.BASE,
        data
      );
      return response.data;
    },
    onSuccess: (response, variables) => {
      // Invalidate questions for this quiz
      queryClient.invalidateQueries({
        queryKey: QUESTION_KEYS.byQuizId(variables.quiz_id),
      });
      // Invalidate quiz questions endpoint
      queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.questions(variables.quiz_id),
      });
      // Invalidate quiz stats
      queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.stats(variables.quiz_id),
      });
      // Invalidate quiz detail (for question count update)
      queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.detail(variables.quiz_id),
      });
    },
  });
};

/**
 * Bulk create questions
 */
export const useBulkCreateQuestions = (): UseMutationResult<
  BulkCreateQuestionsResponse,
  AxiosError,
  BulkCreateQuestionsRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BulkCreateQuestionsRequest) => {
      const response = await axiosInstance.post<BulkCreateQuestionsResponse>(
        API_ENDPOINTS.QUESTION.BULK,
        data
      );
      return response.data;
    },
    onSuccess: (response, variables) => {
      // Invalidate questions for this quiz
      queryClient.invalidateQueries({
        queryKey: QUESTION_KEYS.byQuizId(variables.quiz_id),
      });
      // Invalidate quiz questions endpoint
      queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.questions(variables.quiz_id),
      });
      // Invalidate quiz stats
      queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.stats(variables.quiz_id),
      });
      // Invalidate quiz detail
      queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.detail(variables.quiz_id),
      });
    },
  });
};

/**
 * Update question
 */
export const useUpdateQuestion = (): UseMutationResult<
  QuestionApiResponse<Question>,
  AxiosError,
  { id: string; data: UpdateQuestionRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateQuestionRequest;
    }) => {
      const response = await axiosInstance.put<QuestionApiResponse<Question>>(
        API_ENDPOINTS.QUESTION.BY_ID(id),
        data
      );
      return response.data;
    },
    onSuccess: (response, variables) => {
      const question = response.data;

      // Invalidate specific question detail
      queryClient.invalidateQueries({
        queryKey: QUESTION_KEYS.detail(variables.id),
      });
      // Invalidate questions for this quiz
      queryClient.invalidateQueries({
        queryKey: QUESTION_KEYS.byQuizId(question.quiz_id),
      });
      // Invalidate quiz questions endpoint
      queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.questions(question.quiz_id),
      });
      // Invalidate quiz stats (points might have changed)
      queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.stats(question.quiz_id),
      });
    },
  });
};

/**
 * Delete question (soft delete)
 */
export const useDeleteQuestion = (): UseMutationResult<
  QuestionApiResponse<void>,
  AxiosError,
  { id: string; quizId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string; quizId: string }) => {
      const response = await axiosInstance.delete<QuestionApiResponse<void>>(
        API_ENDPOINTS.QUESTION.BY_ID(id)
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: QUESTION_KEYS.detail(variables.id),
      });
      // Invalidate questions for this quiz
      queryClient.invalidateQueries({
        queryKey: QUESTION_KEYS.byQuizId(variables.quizId),
      });
      // Invalidate quiz questions endpoint
      queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.questions(variables.quizId),
      });
      // Invalidate quiz stats
      queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.stats(variables.quizId),
      });
      // Invalidate quiz detail (for question count update)
      queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.detail(variables.quizId),
      });
    },
  });
};

/**
 * Delete all questions of a quiz
 */
export const useDeleteQuestionsByQuizId = (): UseMutationResult<
  QuestionApiResponse<void>,
  AxiosError,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quizId: string) => {
      const response = await axiosInstance.delete<QuestionApiResponse<void>>(
        API_ENDPOINTS.QUESTION.DELETE_BY_QUIZ_ID(quizId)
      );
      return response.data;
    },
    onSuccess: (_, quizId) => {
      // Invalidate all questions for this quiz
      queryClient.invalidateQueries({
        queryKey: QUESTION_KEYS.byQuizId(quizId),
      });
      // Invalidate quiz questions endpoint
      queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.questions(quizId),
      });
      // Invalidate quiz stats
      queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.stats(quizId),
      });
      // Invalidate quiz detail
      queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.detail(quizId),
      });
    },
  });
};
