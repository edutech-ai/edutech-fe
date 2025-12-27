"use client";

import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  path: string[];
  onNavigate: (path: string[]) => void;
}

export function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
        onClick={() => onNavigate([path[0]])}
      >
        <Home className="w-4 h-4 text-blue-600" />
        <span className="font-medium text-gray-700">{path[0]}</span>
      </button>

      {path.slice(1).map((folder, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            className="px-2 py-1 rounded hover:bg-gray-100 transition-colors font-medium text-gray-700"
            onClick={() => onNavigate(path.slice(0, index + 2))}
          >
            {folder}
          </button>
        </div>
      ))}
    </div>
  );
}
