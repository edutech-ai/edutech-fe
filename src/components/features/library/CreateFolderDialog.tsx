"use client";

import { useState } from "react";
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
import { Loader2 } from "lucide-react";
import {
  FolderIcon,
  FolderColorPicker,
  type FolderColorBackend,
} from "@/components/atoms/FolderIcon";

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFolder: (
    name: string,
    color: FolderColorBackend,
    parentId: string | null
  ) => void;
  parentId?: string | null;
  isLoading?: boolean;
}

export function CreateFolderDialog({
  open,
  onOpenChange,
  onCreateFolder,
  parentId = null,
  isLoading = false,
}: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("");
  const [selectedColor, setSelectedColor] =
    useState<FolderColorBackend>("blue");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!folderName.trim()) {
      setError("Vui lòng nhập tên thư mục");
      return;
    }

    if (folderName.trim().length > 100) {
      setError("Tên thư mục không được quá 100 ký tự");
      return;
    }

    onCreateFolder(folderName.trim(), selectedColor, parentId);
  };

  const handleClose = () => {
    if (!isLoading) {
      setFolderName("");
      setSelectedColor("blue");
      setError("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Tạo thư mục mới</DialogTitle>
          <DialogDescription>
            Tạo thư mục mới để tổ chức tài liệu của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Folder Preview */}
          <div className="flex justify-center">
            <div className="text-center">
              <FolderIcon color={selectedColor} size={80} />
              <p className="mt-2 text-sm font-medium text-gray-700">
                {folderName || "Thư mục mới"}
              </p>
            </div>
          </div>

          {/* Folder Name Input */}
          <div className="space-y-2">
            <Label htmlFor="folder-name">
              Tên thư mục <span className="text-red-500">*</span>
            </Label>
            <Input
              id="folder-name"
              placeholder="Nhập tên thư mục..."
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleCreate();
                }
              }}
              className={error ? "border-red-500" : ""}
              disabled={isLoading}
              maxLength={100}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label>Màu sắc thư mục</Label>
            <FolderColorPicker
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo thư mục"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
