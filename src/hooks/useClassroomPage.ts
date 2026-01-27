"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  useClassroomById,
  useClassroomStudents,
} from "@/services/classroomService";
import {
  getMockSeatingChart,
  getMockClassroomStats,
  getMockStudentDetail,
  mockClassrooms,
  mockStudents,
} from "@/mock/classroom";
import type {
  Student,
  StudentDetail,
  RandomHistory,
  SeatingChart as SeatingChartType,
  ClassroomStats as ClassroomStatsType,
  Classroom,
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

  // Student data states
  const [studentDetail, setStudentDetail] = useState<StudentDetail | null>(
    null
  );

  // Dialog states
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Create mock classroom for current classroom
  const currentClassroom: Classroom | undefined = useMemo(() => {
    if (!classroom) return undefined;
    return {
      id: classroom.id,
      name: classroom.name,
      grade: 8,
      totalStudents: classroom.student_count || students.length,
      subjects: ["Toán", "Ngữ Văn", "Tiếng Anh"],
      rows: 5,
      columns: 6,
      createdAt: classroom.created_at,
    };
  }, [classroom, students.length]);

  // Combined classrooms for selector
  const allClassrooms = useMemo(() => {
    if (!currentClassroom) return mockClassrooms;
    return [
      currentClassroom,
      ...mockClassrooms.filter((c) => c.id !== currentClassroom.id),
    ];
  }, [currentClassroom]);

  // Convert backend students to UI format
  const uiStudents: Student[] = useMemo(() => {
    return students.map((s, index) => ({
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
      averageScore: 0,
      totalParticipations: 0,
      attendanceStatus: AttendanceStatus.PRESENT,
      participationStatus: ParticipationStatus.NOT_PARTICIPATED,
      createdAt: s.joined_at,
    }));
  }, [students, classroomId]);

  // Handlers for Classroom Interface
  const handleClassChange = useCallback((classId: string) => {
    setSelectedClassId(classId);
    setSelectedSubject("");
    setSeatingChart(getMockSeatingChart(classId));
    setClassroomStats(getMockClassroomStats(classId));
  }, []);

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

  // Handlers for Student Data
  const handleStudentRowClick = useCallback((student: Student) => {
    const detail = getMockStudentDetail(student.id);
    setStudentDetail(detail);
  }, []);

  const handleCloseStudentDetail = useCallback(() => {
    setStudentDetail(null);
  }, []);

  const handleSaveNote = useCallback((note: string) => {
    // eslint-disable-next-line no-console
    console.log("Saving note:", note);
  }, []);

  // Get current class and students for data table
  const dataStudents =
    selectedClassId === classroomId
      ? uiStudents
      : mockStudents[selectedClassId] || [];

  const selectedClass = allClassrooms.find((c) => c.id === selectedClassId);

  return {
    // Data
    classroom,
    isLoadingClassroom,
    classroomError,
    currentClassroom,
    allClassrooms,
    uiStudents,
    dataStudents,
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

    // Student data state
    studentDetail,

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
    handleStudentRowClick,
    handleCloseStudentDetail,
    handleSaveNote,
    setShowEndSessionDialog,
    setShowAddStudentModal,
  };
}
