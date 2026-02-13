/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  ExamMatrix,
  ChapterDistribution,
  ExamMatrixApi,
  ExamMatrixChapterApi,
  ExamMatrixApiResponse,
  ExamMatrixListResponse,
  CreateExamMatrixRequest,
  UpdateExamMatrixRequest,
  ExamMatrixQueryParams,
} from "@/types";

// ==================== DATA TRANSFORMERS ====================

/**
 * Transform API chapter (snake_case) to frontend chapter (camelCase nested)
 */
function apiChapterToUi(
  ch: ExamMatrixChapterApi,
  index: number
): ChapterDistribution {
  return {
    id: ch.id || `ch-${index}`,
    chapterNumber: ch.order_index ?? index,
    chapterName: ch.chapter_name,
    distribution: {
      recognition: {
        count: ch.recognition_count,
        points: ch.recognition_score,
      },
      comprehension: {
        count: ch.comprehension_count,
        points: ch.comprehension_score,
      },
      application: {
        count: ch.application_count,
        points: ch.application_score,
      },
      highApplication: {
        count: ch.high_application_count,
        points: ch.high_application_score,
      },
    },
  };
}

/**
 * Transform frontend chapter (camelCase nested) to API chapter (snake_case)
 */
function uiChapterToApi(
  ch: ChapterDistribution,
  index: number
): ExamMatrixChapterApi {
  return {
    chapter_name: ch.chapterName,
    recognition_count: Number(ch.distribution.recognition.count) || 0,
    recognition_score: Number(ch.distribution.recognition.points) || 0,
    comprehension_count: Number(ch.distribution.comprehension.count) || 0,
    comprehension_score: Number(ch.distribution.comprehension.points) || 0,
    application_count: Number(ch.distribution.application.count) || 0,
    application_score: Number(ch.distribution.application.points) || 0,
    high_application_count: Number(ch.distribution.highApplication.count) || 0,
    high_application_score: Number(ch.distribution.highApplication.points) || 0,
    order_index: index,
  };
}

/**
 * Transform API matrix to frontend ExamMatrix
 */
function apiMatrixToUi(m: ExamMatrixApi): ExamMatrix {
  const chapters = (m.chapters || []).map(apiChapterToUi);
  return {
    id: m.id,
    name: m.name,
    subject: m.subject,
    grade: m.grade,
    description: m.description,
    chapters,
    totalChapters: m.total_chapters ?? chapters.length,
    totalQuestions: m.total_questions ?? 0,
    totalPoints: m.total_score ?? 0,
    createdBy: m.teacher_id,
    createdAt: m.created_at,
    updatedAt: m.updated_at,
  };
}

/**
 * Transform frontend ExamMatrix data to API create/update request
 */
function uiMatrixToApiCreate(
  data: Omit<ExamMatrix, "id" | "createdAt" | "updatedAt">
): CreateExamMatrixRequest {
  return {
    name: data.name,
    subject: data.subject,
    grade: data.grade,
    description: data.description,
    chapters: data.chapters.map(uiChapterToApi),
  };
}

function uiMatrixToApiUpdate(
  data: Partial<Omit<ExamMatrix, "id" | "createdAt" | "updatedAt">>
): UpdateExamMatrixRequest {
  const req: UpdateExamMatrixRequest = {};
  if (data.name !== undefined) req.name = data.name;
  if (data.subject !== undefined) req.subject = data.subject;
  if (data.grade !== undefined) req.grade = data.grade;
  if (data.description !== undefined) req.description = data.description;
  if (data.chapters !== undefined) {
    req.chapters = data.chapters.map(uiChapterToApi);
  }
  return req;
}

// ==================== QUERY KEYS ====================

export const EXAM_MATRIX_KEYS = {
  all: ["exam-matrices"] as const,
  lists: () => [...EXAM_MATRIX_KEYS.all, "list"] as const,
  list: (filters: ExamMatrixQueryParams) =>
    [...EXAM_MATRIX_KEYS.lists(), filters] as const,
  myMatrices: (filters: ExamMatrixQueryParams) =>
    [...EXAM_MATRIX_KEYS.all, "my-matrices", filters] as const,
  details: () => [...EXAM_MATRIX_KEYS.all, "detail"] as const,
  detail: (id: string) => [...EXAM_MATRIX_KEYS.details(), id] as const,
};

