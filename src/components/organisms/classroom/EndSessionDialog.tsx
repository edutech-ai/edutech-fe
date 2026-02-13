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
import { Check } from "lucide-react";

export interface EndSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (notes: string) => void;
  sessionHandRaises?: Record<string, number>;
  isLoading?: boolean;
}

export function EndSessionDialog({
  open,
  onOpenChange,
  onConfirm,
  sessionHandRaises = {},
  isLoading = false,
}: EndSessionDialogProps) {
  const [notes, setNotes] = React.useState("");

  const handleConfirm = () => {
    onConfirm(notes);
    setNotes("");
  };

  const sessionTotal = Object.values(sessionHandRaises).reduce(
    (a, b) => a + b,
    0
  );
  const sessionStudentCount = Object.keys(sessionHandRaises).filter(
    (k) => sessionHandRaises[k] > 0
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center">Kết thúc tiết học</DialogTitle>
          <DialogDescription className="text-center">
            Xác nhận kết thúc tiết học và lưu dữ liệu giơ tay.
          </DialogDescription>
        </DialogHeader>

        {/* Session Summary */}
        <div className="my-4 grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{sessionTotal}</p>
            <p className="text-xs text-gray-600">Tổng lượt giơ tay</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {sessionStudentCount}
            </p>
            <p className="text-xs text-gray-600">Học sinh tham gia</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Ghi chú kết thúc
          </label>
          <Textarea
            placeholder="Nhập ghi chú cho tiết học này..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-20"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Đang lưu..." : "Lưu và Kết thúc"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
