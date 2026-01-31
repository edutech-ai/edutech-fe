"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  useClassroomById,
  useClassroomStudents,
  useClassrooms,
} from "@/services/classroomService";
import type {
  Student,
  RandomHistory,
  SeatingChart as SeatingChartType,
  ClassroomStats as ClassroomStatsType,
  Classroom,
  SeatData,
} from "@/types/classroom";
import {
  SessionStatus,
  AttendanceStatus,
  ParticipationStatus,
} from "@/types/classroom";

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

  const classroom = classroomResponse?.data;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const students = studentsResponse?.data ?? [];

  // Classroom interface states
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(
    SessionStatus.NOT_STARTED
  );
  const [seatingChart, setSeatingChart] = useState<SeatingChartType | null>(
    null
  );
  const [classroomStats, setClassroomStats] =
    useState<ClassroomStatsType | null>(null);
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
  const generateSeatingChart = useCallback(
    (studentsToChart: Student[]): SeatingChartType => {
      const rows = Math.ceil(studentsToChart.length / 6) || 5;
      const columns = 6;
      const seats: SeatData[][] = [];

      for (let r = 0; r < rows; r++) {
        const row: SeatData[] = [];
        for (let c = 0; c < columns; c++) {
          const studentIndex = r * columns + c;
          const student = studentsToChart[studentIndex] || null;
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
    },
    [classroomId]
  );

  // Generate classroom stats from real data
  const generateClassroomStats = useCallback(
    (studentsToStat: Student[]): ClassroomStatsType => {
      const sortedByParticipation = [...studentsToStat].sort(
        (a, b) => b.totalParticipations - a.totalParticipations
      );

      const topActiveStudents = sortedByParticipation.slice(0, 5).map((s) => ({
        id: s.id,
        name: s.name,
        participationCount: s.totalParticipations,
      }));

      const totalRaisedHands = studentsToStat.reduce(
        (sum, s) => sum + s.totalParticipations,
        0
      );

      // Calculate participation by row
      const rows = Math.ceil(studentsToStat.length / 6) || 5;
      const participationByRow = Array.from({ length: rows }, (_, rowIndex) => {
        const rowStudents = studentsToStat.filter(
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
    },
    []
  );

  // Handlers for Classroom Interface
  const handleClassChange = useCallback(
    (classId: string) => {
      setSelectedClassId(classId);
      setSelectedSubject("");
      // Use real students data for the selected class
      if (classId === classroomId) {
        setSeatingChart(generateSeatingChart(uiStudents));
        setClassroomStats(generateClassroomStats(uiStudents));
      }
    },
    [classroomId, uiStudents, generateSeatingChart, generateClassroomStats]
  );

  const handleSubjectChange = useCallback((subject: string) => {
    setSelectedSubject(subject);
  }, []);

  const handleStartSession = useCallback(() => {
    if (selectedClassId && selectedSubject) {
      setSessionStatus(SessionStatus.IN_PROGRESS);
    }
  }, [selectedClassId, selectedSubject]);

  const handleEndSession = useCallback(() => {
    setShowEndSessionDialog(true);
  }, []);

  const handleConfirmEndSession = useCallback((notes: string) => {
    // eslint-disable-next-line no-console
    console.log("Session ended with notes:", notes);
    setSessionStatus(SessionStatus.NOT_STARTED);
    setShowEndSessionDialog(false);
  }, []);

  const handleStudentClick = useCallback((student: Student) => {
    setSelectedStudent(student);
  }, []);

  // Handlers for Random Picker
  const handleAddHistory = useCallback((history: RandomHistory) => {
    setRandomHistory((prev) => [history, ...prev].slice(0, MAX_HISTORY_ITEMS));
  }, []);

  const selectedClass = allClassrooms.find((c) => c.id === selectedClassId);

  return {
    // Data
    classroom,
    isLoadingClassroom,
    classroomError,
    currentClassroom,
    allClassrooms,
    uiStudents,
    selectedClass,

    // Classroom interface state
    selectedClassId,
    selectedSubject,
    sessionStatus,
    seatingChart,
    classroomStats,
    selectedStudent,

    // Random picker state
    randomHistory,

    // Dialog states
    showEndSessionDialog,
    showAddStudentModal,

    // Handlers
    setSelectedClassId,
    handleClassChange,
    handleSubjectChange,
    handleStartSession,
    handleEndSession,
    handleConfirmEndSession,
    handleStudentClick,
    handleAddHistory,
    setShowEndSessionDialog,
    setShowAddStudentModal,
  };
}
