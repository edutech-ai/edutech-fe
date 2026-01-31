"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { StudentDataTable, StudentDetailPanel } from "../index";
import type { Classroom, Student } from "@/types/classroom";

interface DataTabProps {
  classrooms: Classroom[];
  students: Student[];
  selectedClassId: string;
  onClassChange: (id: string) => void;
  onAddStudent: () => void;
}

export function DataTab({
  classrooms,
  students,
  selectedClassId,
  onClassChange,
  onAddStudent,
}: DataTabProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleCloseDetail = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className={cn("lg:col-span-2", !selectedStudent && "lg:col-span-3")}>
        <StudentDataTable
          classrooms={classrooms}
          students={students}
          selectedClassId={selectedClassId}
          onClassChange={onClassChange}
          onStudentClick={handleStudentClick}
          onAddStudent={onAddStudent}
        />
      </div>
      {selectedStudent && (
        <div className="lg:col-span-1">
          <StudentDetailPanel
            student={selectedStudent}
            classroomId={selectedClassId}
            onClose={handleCloseDetail}
          />
        </div>
      )}
    </div>
  );
}
