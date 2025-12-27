import type {
  Student,
  Classroom,
  ClassSession,
  RandomHistory,
  ClassroomStats,
  SeatingChart,
  StudentDetail,
  SeatData,
} from "@/types/classroom";
import {
  ParticipationStatus,
  AttendanceStatus,
  SessionStatus,
} from "@/types/classroom";

// ==================== MOCK CLASSROOMS ====================
export const mockClassrooms: Classroom[] = [
  {
    id: "class-1",
    name: "Lớp 10A1",
    grade: 10,
    totalStudents: 40,
    subjects: ["Toán", "Vật Lý", "Hóa Học"],
    rows: 4,
    columns: 10,
    createdAt: "2024-09-01T00:00:00Z",
  },
  {
    id: "class-2",
    name: "Lớp 10A2",
    grade: 10,
    totalStudents: 38,
    subjects: ["Toán", "Ngữ Văn", "Tiếng Anh"],
    rows: 4,
    columns: 10,
    createdAt: "2024-09-01T00:00:00Z",
  },
  {
    id: "class-3",
    name: "Lớp 11B1",
    grade: 11,
    totalStudents: 42,
    subjects: ["Toán", "Vật Lý", "Sinh Học"],
    rows: 4,
    columns: 11,
    createdAt: "2024-09-01T00:00:00Z",
  },
];

// ==================== VIETNAMESE NAMES ====================
const lastNames = [
  "Nguyễn",
  "Trần",
  "Lê",
  "Phạm",
  "Hoàng",
  "Huỳnh",
  "Phan",
  "Vũ",
  "Võ",
  "Đặng",
];
const middleNames = [
  "Văn",
  "Thị",
  "Hoàng",
  "Minh",
  "Đức",
  "Thanh",
  "Ngọc",
  "Kim",
  "Xuân",
  "Bảo",
];

function generateVietnameseName(index: number): string {
  const lastName = lastNames[index % lastNames.length];
  const middleName = middleNames[(index + 3) % middleNames.length];
  const firstName = String.fromCharCode(65 + (index % 26)); // A-Z
  return `${lastName} ${middleName} ${firstName}`;
}

// ==================== MOCK STUDENTS ====================
function generateStudents(
  classId: string,
  className: string,
  count: number
): Student[] {
  const students: Student[] = [];

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / 10) + 1;
    const column = (i % 10) + 1;
    const name = generateVietnameseName(i);

    students.push({
      id: `${classId}-student-${i + 1}`,
      studentCode: `HS${String(i + 1).padStart(3, "0")}`,
      name,
      email: `student${i + 1}@school.edu.vn`,
      parentEmail: `parent.${name.toLowerCase().replace(/\s/g, "")}@example.com`,
      classId,
      seatPosition: { row, column },
      averageScore: Math.round((7 + Math.random() * 3) * 10) / 10,
      totalParticipations: Math.floor(Math.random() * 30),
      attendanceStatus:
        Math.random() > 0.1
          ? AttendanceStatus.PRESENT
          : AttendanceStatus.ABSENT,
      participationStatus: [
        ParticipationStatus.NOT_PARTICIPATED,
        ParticipationStatus.RAISED_HAND,
        ParticipationStatus.CALLED,
        ParticipationStatus.ANSWERED,
      ][Math.floor(Math.random() * 4)],
      createdAt: "2024-09-01T00:00:00Z",
    });
  }

  return students;
}

export const mockStudents: Record<string, Student[]> = {
  "class-1": generateStudents("class-1", "Lớp 10A1", 40),
  "class-2": generateStudents("class-2", "Lớp 10A2", 38),
  "class-3": generateStudents("class-3", "Lớp 11B1", 42),
};

// ==================== STUDENT DETAIL ====================
export function getMockStudentDetail(studentId: string): StudentDetail | null {
  for (const classId of Object.keys(mockStudents)) {
    const student = mockStudents[classId].find((s) => s.id === studentId);
    if (student) {
      return {
        ...student,
        progressHistory: [
          { month: "8/23", score: 7.0 },
          { month: "9/23", score: 7.5 },
          { month: "10/23", score: 8.0 },
          { month: "11/23", score: 8.5 },
        ],
        participationLogs: [
          {
            id: "log-1",
            sessionId: "session-1",
            sessionDate: "15/09/2023",
            participationCount: 2,
          },
          {
            id: "log-2",
            sessionId: "session-2",
            sessionDate: "22/09/2023",
            participationCount: 3,
          },
          {
            id: "log-3",
            sessionId: "session-3",
            sessionDate: "29/09/2023",
            participationCount: 4,
          },
          {
            id: "log-4",
            sessionId: "session-4",
            sessionDate: "06/10/2023",
            participationCount: 3,
          },
        ],
        teacherNotes: [
          {
            id: "note-1",
            content: "Học sinh có tiến bộ đều đặn qua các tháng.",
            createdAt: "2023-11-15T10:00:00Z",
          },
        ],
      };
    }
  }
  return null;
}

