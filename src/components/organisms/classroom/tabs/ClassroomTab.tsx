"use client";

import { Button } from "@/components/ui/button";
import { ClassSelector } from "@/components/molecules/classroom";
import { SeatingChart, ClassroomStats } from "../index";
import { Play, Square, FileText, BarChart3, Download } from "lucide-react";
import type {
  Classroom,
  Student,
  SeatingChart as SeatingChartType,
  ClassroomStats as ClassroomStatsType,
} from "@/types/classroom";
import { SessionStatus } from "@/types/classroom";

interface ClassroomTabProps {
  classrooms: Classroom[];
  selectedClassId: string;
  selectedSubject: string;
  sessionStatus: SessionStatus;
  seatingChart: SeatingChartType | null;
  classroomStats: ClassroomStatsType | null;
  selectedStudent: Student | null;
  selectedClass?: Classroom;
  onClassChange: (classId: string) => void;
  onSubjectChange: (subject: string) => void;
  onStartSession: () => void;
  onEndSession: () => void;
  onStudentClick: (student: Student) => void;
}

export function ClassroomTab({
  classrooms,
  selectedClassId,
  selectedSubject,
  sessionStatus,
  seatingChart,
  classroomStats,
  selectedStudent,
  selectedClass,
  onClassChange,
  onSubjectChange,
  onStartSession,
  onEndSession,
  onStudentClick,
}: ClassroomTabProps) {
  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-lg bg-blue-50 p-4">
        <ClassSelector
          classrooms={classrooms}
          selectedClassId={selectedClassId}
          selectedSubject={selectedSubject}
          onClassChange={onClassChange}
          onSubjectChange={onSubjectChange}
        />

        <div className="flex items-center gap-3">
          {sessionStatus === SessionStatus.NOT_STARTED ? (
            <Button
              onClick={onStartSession}
              disabled={!selectedClassId || !selectedSubject}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Play className="h-4 w-4" />
              Bắt đầu tiết học
            </Button>
          ) : (
            <Button
              onClick={onEndSession}
              variant="destructive"
              className="gap-2"
            >
              <Square className="h-4 w-4" />
              Kết thúc tiết học
            </Button>
          )}

          <div className="flex items-center gap-2 border-l border-blue-200 pl-3">
            <Button variant="ghost" size="sm" className="gap-1.5 text-blue-700">
              <FileText className="h-4 w-4" />
              Ghi chú
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-blue-700">
              <BarChart3 className="h-4 w-4" />
              Thống kê
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-blue-700">
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
            onStudentClick={onStudentClick}
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
    </div>
  );
}
