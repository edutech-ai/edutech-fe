export interface ExamMatrixChapterApi {
  id?: string;
  chapter_name: string;
  recognition_count: number;
  recognition_score: number;
  comprehension_count: number;
  comprehension_score: number;
  application_count: number;
  application_score: number;
  high_application_count: number;
  high_application_score: number;
  order_index: number;
}

export interface ExamMatrixApi {
  id: string;
  name: string;
  subject: string;
  grade: number;
  description?: string;
  teacher_id: string;
  total_chapters?: number;
  total_questions: number;
  total_score: number;
  created_at: string;
  updated_at: string;
  chapters: ExamMatrixChapterApi[];
}

export interface CreateExamMatrixRequest {
  name: string;
  subject: string;
  grade: number;
  description?: string;
  chapters?: ExamMatrixChapterApi[];
}

export interface UpdateExamMatrixRequest {
  name?: string;
  subject?: string;
  grade?: number;
  description?: string;
  chapters?: ExamMatrixChapterApi[];
}

export interface ExamMatrixQueryParams {
  subject?: string;
  grade?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ExamMatrixApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ExamMatrixListResponse {
  success: boolean;
  data: ExamMatrixApi[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
