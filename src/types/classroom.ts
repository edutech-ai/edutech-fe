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

// ==================== STUDENT ====================
export interface Student {
  id: string;
  studentCode: string;
  name: string;
  email?: string;
  parentEmail?: string;
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
