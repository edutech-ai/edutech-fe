"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Users,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useClassrooms, useDeleteClassroom } from "@/services/classroomService";
import { CreateClassroomModal } from "@/components/organisms/classroom/CreateClassroomModal";
import { EditClassroomModal } from "@/components/organisms/classroom/EditClassroomModal";
import { toast } from "sonner";
import type { ClassroomBackend } from "@/types/classroom";

type SortField = "name" | "school_year" | "student_count" | "created_at";
type SortOrder = "asc" | "desc";

export default function ClassroomListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingClassroom, setDeletingClassroom] =
    useState<ClassroomBackend | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] =
    useState<ClassroomBackend | null>(null);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Fetch classrooms
  const {
    data: classroomsResponse,
    isLoading,
    error,
  } = useClassrooms({ page: 1, limit: 100 });
  const deleteClassroomMutation = useDeleteClassroom();

  // Filter and sort classrooms
  const filteredClassrooms = useMemo(() => {
    const classrooms = classroomsResponse?.data?.classrooms ?? [];

    const result = classrooms.filter(
      (classroom) =>
        classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classroom.school_year?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "school_year":
          comparison = (a.school_year || "").localeCompare(b.school_year || "");
          break;
        case "student_count":
          comparison = (a.student_count || 0) - (b.student_count || 0);
          break;
        case "created_at":
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [classroomsResponse?.data?.classrooms, searchQuery, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleRowClick = (classroomId: string) => {
    router.push(`/dashboard/classroom/${classroomId}`);
  };

  const handleEdit = (e: React.MouseEvent, classroom: ClassroomBackend) => {
    e.stopPropagation();
    setEditingClassroom(classroom);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    classroom: ClassroomBackend
  ) => {
    e.stopPropagation();
    setDeletingClassroom(classroom);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingClassroom) return;

    try {
      await deleteClassroomMutation.mutateAsync(deletingClassroom.id);
      toast.success(`Đã xóa lớp "${deletingClassroom.name}" thành công!`);
    } catch {
      toast.error("Không thể xóa lớp học. Vui lòng thử lại!");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingClassroom(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <p className="text-red-500">
          Không thể tải danh sách lớp học. Vui lòng thử lại!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm lớp học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Create Button */}
          <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Tạo lớp mới
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Đang tải danh sách...</span>
          </div>
        ) : filteredClassrooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Users className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium mb-1">
              {searchQuery ? "Không tìm thấy lớp học" : "Chưa có lớp học nào"}
            </p>
            <p className="text-sm">
              {searchQuery
                ? "Thử tìm kiếm với từ khóa khác"
                : "Tạo lớp học đầu tiên để bắt đầu"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setCreateModalOpen(true)}
                className="mt-4 gap-2"
              >
                <Plus className="w-4 h-4" />
                Tạo lớp mới
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Tên lớp
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("school_year")}
                >
                  <div className="flex items-center gap-2">
                    Năm học
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 text-center"
                  onClick={() => handleSort("student_count")}
                >
                  <div className="flex items-center justify-center gap-2">
                    Sĩ số
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center gap-2">
                    Ngày tạo
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClassrooms.map((classroom) => (
                <TableRow
                  key={classroom.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(classroom.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {classroom.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {classroom.school_year || "-"}
                  </TableCell>
                  <TableCell className="text-center text-gray-600">
                    {classroom.student_count ?? 0}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(classroom.created_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => handleEdit(e, classroom)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => handleDeleteClick(e, classroom)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa lớp
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create Classroom Modal */}
      <CreateClassroomModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      {/* Edit Classroom Modal */}
      <EditClassroomModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        classroom={editingClassroom}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa lớp học</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa lớp &quot;{deletingClassroom?.name}
              &quot;? Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu
              học sinh trong lớp.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteClassroomMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Xóa lớp
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
