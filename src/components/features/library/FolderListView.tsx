"use client";

import type { Folder } from "@/types";
import type { File } from "@/data/library";

interface FolderListViewProps {
  folders: Folder[];
  files: File[];
  selectedItems: Set<string>;
  onFolderClick: (folderId: string) => void;
  onSelectItem: (itemId: string) => void;
}

export function FolderListView({
  folders,
  files,
  selectedItems,
  onFolderClick,
  onSelectItem,
}: FolderListViewProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="divide-y">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => onFolderClick(folder.id)}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelectItem(folder.id);
              }}
            >
              <input
                type="checkbox"
                checked={selectedItems.has(folder.id)}
                onChange={(e) => {
                  e.stopPropagation();
                }}
                className="w-4 h-4 cursor-pointer"
              />
            </div>
            <div className="shrink-0">
              <span className="text-2xl">📁</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {folder.name}
              </p>
              <p className="text-sm text-gray-500">{folder.item_count} mục</p>
            </div>
          </div>
        ))}
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelectItem(file.id);
              }}
            >
              <input
                type="checkbox"
                checked={selectedItems.has(file.id)}
                onChange={(e) => {
                  e.stopPropagation();
                }}
                className="w-4 h-4 cursor-pointer"
              />
            </div>
            <div className="shrink-0">
              <span className="text-2xl">📄</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{file.name}</p>
              <p className="text-sm text-gray-500">
                {file.size} • {file.type.toUpperCase()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
