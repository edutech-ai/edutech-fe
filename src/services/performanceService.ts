/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  ClassroomApiResponse,
  ScoreBackend,
  ScoreListResponse,
  StudentScoresResponse,
  CreateScoreRequest,
  UpdateScoreRequest,
  ScoreQueryParams,
  UploadScoresResponse,
  StudentPerformanceBackend,
  ClassroomPerformanceResponse,
  UpdateTeacherNotesRequest,
  RecalculatePerformanceResponse,
  RecalculateAllPerformanceResponse,
  LeaderboardResponse,
  LeaderboardQueryParams,
  ExamType,
} from "@/types/classroom";
import { CLASSROOM_KEYS } from "./classroomService";

// ==================== QUERY KEYS ====================
export const PERFORMANCE_KEYS = {
  all: ["performance"] as const,
  // Scores
  scores: () => [...PERFORMANCE_KEYS.all, "scores"] as const,
  classroomScores: (classroomId: string, filters?: ScoreQueryParams) =>
    [...PERFORMANCE_KEYS.scores(), classroomId, filters] as const,
  studentScores: (classroomId: string, studentId: string) =>
    [...PERFORMANCE_KEYS.scores(), classroomId, studentId] as const,
  // Performance
  classroomPerformance: (classroomId: string) =>
    [...PERFORMANCE_KEYS.all, "classroom", classroomId] as const,
  studentPerformance: (classroomId: string, studentId: string) =>
    [...PERFORMANCE_KEYS.all, "student", classroomId, studentId] as const,
  // Leaderboard
  leaderboard: (classroomId: string, params?: LeaderboardQueryParams) =>
    [...PERFORMANCE_KEYS.all, "leaderboard", classroomId, params] as const,
};

// ==================== SCORES QUERY HOOKS ====================

/**
 * Get scores list for a classroom
 */
export const useClassroomScores = (
  classroomId?: string,
  filters: ScoreQueryParams = {},
  options?: any
) => {
  return useQuery<ScoreListResponse, AxiosError>({
    queryKey: PERFORMANCE_KEYS.classroomScores(classroomId!, filters),
    queryFn: async () => {
      const { data } = await axiosInstance.get<ScoreListResponse>(
        API_ENDPOINTS.CLASSROOM.SCORES(classroomId!),
        { params: filters }
      );
      return data;
    },
    enabled: !!classroomId,
    ...options,
  });
};

/**
 * Get scores for a specific student in a classroom
 */
export const useStudentScores = (
  classroomId?: string,
  studentId?: string,
  options?: any
) => {
  return useQuery<StudentScoresResponse, AxiosError>({
    queryKey: PERFORMANCE_KEYS.studentScores(classroomId!, studentId!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<StudentScoresResponse>(
        API_ENDPOINTS.CLASSROOM.STUDENT_SCORES(classroomId!, studentId!)
      );
      return data;
    },
    enabled: !!classroomId && !!studentId,
    ...options,
  });
};

// ==================== SCORES MUTATION HOOKS ====================

/**
 * Create a new score for a student
 */
export const useCreateScore = (): UseMutationResult<
  ClassroomApiResponse<ScoreBackend>,
  AxiosError,
  { classroomId: string; data: CreateScoreRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      data,
    }: {
      classroomId: string;
      data: CreateScoreRequest;
    }) => {
      const response = await axiosInstance.post<
        ClassroomApiResponse<ScoreBackend>
      >(API_ENDPOINTS.CLASSROOM.SCORES(classroomId), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.classroomScores(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.studentScores(
          variables.classroomId,
          variables.data.student_id
        ),
      });
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.classroomPerformance(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.leaderboard(variables.classroomId),
      });
    },
  });
};

/**
 * Update a score
 */
export const useUpdateScore = (): UseMutationResult<
  ClassroomApiResponse<ScoreBackend>,
  AxiosError,
  { classroomId: string; scoreId: string; data: UpdateScoreRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      scoreId,
      data,
    }: {
      classroomId: string;
      scoreId: string;
      data: UpdateScoreRequest;
    }) => {
      const response = await axiosInstance.put<
        ClassroomApiResponse<ScoreBackend>
      >(API_ENDPOINTS.CLASSROOM.SCORE_BY_ID(classroomId, scoreId), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.classroomScores(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.scores(),
      });
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.classroomPerformance(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.leaderboard(variables.classroomId),
      });
    },
  });
};

/**
 * Delete a score
 */
export const useDeleteScore = (): UseMutationResult<
  ClassroomApiResponse<void>,
  AxiosError,
  { classroomId: string; scoreId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      scoreId,
    }: {
      classroomId: string;
      scoreId: string;
    }) => {
      const response = await axiosInstance.delete<ClassroomApiResponse<void>>(
        API_ENDPOINTS.CLASSROOM.SCORE_BY_ID(classroomId, scoreId)
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.classroomScores(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.scores(),
      });
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.classroomPerformance(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.leaderboard(variables.classroomId),
      });
    },
  });
};

