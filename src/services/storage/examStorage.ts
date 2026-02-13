import type { BasicExamInfo } from "@/components/organisms/basic-exam-info";
import type { Question } from "@/components/molecules/question-item";

export interface SavedExam {
  id: string;
  examInfo: BasicExamInfo;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "edutech_exams";

/**
 * LocalStorage service for managing exams
 * This is a temporary solution until backend is implemented
 */
export class ExamStorageService {
  /**
   * Get all saved exams from localStorage
   */
  static getAllExams(): SavedExam[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as SavedExam[];
    } catch (error) {
      console.error("Error loading exams from localStorage:", error);
      return [];
    }
  }

  /**
   * Get a single exam by ID
   */
  static getExamById(id: string): SavedExam | null {
    const exams = this.getAllExams();
    return exams.find((exam) => exam.id === id) || null;
  }

  /**
   * Save a new exam or update existing one
   */
  static saveExam(
    examInfo: BasicExamInfo,
    questions: Question[],
    existingId?: string
  ): SavedExam {
    const exams = this.getAllExams();
    const now = new Date().toISOString();

    if (existingId) {
      // Update existing exam
      const index = exams.findIndex((exam) => exam.id === existingId);
      if (index !== -1) {
        exams[index] = {
          ...exams[index],
          examInfo,
          questions,
          updatedAt: now,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
        return exams[index];
      }
    }

    // Create new exam
    const newExam: SavedExam = {
      id: `exam-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      examInfo,
      questions,
      createdAt: now,
      updatedAt: now,
    };

    exams.push(newExam);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
    return newExam;
  }

  /**
   * Delete an exam by ID
   */
  static deleteExam(id: string): boolean {
    try {
      const exams = this.getAllExams();
      const filteredExams = exams.filter((exam) => exam.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredExams));
      return true;
    } catch (error) {
      console.error("Error deleting exam:", error);
      return false;
    }
  }

  /**
   * Delete all exams (for testing/reset)
   */
  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Get exam statistics
   */
  static getStats() {
    const exams = this.getAllExams();
    return {
      totalExams: exams.length,
      totalQuestions: exams.reduce(
        (sum, exam) => sum + exam.questions.length,
        0
      ),
      subjects: [...new Set(exams.map((exam) => exam.examInfo.subject))],
      grades: [...new Set(exams.map((exam) => exam.examInfo.grade))],
    };
  }
}
