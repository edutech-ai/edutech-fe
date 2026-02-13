"use client";

import { Button } from "@/components/ui/button";
import { SeatingChart, ClassroomStats } from "../index";
import { Play, Square, Download, School, Hand } from "lucide-react";
import type {
  Classroom,
  Student,
  SeatingChart as SeatingChartType,
  ClassroomStats as ClassroomStatsType,
  LocalClassSession,
} from "@/types/classroom";
import { SessionStatus } from "@/types/classroom";

interface ClassroomTabProps {
  selectedClass?: Classroom;
  sessionStatus: SessionStatus;
  seatingChart: SeatingChartType | null;
  classroomStats: ClassroomStatsType | null;
  selectedStudent: Student | null;
  currentSession?: LocalClassSession | null;
  sessionHandRaises?: Record<string, number>;
  isLoading?: boolean;
  onStartSession: () => void;
  onEndSession: () => void;
  onStudentClick: (student: Student) => void;
  onDecrementHandRaise?: (studentId: string) => void;
}

export function ClassroomTab({
  sessionStatus,
  seatingChart,
  classroomStats,
  selectedStudent,
  selectedClass,
  currentSession,
  sessionHandRaises = {},
  isLoading = false,
  onStartSession,
  onEndSession,
  onStudentClick,
  onDecrementHandRaise,
}: ClassroomTabProps) {
  const totalHandRaises = Object.values(sessionHandRaises).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-blue-50 p-4">
        {/* Class Info */}
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
              onClick={onStartSession}
              disabled={!selectedClass}
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
                  Tổng: {totalHandRaises} lượt
                </span>
              </div>
              <Button
                onClick={onEndSession}
                variant="destructive"
                className="gap-2"
                disabled={isLoading}
              >
                <Square className="h-4 w-4" />
                {isLoading ? "Đang lưu..." : "Kết thúc tiết học"}
              </Button>
            </>
          )}

          <div className="flex items-center gap-2 border-l border-blue-200 pl-3">
            <Button variant="ghost" size="sm" className="gap-1.5 text-blue-700">
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
            <div className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-green-500" />
            </div>
            <span className="text-sm font-medium text-green-700">
              Tiết học đang diễn ra - Click vào học sinh để ghi nhận giơ tay
            </span>
          </div>
          <span className="text-xs text-green-600">
            Bắt đầu lúc{" "}
            {new Date(currentSession.startTime).toLocaleTimeString("vi-VN")}
          </span>
        </div>
      )}

      {/* Seating Chart & Stats */}
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <SeatingChart
            seatingChart={seatingChart}
            selectedStudent={selectedStudent}
            onStudentClick={onStudentClick}
            title={selectedClass?.name || "Sơ đồ lớp học"}
            sessionHandRaises={sessionHandRaises}
            isSessionActive={sessionStatus === SessionStatus.IN_PROGRESS}
            onDecrementHandRaise={onDecrementHandRaise}
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
    </div>
  );
}
