"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StudentInitials } from "@/components/atoms/StudentInitials";
import { Check } from "lucide-react";

export interface EndSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (notes: string) => void;
  topStudent?: {
    name: string;
    participationCount: number;
  };
  className?: string;
}

export function EndSessionDialog({
  open,
  onOpenChange,
  onConfirm,
  topStudent,
}: EndSessionDialogProps) {
  const [notes, setNotes] = React.useState("");

  const handleConfirm = () => {
    onConfirm(notes);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center">Kết thúc tiết học</DialogTitle>
          <DialogDescription className="text-center">
            Tiết học đã kết thúc thành công. Gửi lời cảm ơn và thông kê nhanh.
          </DialogDescription>
        </DialogHeader>

        {topStudent && (
          <div className="my-4 flex items-center justify-center gap-4 rounded-lg bg-blue-50 p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Học sinh tích cực nhất</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <StudentInitials name={topStudent.name} size="md" />
                <span className="font-semibold text-gray-800">
                  {topStudent.name}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Ghi chú kết thúc
          </label>
          <Textarea
            placeholder="Nhập ghi chú cho tiết học này..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng và chỉnh sửa
          </Button>
          <Button onClick={handleConfirm}>Lưu và Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
