"use client";

import { Library } from "lucide-react";
import { FolderCard } from "./FolderCard";
import { FileCard } from "./FileCard";
import type { Folder, Document } from "@/types";

interface FolderGridViewProps {
  folders: Folder[];
  documents: Document[];
  selectedItems: Set<string>;
  onFolderClick: (folderId: string) => void;
  onSelectItem: (itemId: string) => void;
  onRenameFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
  onShareFolder: (folder: Folder) => void;
  onMoveFolder: (folder: Folder) => void;
  onDownloadDocument: (document: Document) => void;
  onDeleteDocument: (document: Document) => void;
  onPreviewDocument: (document: Document, allDocuments: Document[]) => void;
}

export function FolderGridView({
  folders,
  documents,
  selectedItems,
  onFolderClick,
  onSelectItem,
  onRenameFolder,
  onDeleteFolder,
  onShareFolder,
  onMoveFolder,
  onDownloadDocument,
  onDeleteDocument,
  onPreviewDocument,
}: FolderGridViewProps) {
  if (folders.length === 0 && documents.length === 0) {
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

      {/* Documents */}
      {documents.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Tài liệu</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {documents.map((document) => (
              <FileCard
                key={document.id}
                document={document}
                isSelected={selectedItems.has(document.id)}
                onClick={() => onPreviewDocument(document, documents)}
                onSelect={() => onSelectItem(document.id)}
                onDownload={() => onDownloadDocument(document)}
                onDelete={() => onDeleteDocument(document)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
