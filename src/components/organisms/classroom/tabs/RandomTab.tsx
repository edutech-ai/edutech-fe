"use client";

import { RandomPicker } from "../random-picker";
import type { Classroom, Student, RandomHistory } from "@/types/classroom";

interface RandomTabProps {
  classrooms: Classroom[];
  students: Student[];
  currentClassroom?: Classroom;
  randomHistory: RandomHistory[];
  onAddHistory: (history: RandomHistory) => void;
}

export function RandomTab({
  classrooms,
  students,
  currentClassroom,
  randomHistory,
  onAddHistory,
}: RandomTabProps) {
  return (
    <RandomPicker
      classrooms={classrooms}
      students={students}
      currentClassroom={currentClassroom}
      randomHistory={randomHistory}
      onAddHistory={onAddHistory}
    />
  );
}
