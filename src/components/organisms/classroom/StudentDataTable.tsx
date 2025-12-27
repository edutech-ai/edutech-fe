"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentInitials } from "@/components/atoms/StudentInitials";
import type { Classroom, Student } from "@/types/classroom";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

export interface StudentDataTableProps {
  classrooms: Classroom[];
  students: Student[];
  selectedClassId?: string;
  onClassChange: (classId: string) => void;
  onStudentClick: (student: Student) => void;
  className?: string;
}

type SortField =
  | "name"
  | "studentCode"
  | "averageScore"
  | "totalParticipations";
type SortDirection = "asc" | "desc";

const SortIcon = ({
  field,
  sortField,
  sortDirection,
}: {
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
}) => {
  if (sortField !== field) return null;
  return sortDirection === "asc" ? (
    <ChevronUp className="h-4 w-4" />
  ) : (
    <ChevronDown className="h-4 w-4" />
  );
};

export function StudentDataTable({
  classrooms,
  students,
  selectedClassId,
  onClassChange,
  onStudentClick,
  className,
}: StudentDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const selectedClass = classrooms.find((c) => c.id === selectedClassId);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedStudents = useMemo(() => {
    let result = [...students];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.studentCode.toLowerCase().includes(term) ||
          s.email?.toLowerCase().includes(term)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name, "vi");
          break;
        case "studentCode":
          comparison = a.studentCode.localeCompare(b.studentCode);
          break;
        case "averageScore":
          comparison = a.averageScore - b.averageScore;
          break;
        case "totalParticipations":
          comparison = a.totalParticipations - b.totalParticipations;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [students, searchTerm, sortField, sortDirection]);

  return (
    <Card className={cn("bg-white", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Chọn lớp
              </label>
              <Select value={selectedClassId} onValueChange={onClassChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  {classrooms.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Tìm kiếm
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm theo tên, mã học sinh, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[280px] pl-10"
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Hiển thị {filteredAndSortedStudents.length} / {students.length} học
            sinh
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Họ tên
                    <SortIcon
                      field="name"
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("studentCode")}
                >
                  <div className="flex items-center gap-1">
                    Mã HS
                    <SortIcon
                      field="studentCode"
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  </div>
                </TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead>Email phụ huynh</TableHead>
                <TableHead
                  className="cursor-pointer text-right hover:bg-gray-100"
                  onClick={() => handleSort("averageScore")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Điểm TB
                    <SortIcon
                      field="averageScore"
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer text-right hover:bg-gray-100"
                  onClick={() => handleSort("totalParticipations")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Lượt phát biểu
                    <SortIcon
                      field="totalParticipations"
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedStudents.length > 0 ? (
                filteredAndSortedStudents.map((student) => (
                  <TableRow
                    key={student.id}
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => onStudentClick(student)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <StudentInitials name={student.name} size="sm" />
                        <span className="font-medium text-gray-800">
                          {student.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {student.studentCode}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {selectedClass?.name || "-"}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {student.parentEmail || "-"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-semibold",
                        student.averageScore >= 8
                          ? "text-green-600"
                          : student.averageScore >= 6.5
                            ? "text-blue-600"
                            : "text-orange-600"
                      )}
                    >
                      {student.averageScore.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      {student.totalParticipations}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-gray-400"
                  >
                    {selectedClassId
                      ? "Không tìm thấy học sinh nào"
                      : "Vui lòng chọn lớp để xem danh sách học sinh"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
