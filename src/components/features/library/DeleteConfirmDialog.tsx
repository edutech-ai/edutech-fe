"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemCount: number;
  itemType?: "folder" | "file" | "quiz";
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  itemCount,
  itemType = "folder",
}: DeleteConfirmDialogProps) {
  const getItemName = () => {
    switch (itemType) {
      case "folder":
        return itemCount === 1 ? "thư mục" : "thư mục";
      case "file":
        return itemCount === 1 ? "tệp tin" : "tệp tin";
      case "quiz":
        return itemCount === 1 ? "đề thi" : "đề thi";
      default:
        return "mục";
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </div>
          <DialogDescription className="pt-3">
            Bạn có chắc chắn muốn xóa{" "}
            <span className="font-semibold text-gray-900">
              {itemCount} {getItemName()}
            </span>{" "}
            đã chọn không?
            <br />
            <br />
            <span className="text-red-600">
              Hành động này không thể hoàn tác.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Xóa {itemCount} {getItemName()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
