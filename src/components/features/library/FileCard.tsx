"use client";

import { FileText, MoreVertical, Download, Trash2 } from "lucide-react";

interface FileCardProps {
  file: {
    id: string;
    name: string;
    type: string;
    size: string;
    createdAt: string;
  };
  isSelected: boolean;
  onClick: () => void;
  onSelect: () => void;
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
  file,
  isSelected,
  onClick,
  onSelect,
}: FileCardProps) {
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

      {/* More Menu */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          className="p-1 rounded hover:bg-blue-100 transition"
          onClick={(e) => {
            e.stopPropagation();
          }}
          title="Tải xuống"
        >
          <Download className="w-4 h-4 text-blue-600" />
        </button>
        <button
          className="p-1 rounded hover:bg-red-100 transition"
          onClick={(e) => {
            e.stopPropagation();
          }}
          title="Xóa"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
        <button
          className="p-1 rounded hover:bg-gray-100 transition"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* File Icon */}
      <div
        className={`w-16 h-16 mx-auto mb-3 rounded-lg flex items-center justify-center ${getFileColor(file.type)}`}
      >
        {getFileIcon(file.type)}
      </div>

      {/* File Name */}
      <h3
        className="text-sm font-medium text-gray-900 text-center truncate mb-1"
        title={file.name}
      >
        {file.name}
      </h3>

      {/* File Size & Type */}
      <p className="text-xs text-gray-500 text-center">
        {file.size} • {file.type.toUpperCase()}
      </p>
    </div>
  );
}
