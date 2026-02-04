"use client";

import { useState, useCallback, useRef } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, Loader2, AlertCircle } from "lucide-react";
import {
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_EXTENSIONS,
  MAX_FILE_SIZE,
  formatFileSize,
} from "@/types/document";

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (
    file: File,
    name: string,
    description: string,
    folderId: string | null
  ) => Promise<void>;
  folderId: string | null;
  isLoading?: boolean;
  uploadProgress?: number;
}

const getFileIcon = (type: string) => {
  const iconProps = { className: "w-8 h-8" };

  switch (type.toLowerCase()) {
    case "pdf":
      return (
        <div className="text-red-600">
          <FileText {...iconProps} />
        </div>
      );
    case "docx":
    case "doc":
      return (
        <div className="text-blue-600">
          <FileText {...iconProps} />
        </div>
      );
    case "xlsx":
    case "xls":
      return (
        <div className="text-green-600">
          <FileText {...iconProps} />
        </div>
      );
    case "pptx":
    case "ppt":
      return (
        <div className="text-orange-600">
          <FileText {...iconProps} />
        </div>
      );
    default:
      return (
        <div className="text-gray-600">
          <FileText {...iconProps} />
        </div>
      );
  }
};

export function UploadDocumentDialog({
  open,
  onOpenChange,
  onUpload,
  folderId,
  isLoading = false,
  uploadProgress = 0,
}: UploadDocumentDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!ALLOWED_FILE_EXTENSIONS.includes(extension)) {
        return `Loại tệp không được hỗ trợ. Các loại được hỗ trợ: ${ALLOWED_FILE_EXTENSIONS.join(", ")}`;
      }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `Kích thước tệp vượt quá giới hạn ${formatFileSize(MAX_FILE_SIZE)}`;
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError("");

    // Auto-fill name from file name (without extension)
    const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    setDocumentName(nameWithoutExtension);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Vui lòng chọn tệp để tải lên");
      return;
    }

    const finalName = documentName.trim() || selectedFile.name;
    await onUpload(selectedFile, finalName, description.trim(), folderId);
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedFile(null);
      setDocumentName("");
      setDescription("");
      setError("");
      setIsDragging(false);
      onOpenChange(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setDocumentName("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split(".").pop()?.toLowerCase() || "";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tải lên tài liệu</DialogTitle>
          <DialogDescription>
            Tải lên tài liệu vào thư viện của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Drop Zone */}
          {!selectedFile && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                Kéo và thả tệp vào đây, hoặc
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                Chọn tệp
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={ALLOWED_FILE_EXTENSIONS.join(",")}
                onChange={handleFileInputChange}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-4">
                Hỗ trợ: PDF, Word, Excel, PowerPoint, Ảnh (tối đa{" "}
                {formatFileSize(MAX_FILE_SIZE)})
              </p>
            </div>
          )}

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  {getFileIcon(getFileExtension(selectedFile.name))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)} •{" "}
                    {getFileExtension(selectedFile.name).toUpperCase()}
                  </p>
                </div>
                {!isLoading && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    className="shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Upload Progress */}
              {isLoading && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Đang tải lên...</span>
                    <span className="text-gray-900 font-medium">
                      {uploadProgress}%
                    </span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>
          )}

          {/* Document Name Input */}
          {selectedFile && !isLoading && (
            <div className="space-y-2">
              <Label htmlFor="document-name">Tên tài liệu</Label>
              <Input
                id="document-name"
                placeholder="Nhập tên tài liệu..."
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                disabled={isLoading}
                maxLength={200}
              />
            </div>
          )}

          {/* Description Input */}
          {selectedFile && !isLoading && (
            <div className="space-y-2">
              <Label htmlFor="description">
                Mô tả <span className="text-gray-400">(tùy chọn)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả cho tài liệu..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={3}
                maxLength={500}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleUpload} disabled={isLoading || !selectedFile}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tải lên...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Tải lên
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
