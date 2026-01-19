"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassSelector } from "@/components/molecules/classroom";
import {
  SeatingChart,
  ClassroomStats,
  RandomPicker,
  StudentDataTable,
  StudentDetailPanel,
  EndSessionDialog,
  AddStudentModal,
} from "@/components/organisms/classroom";
import {
  useClassroomById,
  useClassroomStudents,
} from "@/services/classroomService";
import {
  mockClassrooms,
  mockStudents,
  getMockSeatingChart,
  getMockClassroomStats,
  getMockStudentDetail,
  randomSelectStudents,
  getPresentStudents,
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
import {
  Shuffle,
  School,
  FileSpreadsheet,
  Play,
  Square,
  FileText,
  BarChart3,
  Download,
  Users,
  Loader2,
} from "lucide-react";
import { ActionButton } from "@/components/molecules/action-button";
import Image from "next/image";

export type ClassroomTab = "random" | "classroom" | "data";

export default function ClassroomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const classroomId = params.id as string;

  // Fetch classroom data
  const {
    data: classroomResponse,
    isLoading: isLoadingClassroom,
    error: classroomError,
  } = useClassroomById(classroomId);

  const { data: studentsResponse } = useClassroomStudents(classroomId);

  const classroom = classroomResponse?.data;
  const students = studentsResponse?.data ?? [];

  // Get tab from URL or use default
  const tabFromUrl = searchParams.get("tab") as ClassroomTab | null;
  const initialTab =
    tabFromUrl && ["random", "classroom", "data"].includes(tabFromUrl)
      ? tabFromUrl
      : "data";

  // Tab state
  const [activeTab, setActiveTab] = useState<ClassroomTab>(initialTab);

  // Sync tab with URL
  const handleTabChange = useCallback(
    (tab: string) => {
      const newTab = tab as ClassroomTab;
      setActiveTab(newTab);
      router.push(`/dashboard/classroom/${classroomId}?tab=${newTab}`, {
        scroll: false,
      });
    },
    [router, classroomId]
  );

  // Update state when URL changes
  useEffect(() => {
    if (tabFromUrl && ["random", "classroom", "data"].includes(tabFromUrl)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

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

  // Random picker states
  const [randomHistory, setRandomHistory] = useState<RandomHistory[]>([]);

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
      grade: 8, // Default grade
      totalStudents: classroom.student_count || students.length,
      subjects: ["Toán", "Ngữ Văn", "Tiếng Anh"],
      rows: 5,
      columns: 6,
      createdAt: classroom.created_at,
    };
  }, [classroom, students.length]);

  // Combined classrooms for selector (current + mock ones)
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
    const chart = getMockSeatingChart(classId);
    setSeatingChart(chart);
    const stats = getMockClassroomStats(classId);
    setClassroomStats(stats);
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
    console.log("Session ended with notes:", notes);
    setSessionStatus(SessionStatus.NOT_STARTED);
    setShowEndSessionDialog(false);
  }, []);

  const handleStudentClick = useCallback((student: Student) => {
    setSelectedStudent(student);
  }, []);

  // Handlers for Random Picker
  const handleRandomSelect = useCallback(
    (classId: string, count: number, onlyPresent: boolean) => {
      // Use real students if available for current classroom
      if (classId === classroomId && uiStudents.length > 0) {
        const availableStudents = onlyPresent
          ? uiStudents.filter(
              (s) => s.attendanceStatus === AttendanceStatus.PRESENT
            )
          : uiStudents;
        const shuffled = [...availableStudents].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
      }
      return randomSelectStudents(classId, count, onlyPresent);
    },
    [classroomId, uiStudents]
  );

  const handleAddHistory = useCallback((history: RandomHistory) => {
    setRandomHistory((prev) => [history, ...prev].slice(0, 10));
  }, []);

  const handleGetPresentCount = useCallback(
    (classId: string) => {
      if (classId === classroomId && uiStudents.length > 0) {
        return uiStudents.filter(
          (s) => s.attendanceStatus === AttendanceStatus.PRESENT
        ).length;
      }
      return getPresentStudents(classId).length;
    },
    [classroomId, uiStudents]
  );

  // Handlers for Student Data
  const handleStudentRowClick = useCallback((student: Student) => {
    const detail = getMockStudentDetail(student.id);
    setStudentDetail(detail);
  }, []);

  const handleCloseStudentDetail = useCallback(() => {
    setStudentDetail(null);
  }, []);

  const handleSaveNote = useCallback((note: string) => {
    console.log("Saving note:", note);
    // In real app, save to API
  }, []);

  const handleBack = () => {
    router.push("/dashboard/classroom");
  };

  // Get current class and students for selector
  const selectedClass = allClassrooms.find((c) => c.id === selectedClassId);
  const dataStudents =
    selectedClassId === classroomId
      ? uiStudents
      : mockStudents[selectedClassId] || [];

  // Loading state
  if (isLoadingClassroom) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">
          Đang tải thông tin lớp học...
        </span>
      </div>
    );
  }

  // Error state
  if (classroomError || !classroom) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Users className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">Không tìm thấy lớp học</p>
        <Button onClick={handleBack}>Quay lại danh sách</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ActionButton
        isBack
        href="/dashboard/classroom"
        label="Quay lại danh sách lớp học"
      />

      <div className="bg-white border-b border-gray-200 px-4 py-4 mt-2">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/images/util/classroom.svg"
                alt="Classroom Icon"
                width={40}
                height={40}
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {classroom.name}{" "}
                {classroom.school_year && (
                  <span className="font-normal text-gray-500">
                    {classroom.school_year}
                  </span>
                )}
              </h1>
              <p className="text-sm text-gray-500">
                {classroom.student_count || students.length} học sinh
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto py-6">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger
              value="random"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all"
            >
              <Shuffle className="h-4 w-4" />
              Random Học Sinh
            </TabsTrigger>
            <TabsTrigger
              value="classroom"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all"
            >
              <School className="h-4 w-4" />
              Giao Diện Lớp Học
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Dữ Liệu Học Sinh
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Random Student */}
          <TabsContent value="random" className="mt-6">
            <RandomPicker
              classrooms={allClassrooms}
              randomHistory={randomHistory}
              onRandomSelect={handleRandomSelect}
              onAddHistory={handleAddHistory}
              getPresentCount={handleGetPresentCount}
            />
          </TabsContent>

          {/* Tab 2: Classroom Interface */}
          <TabsContent value="classroom" className="mt-6 space-y-4">
            {/* Controls Bar */}
            <div className="flex flex-wrap items-end justify-between gap-4 rounded-lg bg-blue-50 p-4">
              <ClassSelector
                classrooms={allClassrooms}
                selectedClassId={selectedClassId}
                selectedSubject={selectedSubject}
                onClassChange={handleClassChange}
                onSubjectChange={handleSubjectChange}
              />

              <div className="flex items-center gap-3">
                {sessionStatus === SessionStatus.NOT_STARTED ? (
                  <Button
                    onClick={handleStartSession}
                    disabled={!selectedClassId || !selectedSubject}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="h-4 w-4" />
                    Bắt đầu tiết học
                  </Button>
                ) : (
                  <Button
                    onClick={handleEndSession}
                    variant="destructive"
                    className="gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Kết thúc tiết học
                  </Button>
                )}

                <div className="flex items-center gap-2 border-l border-blue-200 pl-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-blue-700"
                  >
                    <FileText className="h-4 w-4" />
                    Ghi chú
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-blue-700"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Thống kê
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-blue-700"
                  >
                    <Download className="h-4 w-4" />
                    Xuất báo cáo
                  </Button>
                </div>
              </div>
            </div>

            {/* Seating Chart & Stats */}
            <div className="grid gap-4 lg:grid-cols-4">
              <div className="lg:col-span-3">
                <SeatingChart
                  seatingChart={seatingChart}
                  selectedStudent={selectedStudent}
                  onStudentClick={handleStudentClick}
                  title={
                    selectedClass && selectedSubject
                      ? `${selectedClass.name} - ${selectedSubject}`
                      : selectedClass
                        ? `${selectedClass.name} - Chọn môn học`
                        : "Chọn lớp học"
                  }
                />
              </div>
              <div className="lg:col-span-1">
                <ClassroomStats stats={classroomStats} />
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Student Data */}
          <TabsContent value="data" className="mt-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <div
                className={cn(
                  "lg:col-span-2",
                  !studentDetail && "lg:col-span-3"
                )}
              >
                <StudentDataTable
                  classrooms={allClassrooms}
                  students={
                    selectedClassId === classroomId || !selectedClassId
                      ? uiStudents
                      : dataStudents
                  }
                  selectedClassId={selectedClassId || classroomId}
                  onClassChange={(id) => setSelectedClassId(id)}
                  onStudentClick={handleStudentRowClick}
                  onAddStudent={() => setShowAddStudentModal(true)}
                />
              </div>
              {studentDetail && (
                <div className="lg:col-span-1">
                  <StudentDetailPanel
                    student={studentDetail}
                    onClose={handleCloseStudentDetail}
                    onSaveNote={handleSaveNote}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* End Session Dialog */}
      <EndSessionDialog
        open={showEndSessionDialog}
        onOpenChange={setShowEndSessionDialog}
        onConfirm={handleConfirmEndSession}
        topStudent={classroomStats?.topActiveStudents[0]}
      />

      {/* Add Student Modal */}
      <AddStudentModal
        open={showAddStudentModal}
        onOpenChange={setShowAddStudentModal}
        classroomId={classroomId}
      />
    </div>
  );
}
