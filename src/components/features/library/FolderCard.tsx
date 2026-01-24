"use client";

import { MoreVertical, Share2, Trash2, Edit3, FolderInput } from "lucide-react";
import { FolderIcon } from "@/components/atoms/FolderIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Folder } from "@/types";

interface FolderCardProps {
  folder: Folder;
  isSelected: boolean;
  onClick: () => void;
  onSelect: () => void;
  onRename?: (folder: Folder) => void;
  onDelete?: (folder: Folder) => void;
  onShare?: (folder: Folder) => void;
  onMove?: (folder: Folder) => void;
}

export function FolderCard({
  folder,
  isSelected,
  onClick,
  onSelect,
  onRename,
  onDelete,
  onShare,
  onMove,
}: FolderCardProps) {
  return (
    <div
      className={`group relative rounded-lg border-2 ${
        isSelected
          ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-200"
          : "border-transparent bg-white hover:bg-gray-50"
      } p-3 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]`}
      onClick={onClick}
    >
      {/* Selection Checkbox */}
      <div
        className={`absolute top-3 left-3 transition-opacity ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
          }}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      </div>

      {/* More Menu */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1.5 rounded-md hover:bg-gray-200/80 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onRename && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onRename(folder);
                }}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Đổi tên
              </DropdownMenuItem>
            )}
            {onMove && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(folder);
                }}
              >
                <FolderInput className="w-4 h-4 mr-2" />
                Di chuyển
              </DropdownMenuItem>
            )}
            {onShare && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(folder);
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Chia sẻ
              </DropdownMenuItem>
            )}
            {(onRename || onMove || onShare) && onDelete && (
              <DropdownMenuSeparator />
            )}
            {onDelete && (
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(folder);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Folder Icon - Google Drive / Windows style */}
      <div className="flex justify-center mb-2 mt-2">
        <FolderIcon color={folder.color} size={56} />
      </div>

      {/* Folder Name */}
      <h3
        className="text-sm font-medium text-gray-900 text-center truncate px-2 mb-1"
        title={folder.name}
      >
        {folder.name}
      </h3>

      {/* Item Count */}
      <p className="text-xs text-gray-500 text-center">
        {folder.item_count} {folder.item_count === 1 ? "mục" : "mục"}
      </p>
    </div>
  );
}