// ==================== QUERY HOOKS ====================

/**
 * Get matrices created by current teacher
 */
export const useMyMatrices = (
  filters: ExamMatrixQueryParams = {},
  options?: any
) => {
  return useQuery<ExamMatrix[], AxiosError>({
    queryKey: EXAM_MATRIX_KEYS.myMatrices(filters),
    queryFn: async () => {
      const { data } = await axiosInstance.get<ExamMatrixListResponse>(
        API_ENDPOINTS.EXAM_MATRIX.MY_MATRICES,
        { params: filters }
      );
      return data.data.map(apiMatrixToUi);
    },
    ...options,
  });
};

/**
 * Get matrix by ID
 */
export const useMatrixById = (id?: string, options?: any) => {
  return useQuery<ExamMatrix, AxiosError>({
    queryKey: EXAM_MATRIX_KEYS.detail(id!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        ExamMatrixApiResponse<ExamMatrixApi>
      >(API_ENDPOINTS.EXAM_MATRIX.BY_ID(id!));
      return apiMatrixToUi(data.data);
    },
    enabled: !!id,
    ...options,
  });
};

// ==================== MUTATION HOOKS ====================

/**
 * Create new matrix
 */
export const useCreateMatrix = (): UseMutationResult<
  ExamMatrix,
  AxiosError,
  Omit<ExamMatrix, "id" | "createdAt" | "updatedAt">
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Omit<ExamMatrix, "id" | "createdAt" | "updatedAt">
    ) => {
      const response = await axiosInstance.post<
        ExamMatrixApiResponse<ExamMatrixApi>
      >(API_ENDPOINTS.EXAM_MATRIX.BASE, uiMatrixToApiCreate(data));
      return apiMatrixToUi(response.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_MATRIX_KEYS.all });
    },
  });
};

/**
 * Update matrix
 */
export const useUpdateMatrix = (): UseMutationResult<
  ExamMatrix,
  AxiosError,
  { id: string; data: Omit<ExamMatrix, "id" | "createdAt" | "updatedAt"> }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Omit<ExamMatrix, "id" | "createdAt" | "updatedAt">;
    }) => {
      const response = await axiosInstance.put<
        ExamMatrixApiResponse<ExamMatrixApi>
      >(API_ENDPOINTS.EXAM_MATRIX.BY_ID(id), uiMatrixToApiUpdate(data));
      return apiMatrixToUi(response.data.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: EXAM_MATRIX_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: EXAM_MATRIX_KEYS.all });
    },
  });
};

/**
 * Delete matrix
 */
export const useDeleteMatrix = (): UseMutationResult<
  void,
  AxiosError,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(API_ENDPOINTS.EXAM_MATRIX.BY_ID(id));
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: EXAM_MATRIX_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: EXAM_MATRIX_KEYS.all });
    },
  });
};

/**
 * Duplicate matrix (client-side: fetch + create copy)
 */
export const useDuplicateMatrix = (): UseMutationResult<
  ExamMatrix,
  AxiosError,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Fetch the original matrix
      const { data: original } = await axiosInstance.get<
        ExamMatrixApiResponse<ExamMatrixApi>
      >(API_ENDPOINTS.EXAM_MATRIX.BY_ID(id));
      const matrix = original.data;

      // Create a copy
      const copyData: CreateExamMatrixRequest = {
        name: `${matrix.name} (Sao chép)`,
        subject: matrix.subject,
        grade: matrix.grade,
        description: matrix.description,
        chapters: (matrix.chapters || []).map((ch, i) => ({
          chapter_name: ch.chapter_name,
          recognition_count: ch.recognition_count,
          recognition_score: ch.recognition_score,
          comprehension_count: ch.comprehension_count,
          comprehension_score: ch.comprehension_score,
          application_count: ch.application_count,
          application_score: ch.application_score,
          high_application_count: ch.high_application_count,
          high_application_score: ch.high_application_score,
          order_index: i,
        })),
      };

      const response = await axiosInstance.post<
        ExamMatrixApiResponse<ExamMatrixApi>
      >(API_ENDPOINTS.EXAM_MATRIX.BASE, copyData);
      return apiMatrixToUi(response.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_MATRIX_KEYS.all });
    },
  });
};
