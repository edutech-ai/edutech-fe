"use client";

import { Download, Trash2, Eye } from "lucide-react";
import type { Folder, Document } from "@/types";
import { formatFileSize } from "@/types/document";

interface FolderListViewProps {
  folders: Folder[];
  documents: Document[];
  selectedItems: Set<string>;
  onFolderClick: (folderId: string) => void;
  onSelectItem: (itemId: string) => void;
  onDownloadDocument: (document: Document) => void;
  onDeleteDocument: (document: Document) => void;
  onPreviewDocument: (document: Document, allDocuments: Document[]) => void;
}

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
      return "📄";
    case "docx":
    case "doc":
      return "📝";
    case "xlsx":
    case "xls":
      return "📊";
    case "pptx":
    case "ppt":
      return "📽️";
    case "image":
      return "🖼️";
    default:
      return "📄";
  }
};

export function FolderListView({
  folders,
  documents,
  selectedItems,
  onFolderClick,
  onSelectItem,
  onDownloadDocument,
  onDeleteDocument,
  onPreviewDocument,
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
        {documents.map((document) => {
          const isPreviewable =
            document.type === "image" ||
            document.type === "pdf" ||
            ["jpg", "jpeg", "png", "gif", "webp"].includes(
              document.type.toLowerCase()
            );

          return (
            <div
              key={document.id}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer group"
              onClick={() => onPreviewDocument(document, documents)}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectItem(document.id);
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.has(document.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                  }}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>
              <div className="shrink-0">
                <span className="text-2xl">{getFileIcon(document.type)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {document.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(document.file_size)} •{" "}
                  {document.type.toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isPreviewable && (
                  <button
                    className="p-2 rounded hover:bg-purple-100 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewDocument(document, documents);
                    }}
                    title="Xem trước"
                  >
                    <Eye className="w-4 h-4 text-purple-600" />
                  </button>
                )}
                <button
                  className="p-2 rounded hover:bg-blue-100 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadDocument(document);
                  }}
                  title="Tải xuống"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  className="p-2 rounded hover:bg-red-100 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDocument(document);
                  }}
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
