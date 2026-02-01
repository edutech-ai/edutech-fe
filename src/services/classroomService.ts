/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  ClassroomBackend,
  ClassroomListResponse,
  ClassroomApiResponse,
  CreateClassroomRequest,
  UpdateClassroomRequest,
  ClassroomQueryParams,
  ClassroomStudentsResponse,
  AddStudentToClassroomRequest,
  CreateStudentAndAddToClassroomRequest,
  StudentPerformanceBackend,
  LeaderboardResponse,
  StudentBackend,
  StudentListResponse,
  StudentQueryParams,
  CreateStudentRequest,
  UpdateStudentRequest,
  ClassroomHandRaisesResponse,
  StudentHandRaiseResponse,
  BatchHandRaiseRequest,
  BatchHandRaiseResponse,
} from "@/types/classroom";

// ==================== QUERY KEYS ====================
export const CLASSROOM_KEYS = {
  all: ["classrooms"] as const,
  lists: () => [...CLASSROOM_KEYS.all, "list"] as const,
  list: (filters: ClassroomQueryParams) =>
    [...CLASSROOM_KEYS.lists(), filters] as const,
  details: () => [...CLASSROOM_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CLASSROOM_KEYS.details(), id] as const,
  students: (classroomId: string) =>
    [...CLASSROOM_KEYS.all, "students", classroomId] as const,
  studentPerformance: (classroomId: string, studentId: string) =>
    [...CLASSROOM_KEYS.all, "performance", classroomId, studentId] as const,
  leaderboard: (classroomId: string) =>
    [...CLASSROOM_KEYS.all, "leaderboard", classroomId] as const,
  handRaises: (classroomId: string) =>
    [...CLASSROOM_KEYS.all, "handRaises", classroomId] as const,
  studentHandRaise: (classroomId: string, studentId: string) =>
    [...CLASSROOM_KEYS.all, "handRaise", classroomId, studentId] as const,
};

export const STUDENT_KEYS = {
  all: ["students"] as const,
  lists: () => [...STUDENT_KEYS.all, "list"] as const,
  list: (filters: StudentQueryParams) =>
    [...STUDENT_KEYS.lists(), filters] as const,
  details: () => [...STUDENT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...STUDENT_KEYS.details(), id] as const,
};

// ==================== CLASSROOM QUERY HOOKS ====================

/**
 * Get classrooms list for current teacher
 */
export const useClassrooms = (
  filters: ClassroomQueryParams = {},
  options?: any
) => {
  return useQuery<ClassroomListResponse, AxiosError>({
    queryKey: CLASSROOM_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await axiosInstance.get<ClassroomListResponse>(
        API_ENDPOINTS.CLASSROOM.BASE,
        { params: filters }
      );
      return data;
    },
    ...options,
  });
};

/**
 * Get classroom by ID
 */
export const useClassroomById = (id?: string, options?: any) => {
  return useQuery<ClassroomApiResponse<ClassroomBackend>, AxiosError>({
    queryKey: CLASSROOM_KEYS.detail(id!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        ClassroomApiResponse<ClassroomBackend>
      >(API_ENDPOINTS.CLASSROOM.BY_ID(id!));
      return data;
    },
    enabled: !!id,
    ...options,
  });
};

/**
 * Get students in classroom
 */
export const useClassroomStudents = (
  classroomId?: string,
  status?: string,
  options?: any
) => {
  return useQuery<ClassroomStudentsResponse, AxiosError>({
    queryKey: CLASSROOM_KEYS.students(classroomId!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<ClassroomStudentsResponse>(
        API_ENDPOINTS.CLASSROOM.STUDENTS(classroomId!),
        { params: status ? { status } : undefined }
      );
      return data;
    },
    enabled: !!classroomId,
    ...options,
  });
};

/**
 * Get student performance in classroom
 */
