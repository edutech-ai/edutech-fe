"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  useClassroomById,
  useClassroomStudents,
  useClassrooms,
  useBatchUpdateHandRaises,
} from "@/services/classroomService";
import type {
  Student,
  RandomHistory,
  SeatingChart as SeatingChartType,
  ClassroomStats as ClassroomStatsType,
  Classroom,
  SeatData,
  LocalClassSession,
} from "@/types/classroom";
import {
  SessionStatus,
  AttendanceStatus,
  ParticipationStatus,
} from "@/types/classroom";
import { SessionStorageService } from "@/services/storage/sessionStorage";
import { toast } from "sonner";

const RANDOM_HISTORY_KEY = "edutech_random_history";
const MAX_HISTORY_ITEMS = 20;

function loadHistoryFromStorage(): RandomHistory[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RANDOM_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHistoryToStorage(history: RandomHistory[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RANDOM_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Ignore storage errors
  }
}

export function useClassroomPage(classroomId: string) {
  // Fetch classroom data
  const {
    data: classroomResponse,
    isLoading: isLoadingClassroom,
    error: classroomError,
  } = useClassroomById(classroomId);

  const { data: studentsResponse } = useClassroomStudents(classroomId);

  // Fetch all classrooms for selector
  const { data: allClassroomsResponse } = useClassrooms({ limit: 100 });

  // Batch update mutation
  const batchUpdateHandRaises = useBatchUpdateHandRaises();

  const classroom = classroomResponse?.data;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const students = studentsResponse?.data ?? [];

  // Session states
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(
    SessionStatus.NOT_STARTED
  );
  const [currentSession, setCurrentSession] =
    useState<LocalClassSession | null>(null);
  const [sessionHandRaises, setSessionHandRaises] = useState<
    Record<string, number>
  >({});

  // UI states
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Random picker states - load from localStorage
  const [randomHistory, setRandomHistory] = useState<RandomHistory[]>(() =>
    loadHistoryFromStorage()
  );

  // Sync history to localStorage when it changes
  useEffect(() => {
    saveHistoryToStorage(randomHistory);
  }, [randomHistory]);

  // Dialog states
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    const session = SessionStorageService.getSession();
    if (
      session &&
      session.status === SessionStatus.IN_PROGRESS &&
      session.classroomId === classroomId
    ) {
      setCurrentSession(session);
      setSessionStatus(SessionStatus.IN_PROGRESS);
      setSessionHandRaises(session.handRaises || {});
    }
  }, [classroomId]);

  // Create classroom object for current classroom
  const currentClassroom: Classroom | undefined = useMemo(() => {
    if (!classroom) return undefined;
    return {
      id: classroom.id,
      name: classroom.name,
      grade: 0,
      totalStudents: classroom.student_count || students.length,
      subjects: [],
      rows: Math.ceil(students.length / 6) || 5,
      columns: 6,
      createdAt: classroom.created_at,
    };
  }, [classroom, students.length]);

  // Combined classrooms for selector
  const allClassrooms: Classroom[] = useMemo(() => {
    const apiClassrooms = allClassroomsResponse?.data?.classrooms || [];
    return apiClassrooms.map((c) => ({
      id: c.id,
      name: c.name,
      grade: 0,
      totalStudents: c.student_count || 0,
      subjects: [],
      rows: 5,
      columns: 6,
      createdAt: c.created_at,
    }));
  }, [allClassroomsResponse]);

  // Convert backend students to UI format with performance data from response
  const uiStudents: Student[] = useMemo(() => {
    return students.map((s, index) => {
      return {
        id: s.student_id,
        studentCode: s.student_code || `STU${index + 1}`,
        name: s.full_name || "Học sinh",
        email: undefined,
        parentEmail: undefined,
        phone: s.phone_number,
        parentPhone: s.parent_phone_number,
        avatar: undefined,
        classId: classroomId,
        seatPosition: { row: Math.floor(index / 6), column: index % 6 },
        averageScore: s.average_score || 0,
        totalParticipations: s.total_hand_raises || 0,
        attendanceStatus: AttendanceStatus.PRESENT,
        participationStatus: ParticipationStatus.NOT_PARTICIPATED,
        createdAt: s.joined_at,
      };
    });
  }, [students, classroomId]);

  // Generate seating chart from real students
  const seatingChart: SeatingChartType | null = useMemo(() => {
    if (uiStudents.length === 0) return null;

    const rows = Math.ceil(uiStudents.length / 6) || 5;
    const columns = 6;
    const seats: SeatData[][] = [];

    for (let r = 0; r < rows; r++) {
      const row: SeatData[] = [];
      for (let c = 0; c < columns; c++) {
        const studentIndex = r * columns + c;
        const student = uiStudents[studentIndex] || null;
        row.push({
          row: r,
          column: c,
          student,
          isEmpty: !student,
        });
      }
      seats.push(row);
    }

    return {
      classId: classroomId,
      rows,
      columns,
      seats,
    };
  }, [classroomId, uiStudents]);

  // Generate classroom stats from real data
  const classroomStats: ClassroomStatsType | null = useMemo(() => {
    if (uiStudents.length === 0) return null;

    const sortedByParticipation = [...uiStudents].sort(
      (a, b) => b.totalParticipations - a.totalParticipations
    );

    const topActiveStudents = sortedByParticipation.slice(0, 5).map((s) => ({
      id: s.id,
      name: s.name,
      participationCount: s.totalParticipations,
    }));

    const totalRaisedHands = uiStudents.reduce(
      (sum, s) => sum + s.totalParticipations,
      0
    );

    // Calculate participation by row
    const rows = Math.ceil(uiStudents.length / 6) || 5;
    const participationByRow = Array.from({ length: rows }, (_, rowIndex) => {
      const rowStudents = uiStudents.filter(
        (s) => s.seatPosition?.row === rowIndex
      );
      const count = rowStudents.reduce(
        (sum, s) => sum + s.totalParticipations,
        0
      );
      return {
        row: rowIndex + 1,
        count,
        percentage:
          totalRaisedHands > 0
            ? Math.round((count / totalRaisedHands) * 100)
            : 0,
      };
    });

    return {
      topActiveStudents,
      totalRaisedHands,
      participationByRow,
    };
  }, [uiStudents]);

  // Session handlers
  const handleStartSession = useCallback(() => {
    if (classroom) {
      const session = SessionStorageService.startSession(
        classroomId,
        classroom.name,
        ""
      );
      setCurrentSession(session);
      setSessionStatus(SessionStatus.IN_PROGRESS);
      setSessionHandRaises({});
      toast.success("Bắt đầu tiết học thành công!");
    }
  }, [classroomId, classroom]);

  const handleEndSession = useCallback(() => {
    setShowEndSessionDialog(true);
  }, []);

  const handleConfirmEndSession = useCallback(
    async (notes: string) => {
      const handRaisesData = SessionStorageService.getHandRaisesForBatch();

      if (handRaisesData.length > 0) {
        try {
          await batchUpdateHandRaises.mutateAsync({
            classroomId,
            data: { students: handRaisesData },
          });
          toast.success(
            `Đã lưu ${handRaisesData.length} lượt giơ tay thành công!`
          );
        } catch (error) {
          console.error("Error saving hand raises:", error);
          toast.error("Lỗi khi lưu dữ liệu giơ tay");
        }
      }

      // End and clear session
      SessionStorageService.endSession();
      SessionStorageService.clearSession();

      setSessionStatus(SessionStatus.NOT_STARTED);
      setCurrentSession(null);
      setSessionHandRaises({});
      setShowEndSessionDialog(false);

      // eslint-disable-next-line no-console
      console.log("Session ended with notes:", notes);
      toast.success("Kết thúc tiết học thành công!");
    },
    [classroomId, batchUpdateHandRaises]
  );

  // Hand raise handlers
  const handleIncrementHandRaise = useCallback((studentId: string) => {
    const session = SessionStorageService.incrementHandRaise(studentId);
    if (session) {
      setSessionHandRaises({ ...session.handRaises });
    }
  }, []);

  const handleDecrementHandRaise = useCallback((studentId: string) => {
    const session = SessionStorageService.decrementHandRaise(studentId);
    if (session) {
      setSessionHandRaises({ ...session.handRaises });
    }
  }, []);

  const handleStudentClick = useCallback(
    (student: Student) => {
      setSelectedStudent(student);
      if (sessionStatus === SessionStatus.IN_PROGRESS) {
        handleIncrementHandRaise(student.id);
        toast.success(`+1 giơ tay cho ${student.name}`, {
          duration: 1500,
        });
      }
    },
    [sessionStatus, handleIncrementHandRaise]
  );

  // Handlers for Random Picker
  const handleAddHistory = useCallback((history: RandomHistory) => {
    setRandomHistory((prev) => [history, ...prev].slice(0, MAX_HISTORY_ITEMS));
  }, []);

  return {
    // Data
    classroom,
    isLoadingClassroom,
    classroomError,
    currentClassroom,
    allClassrooms,
    uiStudents,

    // Session state
    sessionStatus,
    currentSession,
    sessionHandRaises,
    seatingChart,
    classroomStats,
    selectedStudent,

    // Loading state
    isUpdatingHandRaises: batchUpdateHandRaises.isPending,

    // Random picker state
    randomHistory,

    // Dialog states
    showEndSessionDialog,
    showAddStudentModal,

    // Handlers
    handleStartSession,
    handleEndSession,
    handleConfirmEndSession,
    handleStudentClick,
    handleDecrementHandRaise,
    handleAddHistory,
    setShowEndSessionDialog,
    setShowAddStudentModal,
  };
}
