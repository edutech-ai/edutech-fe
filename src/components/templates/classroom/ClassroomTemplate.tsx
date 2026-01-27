"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "@/components/organisms/classroom";
import {
  mockClassrooms,
  mockStudents,
  getMockSeatingChart,
  getMockClassroomStats,
  getMockStudentDetail,
} from "@/mock/classroom";
import type { Student as MockStudent } from "@/types/classroom";
import { AttendanceStatus, ParticipationStatus } from "@/types/classroom";
import type {
  Student,
  StudentDetail,
  RandomHistory,
  SeatingChart as SeatingChartType,
  ClassroomStats as ClassroomStatsType,
  SessionStatus,
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
} from "lucide-react";

export type ClassroomTab = "random" | "classroom" | "data";

export interface ClassroomTemplateProps {
  defaultTab?: ClassroomTab;
}

export function ClassroomTemplate({
  defaultTab = "classroom",
}: ClassroomTemplateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get tab from URL or use default
  const tabFromUrl = searchParams.get("tab") as ClassroomTab | null;
  const initialTab =
    tabFromUrl && ["random", "classroom", "data"].includes(tabFromUrl)
      ? tabFromUrl
      : defaultTab;

  // Tab state
  const [activeTab, setActiveTab] = useState<ClassroomTab>(initialTab);

  // Sync tab with URL
  const handleTabChange = useCallback(
    (tab: string) => {
      const newTab = tab as ClassroomTab;
      setActiveTab(newTab);
      router.push(`/dashboard/classroom?tab=${newTab}`, { scroll: false });
    },
    [router]
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
    "NOT_STARTED" as SessionStatus
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
  const [dataSelectedClassId, setDataSelectedClassId] = useState<string>("");
  const [studentDetail, setStudentDetail] = useState<StudentDetail | null>(
    null
  );

  // Dialog states
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);

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
      setSessionStatus("IN_PROGRESS" as SessionStatus);
    }
  }, [selectedClassId, selectedSubject]);

  const handleEndSession = useCallback(() => {
    setShowEndSessionDialog(true);
  }, []);

  const handleConfirmEndSession = useCallback((notes: string) => {
    // eslint-disable-next-line no-console
    console.log("Session ended with notes:", notes);
    setSessionStatus("NOT_STARTED" as SessionStatus);
    setShowEndSessionDialog(false);
  }, []);

  const handleStudentClick = useCallback((student: Student) => {
    setSelectedStudent(student);
  }, []);

  // Random picker state - using first classroom as default
  const defaultRandomClassId = mockClassrooms[0]?.id || "";

  // Handlers for Random Picker
  const handleAddHistory = useCallback((history: RandomHistory) => {
    setRandomHistory((prev) => [history, ...prev].slice(0, 10));
  }, []);

  // Get students for random picker (convert mock students to UI format)
  const randomStudents: MockStudent[] = defaultRandomClassId
    ? (mockStudents[defaultRandomClassId] || []).map((s) => ({
        ...s,
        attendanceStatus: AttendanceStatus.PRESENT,
        participationStatus: ParticipationStatus.NOT_PARTICIPATED,
      }))
    : [];

  const randomClassroom = mockClassrooms.find(
    (c) => c.id === defaultRandomClassId
  );

  // Handlers for Student Data
  const handleDataClassChange = useCallback((classId: string) => {
    setDataSelectedClassId(classId);
    setStudentDetail(null);
  }, []);

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
    // In real app, save to API
  }, []);

  // Get current class and students
  const selectedClass = mockClassrooms.find((c) => c.id === selectedClassId);
  const dataStudents = dataSelectedClassId
    ? mockStudents[dataSelectedClassId] || []
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100 p-1 rounded-lg">
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
              classrooms={mockClassrooms}
              students={randomStudents}
              currentClassroom={randomClassroom}
              randomHistory={randomHistory}
              onAddHistory={handleAddHistory}
            />
          </TabsContent>

          {/* Tab 2: Classroom Interface */}
          <TabsContent value="classroom" className="mt-6 space-y-4">
            {/* Controls Bar */}
            <div className="flex flex-wrap items-end justify-between gap-4 rounded-lg bg-blue-50 p-4">
              <ClassSelector
                classrooms={mockClassrooms}
                selectedClassId={selectedClassId}
                selectedSubject={selectedSubject}
                onClassChange={handleClassChange}
                onSubjectChange={handleSubjectChange}
              />

              <div className="flex items-center gap-3">
                {sessionStatus === ("NOT_STARTED" as SessionStatus) ? (
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
                  classrooms={mockClassrooms}
                  students={dataStudents}
                  selectedClassId={dataSelectedClassId}
                  onClassChange={handleDataClassChange}
                  onStudentClick={handleStudentRowClick}
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
    </div>
  );
}