export const useStudentPerformance = (
  classroomId?: string,
  studentId?: string,
  options?: any
) => {
  return useQuery<ClassroomApiResponse<StudentPerformanceBackend>, AxiosError>({
    queryKey: CLASSROOM_KEYS.studentPerformance(classroomId!, studentId!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        ClassroomApiResponse<StudentPerformanceBackend>
      >(API_ENDPOINTS.CLASSROOM.STUDENT_PERFORMANCE(classroomId!, studentId!));
      return data;
    },
    enabled: !!classroomId && !!studentId,
    ...options,
  });
};

/**
 * Get classroom leaderboard
 */
export const useClassroomLeaderboard = (
  classroomId?: string,
  options?: any
) => {
  return useQuery<LeaderboardResponse, AxiosError>({
    queryKey: CLASSROOM_KEYS.leaderboard(classroomId!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<LeaderboardResponse>(
        API_ENDPOINTS.CLASSROOM.LEADERBOARD(classroomId!)
      );
      return data;
    },
    enabled: !!classroomId,
    ...options,
  });
};

// ==================== CLASSROOM MUTATION HOOKS ====================

/**
 * Create new classroom
 */
export const useCreateClassroom = (): UseMutationResult<
  ClassroomApiResponse<ClassroomBackend>,
  AxiosError,
  CreateClassroomRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClassroomRequest) => {
      const response = await axiosInstance.post<
        ClassroomApiResponse<ClassroomBackend>
      >(API_ENDPOINTS.CLASSROOM.BASE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.all });
    },
  });
};

/**
 * Update classroom
 */
export const useUpdateClassroom = (): UseMutationResult<
  ClassroomApiResponse<ClassroomBackend>,
  AxiosError,
  { id: string; data: UpdateClassroomRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateClassroomRequest;
    }) => {
      const response = await axiosInstance.put<
        ClassroomApiResponse<ClassroomBackend>
      >(API_ENDPOINTS.CLASSROOM.BY_ID(id), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.all });
    },
  });
};

/**
 * Delete classroom
 */
export const useDeleteClassroom = (): UseMutationResult<
  ClassroomApiResponse<void>,
  AxiosError,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete<ClassroomApiResponse<void>>(
        API_ENDPOINTS.CLASSROOM.BY_ID(id)
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: CLASSROOM_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.all });
    },
  });
};

// ==================== STUDENT IN CLASSROOM MUTATION HOOKS ====================

/**
 * Add student to classroom
 */
export const useAddStudentToClassroom = (): UseMutationResult<
  ClassroomApiResponse<void>,
  AxiosError,
  { classroomId: string; data: AddStudentToClassroomRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      data,
    }: {
      classroomId: string;
      data: AddStudentToClassroomRequest;
    }) => {
      const response = await axiosInstance.post<ClassroomApiResponse<void>>(
        API_ENDPOINTS.CLASSROOM.STUDENTS(classroomId),
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.students(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.detail(variables.classroomId),
      });
    },
  });
};

/**
 * Update student status in classroom
 */
export const useUpdateStudentStatus = (): UseMutationResult<
  ClassroomApiResponse<void>,
  AxiosError,
  { classroomId: string; studentId: string; status: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      studentId,
      status,
    }: {
      classroomId: string;
      studentId: string;
      status: string;
    }) => {
      const response = await axiosInstance.put<ClassroomApiResponse<void>>(
        API_ENDPOINTS.CLASSROOM.STUDENT(classroomId, studentId),
        { status }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.students(variables.classroomId),
      });
    },
  });
};

/**
 * Remove student from classroom
 */
export const useRemoveStudentFromClassroom = (): UseMutationResult<
  ClassroomApiResponse<void>,
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
      const response = await axiosInstance.delete<ClassroomApiResponse<void>>(
        API_ENDPOINTS.CLASSROOM.STUDENT(classroomId, studentId)
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.students(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.detail(variables.classroomId),
      });
    },
  });
};

/**
 * Update student performance
 */
