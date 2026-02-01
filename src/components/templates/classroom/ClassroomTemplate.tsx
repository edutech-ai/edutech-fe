"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/mock/classroom";
import type {
  Student as MockStudent,
  LocalClassSession,
} from "@/types/classroom";
import {
  AttendanceStatus,
  ParticipationStatus,
  SessionStatus,
} from "@/types/classroom";
import type {
  Student,
  RandomHistory,
  SeatingChart as SeatingChartType,
  ClassroomStats as ClassroomStatsType,
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
  Hand,
} from "lucide-react";
import { SessionStorageService } from "@/services/storage/sessionStorage";
import { useBatchUpdateHandRaises } from "@/services/classroomService";
import { toast } from "sonner";

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
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync tab state with URL
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Classroom interface states - auto-select first classroom
  const defaultClassId = mockClassrooms[0]?.id || "";
  const [selectedClassId] = useState<string>(defaultClassId);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(
    SessionStatus.NOT_STARTED
  );
  const [seatingChart, setSeatingChart] = useState<SeatingChartType | null>(
    () => (defaultClassId ? getMockSeatingChart(defaultClassId) : null)
  );
  const [classroomStats, setClassroomStats] =
    useState<ClassroomStatsType | null>(() =>
      defaultClassId ? getMockClassroomStats(defaultClassId) : null
    );
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentSession, setCurrentSession] =
    useState<LocalClassSession | null>(null);
  const [sessionHandRaises, setSessionHandRaises] = useState<
    Record<string, number>
  >({});

  // Random picker states
  const [randomHistory, setRandomHistory] = useState<RandomHistory[]>([]);

  // API mutation for batch hand raises
  const batchUpdateHandRaises = useBatchUpdateHandRaises();

  // Load session from localStorage on mount
  // This is an initialization effect to restore session state
  useEffect(() => {
    const session = SessionStorageService.getSession();
    if (session && session.status === SessionStatus.IN_PROGRESS) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initialization from localStorage
      setCurrentSession(session);
      setSessionStatus(SessionStatus.IN_PROGRESS);
      setSessionHandRaises(session.handRaises || {});
      // Load seating chart for the session's classroom
      const chart = getMockSeatingChart(session.classroomId);
      setSeatingChart(chart);
      const stats = getMockClassroomStats(session.classroomId);
      setClassroomStats(stats);
    }
  }, []);

  // Student data states
  const [dataSelectedClassId, setDataSelectedClassId] = useState<string>("");
  const [selectedDataStudent, setSelectedDataStudent] =
    useState<Student | null>(null);

  // Dialog states
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);

  // Handlers for Classroom Interface
  const handleStartSession = useCallback(() => {
    if (selectedClassId) {
      const classroom = mockClassrooms.find((c) => c.id === selectedClassId);
      const session = SessionStorageService.startSession(
        selectedClassId,
        classroom?.name || "",
        "" // No subject required
      );
      setCurrentSession(session);
      setSessionStatus(SessionStatus.IN_PROGRESS);
      setSessionHandRaises({});
      toast.success("Bắt đầu tiết học thành công!");
    }
  }, [selectedClassId]);

  const handleEndSession = useCallback(() => {
    setShowEndSessionDialog(true);
  }, []);

  const handleConfirmEndSession = useCallback(
    async (notes: string) => {
      // Get hand raises data from localStorage
      const handRaisesData = SessionStorageService.getHandRaisesForBatch();

      if (handRaisesData.length > 0 && selectedClassId) {
        try {
          // Call API to batch update hand raises
          await batchUpdateHandRaises.mutateAsync({
            classroomId: selectedClassId,
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

      // Reset states
      setSessionStatus(SessionStatus.NOT_STARTED);
      setCurrentSession(null);
      setSessionHandRaises({});
      setShowEndSessionDialog(false);

      // eslint-disable-next-line no-console
      console.log("Session ended with notes:", notes);
      toast.success("Kết thúc tiết học thành công!");
    },
    [selectedClassId, batchUpdateHandRaises]
  );

  // Handle hand raise increment
  const handleIncrementHandRaise = useCallback((studentId: string) => {
    const session = SessionStorageService.incrementHandRaise(studentId);
    if (session) {
      setSessionHandRaises({ ...session.handRaises });
    }
  }, []);

  // Handle hand raise decrement
  const handleDecrementHandRaise = useCallback((studentId: string) => {
    const session = SessionStorageService.decrementHandRaise(studentId);
    if (session) {
      setSessionHandRaises({ ...session.handRaises });
    }
  }, []);

  const handleStudentClick = useCallback(
    (student: Student) => {
      setSelectedStudent(student);
      // If session is in progress, increment hand raise
      if (sessionStatus === SessionStatus.IN_PROGRESS) {
        handleIncrementHandRaise(student.id);
        toast.success(`+1 giơ tay cho ${student.name}`, {
          duration: 1500,
        });
      }
    },
    [sessionStatus, handleIncrementHandRaise]
  );

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
    setSelectedDataStudent(null);
  }, []);

  const handleStudentRowClick = useCallback((student: Student) => {
    setSelectedDataStudent(student);
  }, []);

  const handleCloseStudentDetail = useCallback(() => {
    setSelectedDataStudent(null);
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
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-blue-50 p-4">
              {/* Class Name Display */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                  <School className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {selectedClass?.name || "Lớp học"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedClass?.totalStudents || 0} học sinh
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {sessionStatus === SessionStatus.NOT_STARTED ? (
                  <Button
                    onClick={handleStartSession}
                    disabled={!selectedClassId}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="h-4 w-4" />
                    Bắt đầu tiết học
                  </Button>
                ) : (
                  <>
                    <div className="flex items-center gap-2 rounded-md bg-green-100 px-3 py-1.5 text-green-700">
                      <Hand className="h-4 w-4" />
                      <span className="font-medium">
                        Tổng:{" "}
                        {Object.values(sessionHandRaises).reduce(
                          (a, b) => a + b,
                          0
                        )}{" "}
                        lượt
                      </span>
                    </div>
                    <Button
                      onClick={handleEndSession}
                      variant="destructive"
                      className="gap-2"
                      disabled={batchUpdateHandRaises.isPending}
                    >
                      <Square className="h-4 w-4" />
                      {batchUpdateHandRaises.isPending
                        ? "Đang lưu..."
                        : "Kết thúc tiết học"}
                    </Button>
                  </>
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

            {/* Session Info Banner */}
            {sessionStatus === SessionStatus.IN_PROGRESS && currentSession && (
              <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-3 w-3 items-center justify-center">
                    <span className="absolute h-3 w-3 animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm font-medium text-green-700">
                    Tiết học đang diễn ra - Click vào học sinh để ghi nhận giơ
                    tay
                  </span>
                </div>
                <span className="text-xs text-green-600">
                  Bắt đầu lúc{" "}
                  {new Date(currentSession.startTime).toLocaleTimeString(
                    "vi-VN"
                  )}
                </span>
              </div>
            )}

            {/* Seating Chart & Stats */}
            <div className="grid gap-4 lg:grid-cols-4">
              <div className="lg:col-span-3">
                <SeatingChart
                  seatingChart={seatingChart}
                  selectedStudent={selectedStudent}
                  onStudentClick={handleStudentClick}
                  title={selectedClass?.name || "Sơ đồ lớp học"}
                  sessionHandRaises={sessionHandRaises}
                  isSessionActive={sessionStatus === SessionStatus.IN_PROGRESS}
                  onDecrementHandRaise={handleDecrementHandRaise}
                />
              </div>
              <div className="lg:col-span-1">
                <ClassroomStats
                  stats={classroomStats}
                  sessionHandRaises={sessionHandRaises}
                  isSessionActive={sessionStatus === SessionStatus.IN_PROGRESS}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Student Data */}
          <TabsContent value="data" className="mt-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <div
                className={cn(
                  "lg:col-span-2",
                  !selectedDataStudent && "lg:col-span-3"
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
              {selectedDataStudent && (
                <div className="lg:col-span-1">
                  <StudentDetailPanel
                    student={selectedDataStudent}
                    classroomId={dataSelectedClassId}
                    onClose={handleCloseStudentDetail}
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
        sessionHandRaises={sessionHandRaises}
        isLoading={batchUpdateHandRaises.isPending}
      />
    </div>
  );
}
