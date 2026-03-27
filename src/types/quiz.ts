export type QuizDifficulty = "easy" | "medium" | "hard";

export type QuizStatus = "draft" | "public" | "archived";

export type QuizVisibility = "private" | "community";

export interface Quiz {
  id: string;
  teacher_id: string;
  title: string;
  description?: string | null;
  difficulty: QuizDifficulty;
  exam_code?: string | null;
  qr_code?: string | null;
  status: QuizStatus;
  visibility?: QuizVisibility;
  total_questions: number;
  grade?: number;
  subject: string;
  duration: number;
  min_attempts?: number;
  max_attempts?: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Quiz with additional details (question count, total points)
 */
export interface QuizWithDetails extends Quiz {
  question_count: number;
  total_points: number;
}

/**
 * Public quiz with teacher info
 */
export interface PublicQuiz extends Quiz {
  teacher_email: string;
}

/**
 * Request payload for creating a quiz
 */
export interface CreateQuizRequest {
  title: string;
  description?: string;
  difficulty?: QuizDifficulty;
  subject?: string;
  grade?: number;
  duration?: number;
  exam_code?: string;
  qr_code?: string;
  status?: QuizStatus;
  min_attempts?: number;
  max_attempts?: number;
}

/**
 * Request payload for updating a quiz
 */
export interface UpdateQuizRequest {
  title?: string;
  description?: string;
  difficulty?: QuizDifficulty;
  subject?: string;
  grade?: number;
  duration?: number;
  exam_code?: string;
  qr_code?: string;
  status?: QuizStatus;
  min_attempts?: number;
  max_attempts?: number;
}

/**
 * Query parameters for fetching quizzes
 */
export interface QuizQueryParams {
  status?: QuizStatus;
  difficulty?: QuizDifficulty;
  search?: string;
  subject?: string;
  page?: number;
  limit?: number;
}

/**
 * Quiz statistics response
 */
export interface QuizStats {
  quiz_id: string;
  quiz_title: string;
  total_questions: number;
  total_points: number;
  questions_by_type: Array<{
    type: string;
    count: number;
  }>;
}

/**
 * API response for quiz operations
 */
export interface QuizApiResponse<T = Quiz> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * API response for quiz list with pagination
 */
export interface QuizListResponse {
  success: boolean;
  data: Quiz[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
