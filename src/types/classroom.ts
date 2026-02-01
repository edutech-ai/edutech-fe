// ==================== CLASSROOM ENUMS ====================
export enum ParticipationStatus {
  NOT_PARTICIPATED = "NOT_PARTICIPATED",
  RAISED_HAND = "RAISED_HAND",
  CALLED = "CALLED",
  ANSWERED = "ANSWERED",
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
}

export enum SessionStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  ENDED = "ENDED",
}

export enum ClassroomStatus {
  ACTIVE = "active",
  ARCHIVED = "archived",
  UNACTIVE = "unactive",
}

export enum ClassroomStudentStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  DROPPED = "dropped",
}

// ==================== BACKEND API TYPES ====================
export interface ClassroomBackend {
  id: string;
  teacher_id: string;
  name: string;
  school_year?: string;
  description?: string;
  avatar_url?: string;
  status: string;
  created_at: string;
  student_count?: number;
}

export interface StudentBackend {
  id: string;
  full_name: string;
  student_code?: string;
  phone_number?: string;
  parent_phone_number?: string;
  is_active: boolean;
  created_at?: string;
}

export interface ClassroomStudentBackend {
  id: string;
  classroom_id: string;
  student_id: string;
  status: string;
  joined_at: string;
  // Joined student info
  student?: StudentBackend;
  full_name?: string;
  student_code?: string;
  phone_number?: string;
  parent_phone_number?: string;
  average_score?: number;
  total_hand_raises?: number;
}

export interface StudentPerformanceBackend {
  id: string;
  classroom_id: string;
  student_id: string;
  total_exams: number;
  average_score: number;
  total_hand_raises?: number;
  subject_performance?: Record<string, number>;
  strong_topic?: Record<string, unknown>;
  weak_topic?: Record<string, unknown>;
  teacher_notes?: string;
  updated_at: string;
  student?: StudentBackend;
}

// ==================== API REQUEST/RESPONSE TYPES ====================
export interface ClassroomQueryParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface CreateClassroomRequest {
  name: string;
  school_year?: string;
  description?: string;
  avatar_url?: string;
  status?: string;
}

export interface UpdateClassroomRequest {
  name?: string;
  school_year?: string;
  description?: string;
  avatar_url?: string;
  status?: string;
}

export interface AddStudentToClassroomRequest {
  student_id: string;
  status?: string;
}

export interface CreateStudentAndAddToClassroomRequest {
  full_name: string;
  student_code: string;
  phone_number?: string;
  parent_phone_number?: string;
  is_active?: boolean;
  status?: string;
}

export interface CreateStudentRequest {
  full_name: string;
  student_code: string;
  phone_number?: string;
  parent_phone_number?: string;
  is_active?: boolean;
}

export interface UpdateStudentRequest {
  full_name?: string;
  student_code?: string;
  phone_number?: string;
  parent_phone_number?: string;
  is_active?: boolean;
}

