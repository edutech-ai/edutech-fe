export interface BasicExamInfo {
  name: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  totalScore: number;
  instructions?: string;
}

export interface ValidationErrors {
  name?: string;
  subject?: string;
  grade?: string;
  durationMinutes?: string;
  totalScore?: string;
}
