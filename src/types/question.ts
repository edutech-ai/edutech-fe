export type QuestionType = "MCQ" | "MULTIPLE_ANSWER" | "TRUE_FALSE" | "ESSAY";

/**
 * Option for MCQ/MULTIPLE_ANSWER questions
 * Can be simple string or object with id and text
 */
export type QuestionOption =
  | string
  | {
      id: string;
      text: string;
    };

/**
 * Correct answer type varies by question type:
 * - MCQ: string (single answer)
 * - MULTIPLE_ANSWER: string[] (multiple answers)
 * - TRUE_FALSE: "true" | "false"
 * - ESSAY: string (sample answer or rubric)
 */
export type CorrectAnswer = string | string[];

export enum Difficulty {
  RECOGNITION = "RECOGNITION", // Nhận biết
  COMPREHENSION = "COMPREHENSION", // Thông hiểu
  APPLICATION = "APPLICATION", // Vận dụng
  HIGH_APPLICATION = "HIGH_APPLICATION", // Vận dụng cao
}

/**
 * Question entity from backend
 */
export interface Question {
  id: string;
  quiz_id: string;
  document_id?: string | null;
  content: string;
  options?: QuestionOption[] | null;
  difficulty: Difficulty;
  correct_answer: CorrectAnswer;
  type: QuestionType;
  point: number;
  explanation?: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Question without answers (for students)
 */
export type QuestionWithoutAnswer = Omit<
  Question,
  "correct_answer" | "explanation"
>;

/**
 * Request payload for creating a question
 */
export interface CreateQuestionRequest {
  quiz_id: string;
  document_id?: string | null;
  content: string;
  options?: QuestionOption[];
  correct_answer: CorrectAnswer;
  type?: QuestionType;
  point?: number;
  difficulty?: Difficulty;
  explanation?: string;
}

/**
 * Request payload for updating a question
 */
export interface UpdateQuestionRequest {
  content?: string;
  options?: QuestionOption[];
  correct_answer?: CorrectAnswer;
  type?: QuestionType;
  point?: number;
  difficulty?: Difficulty;
  explanation?: string;
  document_id?: string | null;
}

/**
 * Request payload for bulk creating questions
 */
export interface BulkCreateQuestionsRequest {
  quiz_id: string;
  questions: Array<{
    content: string;
    options?: QuestionOption[];
    correct_answer: CorrectAnswer;
    type?: QuestionType;
    point?: number;
    difficulty?: Difficulty;
    explanation?: string;
    document_id?: string | null;
  }>;
}

/**
 * API response for question operations
 */
export interface QuestionApiResponse<T = Question> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * API response for question list
 */
export interface QuestionListResponse {
  success: boolean;
  data: Question[];
  total: number;
}

/**
 * API response for quiz questions
 */
export interface QuizQuestionsResponse {
  success: boolean;
  data: {
    quiz: {
      id: string;
      title: string;
      description?: string;
      difficulty: string;
    };
    questions: Question[];
    total: number;
  };
}

/**
 * API response for bulk create
 */
export interface BulkCreateQuestionsResponse {
  success: boolean;
  message: string;
  data: {
    quiz_id: string;
    created_count: number;
    question_ids: string[];
  };
}
