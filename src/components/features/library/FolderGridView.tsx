"use client";

import { Library } from "lucide-react";
import { FolderCard } from "./FolderCard";
import { FileCard } from "./FileCard";
import type { Folder } from "@/types";
import type { File } from "@/data/library";

interface FolderGridViewProps {
  folders: Folder[];
  files: File[];
  selectedItems: Set<string>;
  onFolderClick: (folderId: string) => void;
  onSelectItem: (itemId: string) => void;
  onRenameFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
  onShareFolder: (folder: Folder) => void;
  onMoveFolder: (folder: Folder) => void;
}

export function FolderGridView({
  folders,
  files,
  selectedItems,
  onFolderClick,
  onSelectItem,
  onRenameFolder,
  onDeleteFolder,
  onShareFolder,
  onMoveFolder,
}: FolderGridViewProps) {
  if (folders.length === 0 && files.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <Library className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p className="text-lg font-medium mb-1">Thư mục trống</p>
        <p className="text-sm">Tạo thư mục mới hoặc tải lên tài liệu</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Folders */}
      {folders.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Thư mục</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                isSelected={selectedItems.has(folder.id)}
                onClick={() => onFolderClick(folder.id)}
                onSelect={() => onSelectItem(folder.id)}
                onRename={onRenameFolder}
                onDelete={onDeleteFolder}
                onShare={onShareFolder}
                onMove={onMoveFolder}
              />
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {files.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Tệp tin</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                isSelected={selectedItems.has(file.id)}
                onClick={() => {
                  // console.log("Open file:", file.id);
                }}
                onSelect={() => onSelectItem(file.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
