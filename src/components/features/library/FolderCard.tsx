"use client";

import { Folder, MoreVertical } from "lucide-react";

interface FolderCardProps {
  folder: {
    id: string;
    name: string;
    itemCount: number;
    createdAt: string;
    color: string;
  };
  isSelected: boolean;
  onClick: () => void;
  onSelect: () => void;
}

export function FolderCard({
  folder,
  isSelected,
  onClick,
  onSelect,
}: FolderCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
    green: "bg-green-100 text-green-600 hover:bg-green-200",
    purple: "bg-purple-100 text-purple-600 hover:bg-purple-200",
    yellow: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
    red: "bg-red-100 text-red-600 hover:bg-red-200",
  };

  const colorClass =
    colorClasses[folder.color as keyof typeof colorClasses] ||
    colorClasses.blue;

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
      <button
        className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <MoreVertical className="w-4 h-4 text-gray-600" />
      </button>

      {/* Folder Icon */}
      <div
        className={`w-16 h-16 mx-auto mb-3 rounded-lg flex items-center justify-center ${colorClass} transition-colors`}
      >
        <Folder className="w-8 h-8" />
      </div>

      {/* Folder Name */}
      <h3 className="text-sm font-medium text-gray-900 text-center truncate mb-1">
        {folder.name}
      </h3>

      {/* Item Count */}
      <p className="text-xs text-gray-500 text-center">
        {folder.itemCount} mục
      </p>
    </div>
  );
}