/**
 * Upload scores from XLSX file
 */
export const useUploadScores = (): UseMutationResult<
  UploadScoresResponse,
  AxiosError,
  {
    classroomId: string;
    file: File;
    subject: string;
    exam_name: string;
    exam_type: ExamType;
    max_score?: number;
    exam_date?: string;
    quiz_id?: string;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      file,
      subject,
      exam_name,
      exam_type,
      max_score,
      exam_date,
      quiz_id,
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subject", subject);
      formData.append("exam_name", exam_name);
      formData.append("exam_type", exam_type);
      if (max_score !== undefined) {
        formData.append("max_score", max_score.toString());
      }
      if (exam_date) {
        formData.append("exam_date", exam_date);
      }
      if (quiz_id) {
        formData.append("quiz_id", quiz_id);
      }

      const response = await axiosInstance.post<UploadScoresResponse>(
        API_ENDPOINTS.CLASSROOM.SCORES_UPLOAD(classroomId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.classroomScores(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.classroomPerformance(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.leaderboard(variables.classroomId),
      });
    },
  });
};

// ==================== PERFORMANCE QUERY HOOKS ====================

/**
 * Get performance for all students in a classroom
 */
export const useClassroomPerformance = (
  classroomId?: string,
  options?: any
) => {
  return useQuery<ClassroomPerformanceResponse, AxiosError>({
    queryKey: PERFORMANCE_KEYS.classroomPerformance(classroomId!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<ClassroomPerformanceResponse>(
        API_ENDPOINTS.CLASSROOM.PERFORMANCE(classroomId!)
      );
      return data;
    },
    enabled: !!classroomId,
    ...options,
  });
};

/**
 * Get classroom leaderboard with custom ordering
 */
export const useLeaderboard = (
  classroomId?: string,
  params: LeaderboardQueryParams = {},
  options?: any
) => {
  return useQuery<LeaderboardResponse, AxiosError>({
    queryKey: PERFORMANCE_KEYS.leaderboard(classroomId!, params),
    queryFn: async () => {
      const { data } = await axiosInstance.get<LeaderboardResponse>(
        API_ENDPOINTS.CLASSROOM.LEADERBOARD(classroomId!),
        { params }
      );
      return data;
    },
    enabled: !!classroomId,
    ...options,
  });
};

// ==================== PERFORMANCE MUTATION HOOKS ====================

/**
 * Update teacher notes for a student's performance
 */
export const useUpdateTeacherNotes = (): UseMutationResult<
  ClassroomApiResponse<StudentPerformanceBackend>,
  AxiosError,
  { classroomId: string; studentId: string; data: UpdateTeacherNotesRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      studentId,
      data,
    }: {
      classroomId: string;
      studentId: string;
      data: UpdateTeacherNotesRequest;
    }) => {
      const response = await axiosInstance.put<
        ClassroomApiResponse<StudentPerformanceBackend>
      >(
        API_ENDPOINTS.CLASSROOM.STUDENT_PERFORMANCE_NOTES(
          classroomId,
          studentId
        ),
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.studentPerformance(
          variables.classroomId,
          variables.studentId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.studentPerformance(
          variables.classroomId,
          variables.studentId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.classroomPerformance(variables.classroomId),
      });
    },
  });
};

/**
 * Recalculate performance for a specific student
 */
export const useRecalculateStudentPerformance = (): UseMutationResult<
  RecalculatePerformanceResponse,
  AxiosError,
  { classroomId: string; studentId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      studentId,
    }: {
      classroomId: string;
      studentId: string;
    }) => {
      const response = await axiosInstance.post<RecalculatePerformanceResponse>(
        API_ENDPOINTS.CLASSROOM.STUDENT_PERFORMANCE_RECALCULATE(
          classroomId,
          studentId
        )
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.studentPerformance(
          variables.classroomId,
          variables.studentId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.studentPerformance(
          variables.classroomId,
          variables.studentId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.classroomPerformance(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.leaderboard(variables.classroomId),
      });
    },
  });
};

/**
 * Recalculate performance for all students in a classroom
 */
export const useRecalculateAllPerformance = (): UseMutationResult<
  RecalculateAllPerformanceResponse,
  AxiosError,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (classroomId: string) => {
      const response =
        await axiosInstance.post<RecalculateAllPerformanceResponse>(
          API_ENDPOINTS.CLASSROOM.PERFORMANCE_RECALCULATE(classroomId)
        );
      return response.data;
    },
    onSuccess: (_, classroomId) => {
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.classroomPerformance(classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.leaderboard(classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: PERFORMANCE_KEYS.all,
      });
    },
  });
};
