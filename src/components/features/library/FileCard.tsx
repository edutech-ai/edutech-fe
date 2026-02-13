"use client";

import { FileText, Download, Trash2, Eye } from "lucide-react";
import type { Document } from "@/types";
import { formatFileSize } from "@/types/document";

interface FileCardProps {
  document: Document;
  isSelected: boolean;
  onClick: () => void;
  onSelect: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
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

const getFileColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
      return "bg-red-100";
    case "docx":
    case "doc":
      return "bg-blue-100";
    case "xlsx":
    case "xls":
      return "bg-green-100";
    case "pptx":
    case "ppt":
      return "bg-orange-100";
    default:
      return "bg-gray-100";
  }
};

export function FileCard({
  document,
  isSelected,
  onClick,
  onSelect,
  onDownload,
  onDelete,
}: FileCardProps) {
  // Check if document is previewable (image or PDF)
  const isPreviewable =
    document.type === "image" ||
    document.type === "pdf" ||
    ["jpg", "jpeg", "png", "gif", "webp"].includes(document.type.toLowerCase());

  return (
    <div
      className={`group relative rounded-lg border ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      } p-4 cursor-pointer transition-all duration-200 hover:shadow-md`}
      onClick={onClick}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        {isPreviewable && (
          <button
            className="p-1 rounded hover:bg-purple-100 transition"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            title="Xem trước"
          >
            <Eye className="w-4 h-4 text-purple-600" />
          </button>
        )}
        {onDownload && (
          <button
            className="p-1 rounded hover:bg-blue-100 transition"
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            title="Tải xuống"
          >
            <Download className="w-4 h-4 text-blue-600" />
          </button>
        )}
        {onDelete && (
          <button
            className="p-1 rounded hover:bg-red-100 transition"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Xóa"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>

      {/* File Icon */}
      <div
        className={`w-16 h-16 mx-auto mb-3 rounded-lg flex items-center justify-center ${getFileColor(document.type)}`}
      >
        {getFileIcon(document.type)}
      </div>

      {/* File Name */}
      <h3
        className="text-sm font-medium text-gray-900 text-center truncate mb-1"
        title={document.name}
      >
        {document.name}
      </h3>

      {/* File Size & Type */}
      <p className="text-xs text-gray-500 text-center">
        {formatFileSize(document.file_size)} • {document.type.toUpperCase()}
      </p>
    </div>
  );
}
