"use client";

import { useState } from "react";
import { Library, FolderPlus, Upload, Grid3x3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileManager } from "@/components/features/library/FileManager";
import { Breadcrumb } from "@/components/features/library/Breadcrumb";

export default function LibraryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPath, setCurrentPath] = useState<string[]>([
    "Thư viện của tôi",
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Library className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thư viện</h1>
              <p className="text-gray-600 mt-1">
                Quản lý đề thi, giáo án và tài liệu của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            {/* Left: Breadcrumb */}
            <Breadcrumb path={currentPath} onNavigate={setCurrentPath} />

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <FolderPlus className="w-4 h-4 mr-2" />
                Thư mục mới
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Tải lên
              </Button>

              {/* View Toggle */}
              <div className="flex items-center gap-1 ml-4 border-l pl-4">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* File Manager */}
        <FileManager
          viewMode={viewMode}
          currentPath={currentPath}
          onNavigate={setCurrentPath}
        />
      </div>
    </div>
  );
}
