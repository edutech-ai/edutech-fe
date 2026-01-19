"use client";

import { useState } from "react";
import { Loader2, UserPlus, Search, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCreateStudentAndAddToClassroom,
  useAddExistingStudentToClassroom,
  useStudents,
} from "@/services/classroomService";
import { toast } from "sonner";
import type { StudentBackend } from "@/types/classroom";

interface AddStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroomId: string;
  onSuccess?: () => void;
}

export function AddStudentModal({
  open,
  onOpenChange,
  classroomId,
  onSuccess,
}: AddStudentModalProps) {
  const [activeTab, setActiveTab] = useState<"new" | "existing">("new");

  // New student form state
  const [fullName, setFullName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [parentPhoneNumber, setParentPhoneNumber] = useState("");

  // Existing student search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentBackend | null>(
    null
  );

  // Mutations
  const createStudentMutation = useCreateStudentAndAddToClassroom();
  const addExistingMutation = useAddExistingStudentToClassroom();

  // Query for searching existing students
  const { data: studentsData, isLoading: isLoadingStudents } = useStudents(
    { search: searchQuery, limit: 10 },
    { enabled: activeTab === "existing" && searchQuery.length >= 2 }
  );

  const students = studentsData?.data?.students ?? [];

  const resetForm = () => {
    setFullName("");
    setStudentCode("");
    setPhoneNumber("");
    setParentPhoneNumber("");
    setSearchQuery("");
    setSelectedStudent(null);
    setActiveTab("new");
  };

  const handleCreateStudent = async () => {
    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ tên học sinh");
      return;
    }
    if (!studentCode.trim()) {
      toast.error("Vui lòng nhập mã học sinh");
      return;
    }

    try {
      await createStudentMutation.mutateAsync({
        classroomId,
        data: {
          full_name: fullName.trim(),
          student_code: studentCode.trim(),
          phone_number: phoneNumber.trim() || undefined,
          parent_phone_number: parentPhoneNumber.trim() || undefined,
          is_active: true,
          status: "active",
        },
      });

      toast.success(`Đã thêm học sinh "${fullName}" vào lớp!`);
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err?.response?.data?.message ||
        "Không thể thêm học sinh. Vui lòng thử lại!";
      toast.error(message);
    }
  };

  const handleAddExistingStudent = async () => {
    if (!selectedStudent) {
      toast.error("Vui lòng chọn học sinh");
      return;
    }

    try {
      await addExistingMutation.mutateAsync({
        classroomId,
        data: {
          student_id: selectedStudent.id,
          status: "active",
        },
      });

      toast.success(`Đã thêm học sinh "${selectedStudent.full_name}" vào lớp!`);
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err?.response?.data?.message ||
        "Không thể thêm học sinh. Vui lòng thử lại!";
      toast.error(message);
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const isPending =
    createStudentMutation.isPending || addExistingMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm học sinh vào lớp</DialogTitle>
          <DialogDescription>
            Tạo học sinh mới hoặc thêm học sinh đã có trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "new" | "existing")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Tạo mới
            </TabsTrigger>
            <TabsTrigger value="existing" className="gap-2">
              <Search className="w-4 h-4" />
              Tìm kiếm
            </TabsTrigger>
          </TabsList>

          {/* Tab: Create New Student */}
          <TabsContent value="new" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Họ tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentCode">
                Mã học sinh <span className="text-red-500">*</span>
              </Label>
              <Input
                id="studentCode"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                placeholder="HS001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại học sinh</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0123456789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentPhoneNumber">Số điện thoại phụ huynh</Label>
              <Input
                id="parentPhoneNumber"
                value={parentPhoneNumber}
                onChange={(e) => setParentPhoneNumber(e.target.value)}
                placeholder="0987654321"
              />
            </div>
          </TabsContent>

          {/* Tab: Search Existing Student */}
          <TabsContent value="existing" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="search">Tìm kiếm học sinh</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedStudent(null);
                  }}
                  placeholder="Nhập tên hoặc mã học sinh..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="border rounded-lg max-h-[200px] overflow-y-auto">
              {isLoadingStudents ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : searchQuery.length < 2 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Nhập ít nhất 2 ký tự để tìm kiếm
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Không tìm thấy học sinh nào
                </div>
              ) : (
                <div className="divide-y">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => setSelectedStudent(student)}
                      className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left ${
                        selectedStudent?.id === student.id
                          ? "bg-blue-50 border-l-2 border-blue-500"
                          : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {student.full_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {student.student_code}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedStudent && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  Đã chọn: <strong>{selectedStudent.full_name}</strong> (
                  {selectedStudent.student_code})
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            onClick={
              activeTab === "new"
                ? handleCreateStudent
                : handleAddExistingStudent
            }
            disabled={
              isPending || (activeTab === "existing" && !selectedStudent)
            }
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang thêm...
              </>
            ) : (
              "Thêm học sinh"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
