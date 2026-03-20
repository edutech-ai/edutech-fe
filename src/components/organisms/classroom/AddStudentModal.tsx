"use client";

import { useState, useRef } from "react";
import {
  Loader2,
  UserPlus,
  Upload,
  FileSpreadsheet,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
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
  useUploadStudentsToClassroom,
  type UploadStudentsResponse,
} from "@/services/classroomService";
import { toast } from "sonner";

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
  const [activeTab, setActiveTab] = useState<"new" | "import">("new");

  // New student form state
  const [fullName, setFullName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [parentPhoneNumber, setParentPhoneNumber] = useState("");

  // Import file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<
    UploadStudentsResponse["data"] | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mutations
  const createStudentMutation = useCreateStudentAndAddToClassroom();
  const uploadMutation = useUploadStudentsToClassroom();

  const resetForm = () => {
    setFullName("");
    setStudentCode("");
    setPhoneNumber("");
    setParentPhoneNumber("");
    setSelectedFile(null);
    setUploadResult(null);
    setActiveTab("new");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      if (
        !validTypes.includes(file.type) &&
        !file.name.endsWith(".xlsx") &&
        !file.name.endsWith(".xls")
      ) {
        toast.error("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
        return;
      }
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file để upload");
      return;
    }

    try {
      const result = await uploadMutation.mutateAsync({
        classroomId,
        file: selectedFile,
      });

      const { successCount, errorCount, existingCount, total } = result.data;

      if (successCount > 0 && errorCount === 0) {
        // All success - close modal
        toast.success(`Đã thêm ${successCount} học sinh vào lớp!`);
        resetForm();
        onOpenChange(false);
        onSuccess?.();
      } else if (successCount > 0 && errorCount > 0) {
        // Partial success - show results but keep modal open
        setUploadResult(result.data);
        toast.warning(
          `Đã thêm ${successCount}/${total} học sinh. Có ${errorCount} lỗi.`
        );
        onSuccess?.();
      } else if (successCount === 0 && existingCount > 0 && errorCount === 0) {
        // All students already in class
        setUploadResult(result.data);
        toast.info(`Tất cả ${existingCount} học sinh đã có trong lớp.`);
      } else {
        // All errors
        setUploadResult(result.data);
        toast.error("Không thể thêm học sinh nào. Vui lòng kiểm tra file!");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err?.response?.data?.message ||
        "Không thể upload file. Vui lòng thử lại!";
      toast.error(message);
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const isPending = createStudentMutation.isPending || uploadMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Thêm học sinh vào lớp</DialogTitle>
          <DialogDescription>
            Tạo học sinh mới hoặc import danh sách từ file Excel
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "new" | "import")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Tạo mới
            </TabsTrigger>
            <TabsTrigger value="import" className="gap-2">
              <Upload className="w-4 h-4" />
              Import file
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

          {/* Tab: Import from File */}
          <TabsContent value="import" className="space-y-4 mt-4">
            {/* Template download info */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-800">
                <p>
                  Upload file Excel (.xlsx) chứa danh sách học sinh, hoặc{" "}
                  <a
                    href="/files/import_student_to_class.xlsx"
                    download
                    className="font-medium text-blue-600 hover:text-blue-800 underline"
                  >
                    tải file mẫu
                  </a>{" "}
                  để sử dụng.
                </p>
                <p className="mt-1 text-blue-600">
                  Các cột: student_code (bắt buộc), full_name (bắt buộc), phone,
                  parent_phone
                </p>
              </div>
            </div>

            {/* File input */}
            <div className="space-y-2">
              <Label htmlFor="file">Chọn file Excel</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="flex-1"
                />
              </div>
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  <span>{selectedFile.name}</span>
                  <span className="text-gray-400">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}
            </div>

            {/* Upload result */}
            {uploadResult && (
              <div className="space-y-3 border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Kết quả import</span>
                  <span className="text-sm text-gray-500">
                    Tổng: {uploadResult.total}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  {uploadResult.createdCount > 0 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tạo mới: {uploadResult.createdCount}</span>
                    </div>
                  )}
                  {uploadResult.addedCount > 0 && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Thêm vào lớp: {uploadResult.addedCount}</span>
                    </div>
                  )}
                  {uploadResult.existingCount > 0 && (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>Đã có trong lớp: {uploadResult.existingCount}</span>
                    </div>
                  )}
                  {uploadResult.errorCount > 0 && (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-4 h-4" />
                      <span>Lỗi: {uploadResult.errorCount}</span>
                    </div>
                  )}
                </div>

                {/* Show errors if any */}
                {uploadResult.errors.length > 0 && (
                  <div className="mt-2 max-h-25 overflow-y-auto">
                    <p className="text-sm font-medium text-red-600 mb-1">
                      Chi tiết lỗi:
                    </p>
                    <div className="space-y-1">
                      {uploadResult.errors.map((error, index) => (
                        <p key={index} className="text-xs text-red-500">
                          Dòng {error.row}: {error.message}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {uploadResult ? "Đóng" : "Hủy"}
          </Button>
          {activeTab === "new" ? (
            <Button onClick={handleCreateStudent} disabled={isPending}>
              {createStudentMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                "Thêm học sinh"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleUploadFile}
              disabled={isPending || !selectedFile}
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang upload...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
