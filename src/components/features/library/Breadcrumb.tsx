"use client";

import { ChevronRight, Home, Folder } from "lucide-react";

export interface BreadcrumbItem {
  id: string;
  name: string;
  type?: "root" | "folder";
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (itemId: string) => void;
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-sm bg-white px-4 py-2.5 rounded-lg border border-gray-200">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isRoot = index === 0 || item.type === "root";

        return (
          <div key={item.id} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
            <button
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                isLast
                  ? "text-gray-900 font-medium bg-gray-100"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
              onClick={() => onNavigate(item.id)}
              disabled={isLast}
            >
              {isRoot ? (
                <Home className="w-4 h-4" />
              ) : (
                <Folder className="w-4 h-4" />
              )}
              <span className="max-w-[150px] truncate" title={item.name}>
                {item.name}
              </span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