export interface StudentListResponse {
  success: boolean;
  data: {
    students: StudentBackend[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ClassroomApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ClassroomListResponse {
  success: boolean;
  data: {
    classrooms: ClassroomBackend[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ClassroomStudentsResponse {
  success: boolean;
  data: ClassroomStudentBackend[];
}

export interface LeaderboardEntry {
  student_id: string;
  full_name: string;
  student_code?: string;
  average_score: number;
  total_exams: number;
  rank: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardEntry[];
}

// ==================== SCORES ====================
export type ExamType =
  | "quiz"
  | "test"
  | "midterm"
  | "final"
  | "assignment"
  | "other";

export interface ScoreBackend {
  id: string;
  classroom_id: string;
  student_id: string;
  score: number;
  max_score: number;
  subject?: string;
  exam_name?: string;
  exam_type: ExamType;
  exam_date: string;
  quiz_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
  student_code?: string;
  // Joined student info
  student?: StudentBackend;
}

export interface CreateScoreRequest {
  student_id: string;
  score: number;
  max_score?: number;
  subject?: string;
  exam_name?: string;
  exam_type: ExamType;
  exam_date: string;
  quiz_id?: string;
  notes?: string;
}

export interface UpdateScoreRequest {
  score?: number;
  max_score?: number;
  subject?: string;
  exam_name?: string;
  exam_type?: ExamType;
  exam_date?: string;
  notes?: string;
}

export interface ScoreQueryParams {
  page?: number;
  limit?: number;
  subject?: string;
  exam_type?: ExamType;
}

export interface ScoreListResponse {
  success: boolean;
  data: {
    scores: ScoreBackend[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface StudentScoresResponse {
  success: boolean;
  data: {
    scores: ScoreBackend[];
    statistics: {
      total_exams: number;
      average_score: number;
      highest_score: number;
      lowest_score: number;
    };
  };
}

export interface UploadScoresRequest {
  file: File;
  subject: string;
  exam_name: string;
  exam_type: ExamType;
  max_score?: number;
  exam_date?: string;
  quiz_id?: string;
}

export interface UploadScoresResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    successCount: number;
    errorCount: number;
    success: Array<{
      row: number;
      student_code: string;
      student_name: string;
      score: number;
    }>;
    errors: Array<{
      row: number;
      data: Record<string, unknown>;
      message: string;
    }>;
  };
}

// ==================== PERFORMANCE (Extended) ====================
export interface ClassroomPerformanceResponse {
  success: boolean;
  data: StudentPerformanceBackend[];
}

export interface UpdateTeacherNotesRequest {
  teacher_notes: string;
}

export interface RecalculatePerformanceResponse {
  success: boolean;
  message: string;
  data: StudentPerformanceBackend;
}

export interface RecalculateAllPerformanceResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    updated: number;
  };
}

export interface LeaderboardQueryParams {
  order_by?: "score" | "participation" | "overall";
  limit?: number;
}

// ==================== STUDENT ====================
export interface Student {
  id: string;
  studentCode: string;
  name: string;
  email?: string;
  parentEmail?: string;
  phone?: string;
  parentPhone?: string;
  avatar?: string;
  classId: string;
  seatPosition?: SeatPosition;
  averageScore: number;
  totalParticipations: number;
  attendanceStatus: AttendanceStatus;
  participationStatus: ParticipationStatus;
  createdAt: string;
}

export interface SeatPosition {
  row: number;
  column: number;
}

export interface StudentProgress {
  month: string;
  score: number;
}

export interface ParticipationLog {
  id: string;
  sessionId: string;
  sessionDate: string;
  participationCount: number;
}

export interface StudentDetail extends Student {
  progressHistory: StudentProgress[];
  participationLogs: ParticipationLog[];
  teacherNotes: TeacherNote[];
}

export interface TeacherNote {
  id: string;
  content: string;
  createdAt: string;
}

// ==================== CLASSROOM ====================
export interface Classroom {
  id: string;
  name: string;
  grade: number;
  totalStudents: number;
  subjects: string[];
  rows: number;
  columns: number;
  createdAt: string;
}

export interface ClassSubject {
  id: string;
  classId: string;
  subject: string;
  teacherId: string;
}

// ==================== CLASS SESSION ====================
export interface ClassSession {
  id: string;
  classId: string;
  subject: string;
  startTime: string;
  endTime?: string;
  status: SessionStatus;
  totalRaisedHands: number;
  participationByRow: RowParticipation[];
  notes?: string;
}

export interface RowParticipation {
  row: number;
  count: number;
  percentage: number;
}

// ==================== RANDOM PICKER ====================
export type RandomTheme = "wheel" | "race" | "claw" | "boxes";

export interface ThemeConfig {
  id: RandomTheme;
  label: string;
}

export const RANDOM_THEMES: ThemeConfig[] = [
  { id: "wheel", label: "Vòng Quay" },
  { id: "race", label: "Đua Vịt" },
  { id: "claw", label: "Gắp Thú" },
  { id: "boxes", label: "Hộp Bí Ẩn" },
];

export interface GameThemeProps {
  students: Student[];
  pickCount: number;
  isPlaying: boolean;
  onComplete: (winners: Student[]) => void;
}

export interface RandomHistory {
  id: string;
  classId: string;
  className: string;
  timestamp: string;
  selectedStudents: SelectedStudent[];
}

export interface SelectedStudent {
  id: string;
  name: string;
  studentCode: string;
}

// ==================== CLASSROOM STATS ====================
export interface ClassroomStats {
  topActiveStudents: TopStudent[];
  totalRaisedHands: number;
  participationByRow: RowParticipation[];
}

export interface TopStudent {
  id: string;
  name: string;
  participationCount: number;
}

// ==================== SEATING CHART ====================
export interface SeatingChart {
  classId: string;
  rows: number;
  columns: number;
  seats: SeatData[][];
}

export interface SeatData {
  row: number;
  column: number;
  student: Student | null;
  isEmpty: boolean;
}

// ==================== HAND RAISES ====================
export interface HandRaiseStudent {
  student_id: string;
  add_count: number;
}

export interface BatchHandRaiseRequest {
  students: HandRaiseStudent[];
}

export interface HandRaiseData {
  id?: string;
  classroom_id: string;
  student_id: string;
  total_hand_raises: number;
  updated_at?: string;
  student?: StudentBackend;
  full_name?: string;
  student_code?: string;
}

export interface ClassroomHandRaisesResponse {
  success: boolean;
  data: {
    total_students: number;
    students: HandRaiseData[];
  };
}

export interface StudentHandRaiseResponse {
  success: boolean;
  data: HandRaiseData;
}

export interface BatchHandRaiseResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    successCount: number;
    errorCount: number;
    success: Array<{ student_id: string; added: number }>;
    errors: Array<{ student_id: string; error: string }>;
  };
}

// ==================== SESSION STORAGE ====================
export interface LocalClassSession {
  id: string;
  classroomId: string;
  classroomName: string;
  subject: string;
  startTime: string;
  endTime?: string;
  status: SessionStatus;
  handRaises: Record<string, number>; // studentId -> count
}
