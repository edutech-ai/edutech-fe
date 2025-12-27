export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "short_answer"
  | "essay";
export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface QuestionData {
  id?: string;
  content: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  points: number;
  answers?: string[];
  correctAnswer?: string | number | boolean;
  explanation?: string;
}

export interface QuestionEditorErrors {
  content?: string;
  points?: string;
  answers?: string;
  correctAnswer?: string;
}
