"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { StudentInitials } from "@/components/atoms/StudentInitials";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Classroom, Student } from "@/types/classroom";
import { Button } from "@/components/ui/button";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  UserMinus,
  UserCheck,
  Loader2,
} from "lucide-react";
import {
  useUpdateStudent,
  useUpdateStudentStatus,
  useRemoveStudentFromClassroom,
} from "@/services/classroomService";
import { toast } from "sonner";

export interface StudentDataTableProps {
  classrooms: Classroom[];
  students: Student[];
  selectedClassId?: string;
  onClassChange: (classId: string) => void;
  onStudentClick: (student: Student) => void;
  onAddStudent?: () => void;
  className?: string;
}

type SortField =
  | "name"
  | "studentCode"
  | "averageScore"
  | "totalParticipations";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS = [
  { value: "active", label: "Đang học", color: "text-green-600 bg-green-50" },
  {
    value: "completed",
    label: "Đã hoàn thành",
    color: "text-blue-600 bg-blue-50",
  },
  { value: "dropped", label: "Đã nghỉ", color: "text-red-600 bg-red-50" },
];

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
  onAddStudent,
  className,
}: StudentDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Action states
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editFormData, setEditFormData] = useState({
    full_name: "",
    student_code: "",
    phone_number: "",
    parent_phone_number: "",
  });
  const [statusStudent, setStatusStudent] = useState<Student | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("active");
  const [removingStudent, setRemovingStudent] = useState<Student | null>(null);

  // Mutations
  const updateStudent = useUpdateStudent();
  const updateStudentStatus = useUpdateStudentStatus();
  const removeStudent = useRemoveStudentFromClassroom();

  const selectedClass = classrooms.find((c) => c.id === selectedClassId);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const filteredAndSortedStudents = useMemo(() => {
    let result = [...students];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.studentCode.toLowerCase().includes(term) ||
          s.phone?.toLowerCase().includes(term) ||
          s.parentPhone?.toLowerCase().includes(term)
      );
    }

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

  const totalPages = Math.ceil(
    filteredAndSortedStudents.length / ITEMS_PER_PAGE
  );
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedStudents.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedStudents, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Edit handlers
  const handleEditClick = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    setEditingStudent(student);
    setEditFormData({
      full_name: student.name,
      student_code: student.studentCode,
      phone_number: student.phone || "",
      parent_phone_number: student.parentPhone || "",
    });
  };

  const handleEditSave = async () => {
    if (!editingStudent) return;
    try {
      await updateStudent.mutateAsync({
        id: editingStudent.id,
        data: editFormData,
      });
      toast.success("Cập nhật thông tin học sinh thành công!");
      setEditingStudent(null);
    } catch {
      toast.error("Lỗi khi cập nhật thông tin học sinh");
    }
  };

  // Status handlers
  const handleStatusClick = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    setStatusStudent(student);
    setSelectedStatus("active");
  };

  const handleStatusSave = async () => {
    if (!statusStudent || !selectedClassId) return;
    try {
      await updateStudentStatus.mutateAsync({
        classroomId: selectedClassId,
        studentId: statusStudent.id,
        status: selectedStatus,
      });
      toast.success("Cập nhật trạng thái thành công!");
      setStatusStudent(null);
    } catch {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  // Remove handlers
  const handleRemoveClick = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    setRemovingStudent(student);
  };

  const handleRemoveConfirm = async () => {
    if (!removingStudent || !selectedClassId) return;
    try {
      await removeStudent.mutateAsync({
        classroomId: selectedClassId,
        studentId: removingStudent.id,
      });
      toast.success(`Đã xóa "${removingStudent.name}" khỏi lớp!`);
      setRemovingStudent(null);
    } catch {
      toast.error("Lỗi khi xóa học sinh khỏi lớp");
    }
  };

  return (
    <>
      <Card className={cn("bg-white", className)}>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Chọn lớp
                </label>
                <Select value={selectedClassId} onValueChange={onClassChange}>
                  <SelectTrigger className="w-35">
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
                    placeholder="Tìm theo tên, mã học sinh, SĐT..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-70 pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-500">
                Hiển thị {paginatedStudents.length} /{" "}
                {filteredAndSortedStudents.length} học sinh
              </p>
              {onAddStudent && (
                <Button onClick={onAddStudent} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Thêm học sinh
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
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
                  <TableHead>Lớp</TableHead>
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
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => onStudentClick(student)}
                    >
                      <TableCell className="text-gray-600">
                        {student.studentCode}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <StudentInitials name={student.name} size="sm" />
                          <span className="font-medium text-gray-800">
                            {student.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {selectedClass?.name || "-"}
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
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => handleEditClick(e, student)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => handleStatusClick(e, student)}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Cập nhật trạng thái
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => handleRemoveClick(e, student)}
                            >
                              <UserMinus className="mr-2 h-4 w-4" />
                              Xóa khỏi lớp
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

        {totalPages > 1 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <p className="text-sm text-gray-500">
              Trang {currentPage} / {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Edit Student Dialog */}
      <Dialog
        open={!!editingStudent}
        onOpenChange={(open) => !open && setEditingStudent(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin học sinh</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cho học sinh {editingStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Họ và tên</Label>
              <Input
                id="full_name"
                value={editFormData.full_name}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    full_name: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student_code">Mã học sinh</Label>
              <Input
                id="student_code"
                value={editFormData.student_code}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    student_code: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone_number">Số điện thoại</Label>
              <Input
                id="phone_number"
                value={editFormData.phone_number}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    phone_number: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="parent_phone_number">SĐT phụ huynh</Label>
              <Input
                id="parent_phone_number"
                value={editFormData.parent_phone_number}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    parent_phone_number: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStudent(null)}>
              Hủy
            </Button>
            <Button onClick={handleEditSave} disabled={updateStudent.isPending}>
              {updateStudent.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={!!statusStudent}
        onOpenChange={(open) => !open && setStatusStudent(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái</DialogTitle>
            <DialogDescription>
              Thay đổi trạng thái cho học sinh {statusStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Trạng thái</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className={cn("px-2 py-0.5 rounded", option.color)}>
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusStudent(null)}>
              Hủy
            </Button>
            <Button
              onClick={handleStatusSave}
              disabled={updateStudentStatus.isPending}
            >
              {updateStudentStatus.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Student Confirm Dialog */}
      <ConfirmDialog
        open={!!removingStudent}
        onOpenChange={(open) => !open && setRemovingStudent(null)}
        onConfirm={handleRemoveConfirm}
        title="Xóa học sinh khỏi lớp"
        description={`Bạn có chắc chắn muốn xóa "${removingStudent?.name}" khỏi lớp ${selectedClass?.name}? Học sinh sẽ không còn trong danh sách lớp này.`}
        confirmText="Xóa khỏi lớp"
        cancelText="Hủy"
        variant="destructive"
      />
    </>
  );
}
