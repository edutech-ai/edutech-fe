"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateClassroom } from "@/services/classroomService";
import { toast } from "sonner";
import type { ClassroomBackend } from "@/types/classroom";

interface EditClassroomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroom: ClassroomBackend | null;
  onSuccess?: () => void;
}

// Generate school year options (current year and next 2 years)
const getSchoolYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const options = [];
  for (let i = -1; i <= 2; i++) {
    const startYear = currentYear + i;
    options.push(`${startYear}/${startYear + 1}`);
  }
  return options;
};

export function EditClassroomModal({
  open,
  onOpenChange,
  classroom,
  onSuccess,
}: EditClassroomModalProps) {
  const [name, setName] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [description, setDescription] = useState("");

  const updateClassroomMutation = useUpdateClassroom();
  const schoolYearOptions = getSchoolYearOptions();

  // Populate form when classroom changes
  useEffect(() => {
    if (classroom) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(classroom.name || "");
      setSchoolYear(classroom.school_year || "");
      setDescription(classroom.description || "");
    }
  }, [classroom]);

  const resetForm = () => {
    setName("");
    setSchoolYear("");
    setDescription("");
  };

  const handleSubmit = async () => {
    if (!classroom) return;

    // Validation
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên lớp học");
      return;
    }

    try {
      await updateClassroomMutation.mutateAsync({
        id: classroom.id,
        data: {
          name: name.trim(),
          school_year: schoolYear || undefined,
          description: description.trim() || undefined,
        },
      });

      toast.success(`Đã cập nhật lớp "${name}" thành công!`);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Không thể cập nhật lớp học. Vui lòng thử lại!");
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa lớp học</DialogTitle>
          <DialogDescription>Cập nhật thông tin lớp học</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Class Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">
              Tên lớp <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: 8A, 9B, Lớp Toán nâng cao..."
            />
          </div>

          {/* School Year */}
          <div className="space-y-2">
            <Label htmlFor="edit-schoolYear">Năm học</Label>
            <Select value={schoolYear} onValueChange={setSchoolYear}>
              <SelectTrigger id="edit-schoolYear">
                <SelectValue placeholder="Chọn năm học" />
              </SelectTrigger>
              <SelectContent>
                {schoolYearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Mô tả (không bắt buộc)</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Thêm ghi chú về lớp học..."
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={updateClassroomMutation.isPending}
          >
            {updateClassroomMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
