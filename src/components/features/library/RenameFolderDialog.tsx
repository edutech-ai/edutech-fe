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
import type { Folder } from "@/types";

interface RenameFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateFolder: (
    folderId: string,
    name: string,
    color: FolderColorBackend
  ) => void;
  folder: Folder | null;
  isLoading?: boolean;
}

export function RenameFolderDialog({
  open,
  onOpenChange,
  onUpdateFolder,
  folder,
  isLoading = false,
}: RenameFolderDialogProps) {
  const [folderName, setFolderName] = useState("");
  const [selectedColor, setSelectedColor] =
    useState<FolderColorBackend>("blue");
  const [error, setError] = useState("");
  const [prevOpen, setPrevOpen] = useState(false);

  // Initialize form with folder data when dialog transitions from closed to open
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open && folder) {
      setFolderName(folder.name);
      setSelectedColor(folder.color);
      setError("");
    }
  }

  const handleUpdate = () => {
    if (!folderName.trim()) {
      setError("Vui lòng nhập tên thư mục");
      return;
    }

    if (folderName.trim().length > 100) {
      setError("Tên thư mục không được quá 100 ký tự");
      return;
    }

    if (!folder) return;

    onUpdateFolder(folder.id, folderName.trim(), selectedColor);
  };

  const handleClose = () => {
    if (!isLoading) {
      setFolderName("");
      setSelectedColor("blue");
      setError("");
      onOpenChange(false);
    }
  };

  const hasChanges =
    folder &&
    (folderName.trim() !== folder.name || selectedColor !== folder.color);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Đổi tên thư mục</DialogTitle>
          <DialogDescription>
            Thay đổi tên và màu sắc cho thư mục
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Folder Preview */}
          <div className="flex justify-center">
            <div className="text-center">
              <FolderIcon color={selectedColor} size={80} />
              <p className="mt-2 text-sm font-medium text-gray-700">
                {folderName || "Thư mục"}
              </p>
            </div>
          </div>

          {/* Folder Name Input */}
          <div className="space-y-2">
            <Label htmlFor="folder-name-rename">
              Tên thư mục <span className="text-red-500">*</span>
            </Label>
            <Input
              id="folder-name-rename"
              placeholder="Nhập tên thư mục..."
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading && hasChanges) {
                  handleUpdate();
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
          <Button onClick={handleUpdate} disabled={isLoading || !hasChanges}>
            {isLoading ? (
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