// ==================== SEATING CHART ====================
export function getMockSeatingChart(classId: string): SeatingChart | null {
  const classroom = mockClassrooms.find((c) => c.id === classId);
  const students = mockStudents[classId];

  if (!classroom || !students) return null;

  const seats: SeatData[][] = [];

  for (let row = 1; row <= classroom.rows; row++) {
    const rowSeats: SeatData[] = [];
    for (let col = 1; col <= classroom.columns; col++) {
      const student = students.find(
        (s) => s.seatPosition?.row === row && s.seatPosition?.column === col
      );
      rowSeats.push({
        row,
        column: col,
        student: student || null,
        isEmpty: !student,
      });
    }
    seats.push(rowSeats);
  }

  return {
    classId,
    rows: classroom.rows,
    columns: classroom.columns,
    seats,
  };
}

// ==================== CLASSROOM STATS ====================
export function getMockClassroomStats(classId: string): ClassroomStats {
  const students = mockStudents[classId] || [];

  const sortedByParticipation = [...students]
    .sort((a, b) => b.totalParticipations - a.totalParticipations)
    .slice(0, 5);

  const totalRaisedHands = students.reduce(
    (sum, s) => sum + s.totalParticipations,
    0
  );

  const participationByRow: {
    row: number;
    count: number;
    percentage: number;
  }[] = [];
  const rows = new Set(
    students.map((s) => s.seatPosition?.row).filter(Boolean)
  );

  rows.forEach((row) => {
    if (row) {
      const rowStudents = students.filter((s) => s.seatPosition?.row === row);
      const count = rowStudents.reduce(
        (sum, s) => sum + s.totalParticipations,
        0
      );
      participationByRow.push({
        row,
        count,
        percentage:
          totalRaisedHands > 0
            ? Math.round((count / totalRaisedHands) * 100)
            : 0,
      });
    }
  });

  return {
    topActiveStudents: sortedByParticipation.map((s) => ({
      id: s.id,
      name: s.name,
      participationCount: s.totalParticipations,
    })),
    totalRaisedHands,
    participationByRow: participationByRow.sort((a, b) => a.row - b.row),
  };
}

// ==================== CLASS SESSION ====================
export const mockActiveSessions: Record<string, ClassSession> = {};

export function startMockSession(
  classId: string,
  subject: string
): ClassSession {
  const session: ClassSession = {
    id: `session-${Date.now()}`,
    classId,
    subject,
    startTime: new Date().toISOString(),
    status: SessionStatus.IN_PROGRESS,
    totalRaisedHands: 0,
    participationByRow: [],
  };
  mockActiveSessions[classId] = session;
  return session;
}

export function endMockSession(classId: string): ClassSession | null {
  const session = mockActiveSessions[classId];
  if (session) {
    session.status = SessionStatus.ENDED;
    session.endTime = new Date().toISOString();
    delete mockActiveSessions[classId];
    return session;
  }
  return null;
}

// ==================== RANDOM HISTORY ====================
export const mockRandomHistory: RandomHistory[] = [];

export function addRandomHistory(
  classId: string,
  className: string,
  students: { id: string; name: string; studentCode: string }[]
): RandomHistory {
  const history: RandomHistory = {
    id: `random-${Date.now()}`,
    classId,
    className,
    timestamp: new Date().toISOString(),
    selectedStudents: students,
  };
  mockRandomHistory.unshift(history);

  // Keep only last 10 records
  if (mockRandomHistory.length > 10) {
    mockRandomHistory.pop();
  }

  return history;
}

// ==================== HELPER FUNCTIONS ====================
export function getStudentsByClass(classId: string): Student[] {
  return mockStudents[classId] || [];
}

export function getPresentStudents(classId: string): Student[] {
  return (mockStudents[classId] || []).filter(
    (s) => s.attendanceStatus === AttendanceStatus.PRESENT
  );
}

export function randomSelectStudents(
  classId: string,
  count: number,
  onlyPresent: boolean = true
): Student[] {
  const students = onlyPresent
    ? getPresentStudents(classId)
    : getStudentsByClass(classId);
  const shuffled = [...students].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, students.length));
}