export const useUpdateStudentPerformance = (): UseMutationResult<
  ClassroomApiResponse<StudentPerformanceBackend>,
  AxiosError,
  {
    classroomId: string;
    studentId: string;
    data: Partial<StudentPerformanceBackend>;
  }
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
      data: Partial<StudentPerformanceBackend>;
    }) => {
      const response = await axiosInstance.put<
        ClassroomApiResponse<StudentPerformanceBackend>
      >(
        API_ENDPOINTS.CLASSROOM.STUDENT_PERFORMANCE(classroomId, studentId),
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.studentPerformance(
          variables.classroomId,
          variables.studentId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.leaderboard(variables.classroomId),
      });
    },
  });
};

/**
 * Create new student and add to classroom
 */
export const useCreateStudentAndAddToClassroom = (): UseMutationResult<
  ClassroomApiResponse<StudentBackend>,
  AxiosError,
  { classroomId: string; data: CreateStudentAndAddToClassroomRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      data,
    }: {
      classroomId: string;
      data: CreateStudentAndAddToClassroomRequest;
    }) => {
      const response = await axiosInstance.post<
        ClassroomApiResponse<StudentBackend>
      >(API_ENDPOINTS.CLASSROOM.STUDENTS(classroomId), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.students(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.detail(variables.classroomId),
      });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.lists() });
    },
  });
};

/**
 * Add existing student to classroom
 */
export const useAddExistingStudentToClassroom = (): UseMutationResult<
  ClassroomApiResponse<void>,
  AxiosError,
  { classroomId: string; data: AddStudentToClassroomRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      data,
    }: {
      classroomId: string;
      data: AddStudentToClassroomRequest;
    }) => {
      const response = await axiosInstance.post<ClassroomApiResponse<void>>(
        API_ENDPOINTS.CLASSROOM.STUDENTS_ADD_EXISTING(classroomId),
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.students(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.detail(variables.classroomId),
      });
    },
  });
};

/**
 * Upload students from XLSX file to classroom
 */
export interface UploadStudentsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    successCount: number;
    createdCount: number;
    addedCount: number;
    existingCount: number;
    errorCount: number;
    success: Array<{
      row: number;
      student_code: string;
      full_name: string;
      id: string;
      isNew: boolean;
    }>;
    created: Array<{
      row: number;
      student_code: string;
      full_name: string;
      id: string;
    }>;
    added: Array<{
      row: number;
      student_code: string;
      full_name: string;
      id: string;
    }>;
    existing: Array<{
      row: number;
      student_code: string;
      full_name: string;
      message: string;
    }>;
    errors: Array<{
      row: number;
      data: Record<string, unknown>;
      message: string;
    }>;
  };
}

export const useUploadStudentsToClassroom = (): UseMutationResult<
  UploadStudentsResponse,
  AxiosError,
  { classroomId: string; file: File }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      file,
    }: {
      classroomId: string;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post<UploadStudentsResponse>(
        API_ENDPOINTS.CLASSROOM.STUDENTS_UPLOAD(classroomId),
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
        queryKey: CLASSROOM_KEYS.students(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.detail(variables.classroomId),
      });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.lists() });
    },
  });
};

// ==================== STUDENT QUERY HOOKS ====================

/**
 * Get all students list
 */
export const useStudents = (
  filters: StudentQueryParams = {},
  options?: any
) => {
  return useQuery<StudentListResponse, AxiosError>({
    queryKey: STUDENT_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await axiosInstance.get<StudentListResponse>(
        API_ENDPOINTS.STUDENT.BASE,
        { params: filters }
      );
      return data;
    },
    ...options,
  });
};

/**
 * Get student by ID
 */
export const useStudentById = (id?: string, options?: any) => {
  return useQuery<ClassroomApiResponse<StudentBackend>, AxiosError>({
    queryKey: STUDENT_KEYS.detail(id!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        ClassroomApiResponse<StudentBackend>
      >(API_ENDPOINTS.STUDENT.BY_ID(id!));
      return data;
    },
    enabled: !!id,
    ...options,
  });
};

// ==================== STUDENT MUTATION HOOKS ====================

/**
 * Create new student
 */
export const useCreateStudent = (): UseMutationResult<
  ClassroomApiResponse<StudentBackend>,
  AxiosError,
  CreateStudentRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStudentRequest) => {
      const response = await axiosInstance.post<
        ClassroomApiResponse<StudentBackend>
      >(API_ENDPOINTS.STUDENT.BASE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.lists() });
    },
  });
};

