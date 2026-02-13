"use client";

import { useState } from "react";
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
import { useCreateClassroom } from "@/services/classroomService";
import { toast } from "sonner";

interface CreateClassroomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function CreateClassroomModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateClassroomModalProps) {
  const [name, setName] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [description, setDescription] = useState("");

  const createClassroomMutation = useCreateClassroom();
  const schoolYearOptions = getSchoolYearOptions();

  const resetForm = () => {
    setName("");
    setSchoolYear("");
    setDescription("");
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên lớp học");
      return;
    }

    try {
      await createClassroomMutation.mutateAsync({
        name: name.trim(),
        school_year: schoolYear || undefined,
        description: description.trim() || undefined,
        status: "active",
      });

      toast.success(`Đã tạo lớp "${name}" thành công!`);
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Không thể tạo lớp học. Vui lòng thử lại!");
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo lớp học mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin lớp học để bắt đầu quản lý học sinh
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Class Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên lớp <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: 8A, 9B, Lớp Toán nâng cao..."
            />
          </div>

          {/* School Year */}
          <div className="space-y-2">
            <Label htmlFor="schoolYear">Năm học</Label>
            <Select value={schoolYear} onValueChange={setSchoolYear}>
              <SelectTrigger id="schoolYear">
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
            <Label htmlFor="description">Mô tả (không bắt buộc)</Label>
            <Textarea
              id="description"
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
            disabled={createClassroomMutation.isPending}
          >
            {createClassroomMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo lớp"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
