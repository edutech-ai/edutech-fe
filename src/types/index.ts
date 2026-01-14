// ==================== ENUMS ====================
export enum UserRole {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
}

export enum QuestionType {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  TRUE_FALSE = "TRUE_FALSE",
  SHORT_ANSWER = "SHORT_ANSWER",
  ESSAY = "ESSAY",
}

export enum Difficulty {
  RECOGNITION = "RECOGNITION", // Nhận biết
  COMPREHENSION = "COMPREHENSION", // Thông hiểu
  APPLICATION = "APPLICATION", // Vận dụng
  HIGH_APPLICATION = "HIGH_APPLICATION", // Vận dụng cao
}

export enum QuizStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum LessonPlanStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export enum ActivityType {
  WARMUP = "WARMUP",
  PRESENTATION = "PRESENTATION",
  PRACTICE = "PRACTICE",
  PRODUCTION = "PRODUCTION",
  ASSESSMENT = "ASSESSMENT",
}

export enum ExamInstanceStatus {
  SCHEDULED = "SCHEDULED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
}

export enum ActivityLogType {
  QUIZ_CREATED = "QUIZ_CREATED",
  LESSON_PLAN_CREATED = "LESSON_PLAN_CREATED",
  EXAM_COMPLETED = "EXAM_COMPLETED",
  STUDENT_GRADED = "STUDENT_GRADED",
}

export enum LibraryItemType {
  QUIZ = "QUIZ",
  LESSON_PLAN = "LESSON_PLAN",
  DOCUMENT = "DOCUMENT",
  SLIDE = "SLIDE",
}

export enum Framework {
  BLOOM = "BLOOM",
  VN_STANDARD = "VN_STANDARD",
  CUSTOM = "CUSTOM",
}

// ==================== USER & AUTH ====================
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  school?: string;
  subject?: string;
  grade?: number;
  isPaidUser?: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// ==================== LESSON PLAN ====================
export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: number;
  duration: number; // minutes
  objectives: string[];
  activities: LessonActivity[];
  materials: string[];
  assessment: string;
  status: LessonPlanStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonActivity {
  id: string;
  title: string;
  duration: number;
  description: string;
  type: ActivityType;
}
export interface LessonPlanGenerateRequest {
  topic: string;
  subject: string;
  grade: number;
  duration: number;
  objectives?: string[];
  framework?: Framework;
}

// ==================== EXAM MATRIX ====================
export enum CognitiveDomain {
  RECOGNITION = "RECOGNITION",
  COMPREHENSION = "COMPREHENSION",
  APPLICATION = "APPLICATION",
  HIGH_APPLICATION = "HIGH_APPLICATION",
}

export interface CognitiveDomainDistribution {
  recognition: { count: number; points: number };
  comprehension: { count: number; points: number };
  application: { count: number; points: number };
  highApplication: { count: number; points: number };
}

export interface ChapterDistribution {
  id: string;
  chapterNumber: number;
  chapterName: string;
  distribution: CognitiveDomainDistribution;
}

export interface ExamMatrix {
  id: string;
  name: string;
  description?: string;
  subject: string;
  grade: number;
  chapters: ChapterDistribution[];
  totalQuestions: number;
  totalPoints: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== STUDENT EXAM ====================
export interface ExamInstance {
  id: string;
  quizId: string;
  code: string; // Exam access code
  startTime: string;
  endTime: string;
  duration: number;
  status: ExamInstanceStatus;
  studentResults?: StudentResult[];
}

export interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  examInstanceId: string;
  answers: StudentAnswer[];
  score: number;
  totalPoints: number;
  percentage: number;
  submittedAt: string;
  gradedAt?: string;
}

export interface StudentAnswer {
  questionId: string;
  answer: string | number;
  isCorrect?: boolean;
  points?: number;
}

// ==================== ANALYTICS ====================
export interface AnalyticsData {
  totalQuizzes: number;
  totalLessonPlans: number;
  totalStudents: number;
  averageScore: number;
  recentActivities: Activity[];
  performanceByTopic: TopicPerformance[];
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface Activity {
  id: string;
  type: ActivityLogType;
  title: string;
  description: string;
  timestamp: string;
}

export interface TopicPerformance {
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

// ==================== LIBRARY ====================
export interface LibraryItem {
  id: string;
  type: LibraryItemType;
  title: string;
  subject: string;
  grade: number;
  thumbnail?: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

// ==================== COMMON ====================
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// ==================== SUBJECTS & GRADES ====================
export const SUBJECTS = ["Toán", "Ngữ Văn", "Tiếng Anh"] as const;

export const GRADES = [6, 7, 8, 9] as const;

export type Subject = (typeof SUBJECTS)[number];
export type Grade = (typeof GRADES)[number];

// ==================== CLASSROOM ====================
export * from "./classroom";

// ==================== QUIZ & QUESTION (Backend API) ====================
export * from "./quiz";
export * from "./question";