/**
 * Update student
 */
export const useUpdateStudent = (): UseMutationResult<
  ClassroomApiResponse<StudentBackend>,
  AxiosError,
  { id: string; data: UpdateStudentRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateStudentRequest;
    }) => {
      const response = await axiosInstance.put<
        ClassroomApiResponse<StudentBackend>
      >(API_ENDPOINTS.STUDENT.BY_ID(id), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: STUDENT_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.all });
    },
  });
};

/**
 * Delete student
 */
export const useDeleteStudent = (): UseMutationResult<
  ClassroomApiResponse<void>,
  AxiosError,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete<ClassroomApiResponse<void>>(
        API_ENDPOINTS.STUDENT.BY_ID(id)
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: STUDENT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.all });
    },
  });
};

// ==================== HAND RAISE QUERY HOOKS ====================

/**
 * Get all hand raises for a classroom
 */
export const useClassroomHandRaises = (classroomId?: string, options?: any) => {
  return useQuery<ClassroomHandRaisesResponse, AxiosError>({
    queryKey: CLASSROOM_KEYS.handRaises(classroomId!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<ClassroomHandRaisesResponse>(
        API_ENDPOINTS.CLASSROOM.HAND_RAISES(classroomId!)
      );
      return data;
    },
    enabled: !!classroomId,
    ...options,
  });
};

/**
 * Get hand raise for a specific student
 */
export const useStudentHandRaise = (
  classroomId?: string,
  studentId?: string,
  options?: any
) => {
  return useQuery<StudentHandRaiseResponse, AxiosError>({
    queryKey: CLASSROOM_KEYS.studentHandRaise(classroomId!, studentId!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<StudentHandRaiseResponse>(
        API_ENDPOINTS.CLASSROOM.STUDENT_HAND_RAISES(classroomId!, studentId!)
      );
      return data;
    },
    enabled: !!classroomId && !!studentId,
    ...options,
  });
};

// ==================== HAND RAISE MUTATION HOOKS ====================

/**
 * Batch update hand raises (end of session)
 */
export const useBatchUpdateHandRaises = (): UseMutationResult<
  BatchHandRaiseResponse,
  AxiosError,
  { classroomId: string; data: BatchHandRaiseRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      data,
    }: {
      classroomId: string;
      data: BatchHandRaiseRequest;
    }) => {
      const response = await axiosInstance.post<BatchHandRaiseResponse>(
        API_ENDPOINTS.CLASSROOM.HAND_RAISES_BATCH(classroomId),
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.handRaises(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.students(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.leaderboard(variables.classroomId),
      });
    },
  });
};

/**
 * Update hand raise total for a student (manual)
 */
export const useUpdateStudentHandRaise = (): UseMutationResult<
  StudentHandRaiseResponse,
  AxiosError,
  { classroomId: string; studentId: string; total_hand_raises: number }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      studentId,
      total_hand_raises,
    }: {
      classroomId: string;
      studentId: string;
      total_hand_raises: number;
    }) => {
      const response = await axiosInstance.put<StudentHandRaiseResponse>(
        API_ENDPOINTS.CLASSROOM.STUDENT_HAND_RAISES(classroomId, studentId),
        { total_hand_raises }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.studentHandRaise(
          variables.classroomId,
          variables.studentId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.handRaises(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.students(variables.classroomId),
      });
    },
  });
};

/**
 * Delete/reset hand raises for a student
 */
export const useDeleteStudentHandRaise = (): UseMutationResult<
  ClassroomApiResponse<void>,
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
      const response = await axiosInstance.delete<ClassroomApiResponse<void>>(
        API_ENDPOINTS.CLASSROOM.STUDENT_HAND_RAISES(classroomId, studentId)
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.studentHandRaise(
          variables.classroomId,
          variables.studentId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.handRaises(variables.classroomId),
      });
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_KEYS.students(variables.classroomId),
      });
    },
  });
};
