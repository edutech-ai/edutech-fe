"use client";

import { FolderPlus, Upload, Grid3x3, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LibraryToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onCreateFolder: () => void;
  canCreateSubfolder: boolean;
}

export function LibraryToolbar({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  viewMode,
  onViewModeChange,
  onCreateFolder,
  canCreateSubfolder,
}: LibraryToolbarProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm trong thư viện..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery) {
                onSearchSubmit();
              }
            }}
            className="pl-10"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCreateFolder}
            disabled={!canCreateSubfolder}
            title={
              !canCreateSubfolder
                ? "Đã đạt giới hạn độ sâu thư mục (tối đa 3 cấp)"
                : undefined
            }
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  {!canCreateSubfolder
                    ? "Tạo thư mục con (không khả dụng - tối đa 3 cấp)"
                    : "Tạo thư mục mới"}
                </span>
              </TooltipTrigger>
              <TooltipContent className="mb-2">
                Tạo thư mục mới trong thư mục hiện tại
              </TooltipContent>
            </Tooltip>
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            <Tooltip>
              <TooltipTrigger asChild>
                <span>Tải lên</span>
              </TooltipTrigger>
              <TooltipContent className="mb-2">
                Tải lên tệp vào thư mục (pdf, docs)
              </TooltipContent>
            </Tooltip>
          </Button>

          {/* View Toggle */}
          <div className="flex items-center gap-1 ml-4 border-l pl-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => onViewModeChange("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xem dạng lưới</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => onViewModeChange("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xem dạng danh sách</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
