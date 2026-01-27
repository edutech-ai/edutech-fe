"use client";

import { cn } from "@/lib/utils";
import { StudentDataTable, StudentDetailPanel } from "../index";
import type { Classroom, Student, StudentDetail } from "@/types/classroom";

interface DataTabProps {
  classrooms: Classroom[];
  students: Student[];
  selectedClassId: string;
  studentDetail: StudentDetail | null;
  onClassChange: (id: string) => void;
  onStudentClick: (student: Student) => void;
  onCloseStudentDetail: () => void;
  onSaveNote: (note: string) => void;
  onAddStudent: () => void;
}

export function DataTab({
  classrooms,
  students,
  selectedClassId,
  studentDetail,
  onClassChange,
  onStudentClick,
  onCloseStudentDetail,
  onSaveNote,
  onAddStudent,
}: DataTabProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className={cn("lg:col-span-2", !studentDetail && "lg:col-span-3")}>
        <StudentDataTable
          classrooms={classrooms}
          students={students}
          selectedClassId={selectedClassId}
          onClassChange={onClassChange}
          onStudentClick={onStudentClick}
          onAddStudent={onAddStudent}
        />
      </div>
      {studentDetail && (
        <div className="lg:col-span-1">
          <StudentDetailPanel
            student={studentDetail}
            onClose={onCloseStudentDetail}
            onSaveNote={onSaveNote}
          />
        </div>
      )}
    </div>
  );
}
