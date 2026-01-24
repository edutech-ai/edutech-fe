"use client";

import { ChevronRight, Home } from "lucide-react";
import type { FolderPath } from "@/types";

interface LibraryBreadcrumbProps {
  folderPath: FolderPath[];
  onNavigateToRoot: () => void;
  onNavigateToFolder: (folderId: string) => void;
}

export function LibraryBreadcrumb({
  folderPath,
  onNavigateToRoot,
  onNavigateToFolder,
}: LibraryBreadcrumbProps) {
  if (folderPath.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-600 bg-white rounded-lg border border-gray-200 px-4 py-2">
      <button
        onClick={onNavigateToRoot}
        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Thư viện</span>
      </button>
      {folderPath.map((item, index) => (
        <div key={item.id} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {index === folderPath.length - 1 ? (
            <span className="font-medium text-gray-900">{item.name}</span>
          ) : (
            <button
              onClick={() => onNavigateToFolder(item.id)}
              className="hover:text-blue-600 transition-colors"
            >
              {item.name}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}
