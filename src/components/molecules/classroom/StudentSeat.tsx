"use client";

import { cn } from "@/lib/utils";
import { StudentInitials } from "@/components/atoms/StudentInitials";
import type { Student, SeatData } from "@/types/classroom";
import { ParticipationStatus, AttendanceStatus } from "@/types/classroom";
import { Hand, Check, UserX } from "lucide-react";

export interface StudentSeatProps {
  seatData: SeatData;
  onClick?: (student: Student) => void;
  isSelected?: boolean;
  showStatus?: boolean;
  size?: "sm" | "md";
}

const statusIcons: Partial<Record<ParticipationStatus, typeof Hand>> = {
  [ParticipationStatus.RAISED_HAND]: Hand,
  [ParticipationStatus.CALLED]: Check,
  [ParticipationStatus.ANSWERED]: Check,
};

export function StudentSeat({
  seatData,
  onClick,
  isSelected = false,
  showStatus = true,
  size = "md",
}: StudentSeatProps) {
  const { student, isEmpty } = seatData;

  if (isEmpty || !student) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50",
          size === "sm" ? "h-16 w-14" : "h-20 w-16"
        )}
      >
        <span className="text-xs text-gray-400">Trống</span>
      </div>
    );
  }

  const isAbsent = student.attendanceStatus === AttendanceStatus.ABSENT;
  const StatusIcon = statusIcons[student.participationStatus];
  const hasParticipated =
    student.participationStatus !== ParticipationStatus.NOT_PARTICIPATED;

  return (
    <button
      type="button"
      onClick={() => onClick?.(student)}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 transition-all",
        size === "sm" ? "h-16 w-14 p-1" : "h-20 w-16 p-2",
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50",
        isAbsent && "opacity-50"
      )}
    >
      <div className="relative">
        <StudentInitials
          name={student.name}
          size={size === "sm" ? "sm" : "md"}
          className={isAbsent ? "grayscale" : ""}
        />
        {isAbsent && (
          <div className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5">
            <UserX className="h-2.5 w-2.5 text-white" />
          </div>
        )}
        {!isAbsent && showStatus && hasParticipated && StatusIcon && (
          <div
            className={cn(
              "absolute -right-1 -top-1 rounded-full p-0.5",
              student.participationStatus === ParticipationStatus.RAISED_HAND
                ? "bg-yellow-500"
                : "bg-green-500"
            )}
          >
            <StatusIcon className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>
      <span
        className={cn(
          "mt-1 truncate text-center font-medium",
          size === "sm" ? "max-w-12 text-[10px]" : "max-w-14 text-xs",
          isAbsent ? "text-gray-400" : "text-gray-700"
        )}
      >
        {student.name.split(" ").pop()}
      </span>
    </button>
  );
}
