"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Home, FolderIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Folder } from "@/types";

interface MoveFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMoveFolder: (folderId: string, newParentId: string | null) => void;
  folder: Folder | null;
  folders: Folder[];
  currentFolderId: string | null;
  isLoading?: boolean;
}

export function MoveFolderDialog({
  open,
  onOpenChange,
  onMoveFolder,
  folder,
  folders,
  isLoading = false,
}: MoveFolderDialogProps) {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null
  );
  const [prevOpen, setPrevOpen] = useState(false);

  // Reset state when dialog transitions from closed to open
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setSelectedDestination(null);
    }
  }

  const handleMove = () => {
    if (!folder) return;
    onMoveFolder(folder.id, selectedDestination);
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedDestination(null);
      onOpenChange(false);
    }
  };

  // Filter out the folder being moved and its children to prevent circular moves
  const getAvailableDestinations = (): Folder[] => {
    if (!folder) return folders;

    // Simple filter: exclude the folder itself
    // Note: Backend should handle preventing moving to own children
    return folders.filter((f) => f.id !== folder.id);
  };

  const availableDestinations = getAvailableDestinations();

  // Check if a destination is valid (not the current parent)
  const isCurrentLocation = (destinationId: string | null) => {
    return folder?.parent_id === destinationId;
  };

  const canMove =
    selectedDestination !== undefined &&
    !isCurrentLocation(selectedDestination) &&
    selectedDestination !== folder?.id;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Di chuyển thư mục</DialogTitle>
          <DialogDescription>
            Chọn thư mục đích để di chuyển &quot;{folder?.name}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Current folder info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Di chuyển:</p>
            <p className="font-medium text-gray-900">{folder?.name}</p>
          </div>

          {/* Destination selection */}
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {/* Root option */}
            <button
              type="button"
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                selectedDestination === null
                  ? "bg-blue-50 border-2 border-blue-500"
                  : "hover:bg-gray-50 border-2 border-transparent",
                isCurrentLocation(null) && "opacity-50 cursor-not-allowed"
              )}
              onClick={() =>
                !isCurrentLocation(null) && setSelectedDestination(null)
              }
              disabled={isCurrentLocation(null)}
            >
              <Home className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Thư viện (Gốc)</p>
                <p className="text-xs text-gray-500">Thư mục gốc</p>
              </div>
              {isCurrentLocation(null) && (
                <span className="text-xs text-gray-400">Vị trí hiện tại</span>
              )}
            </button>

            {/* Folder options */}
            {availableDestinations.map((dest) => (
              <button
                key={dest.id}
                type="button"
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                  selectedDestination === dest.id
                    ? "bg-blue-50 border-2 border-blue-500"
                    : "hover:bg-gray-50 border-2 border-transparent",
                  isCurrentLocation(dest.id) && "opacity-50 cursor-not-allowed"
                )}
                onClick={() =>
                  !isCurrentLocation(dest.id) && setSelectedDestination(dest.id)
                }
                disabled={isCurrentLocation(dest.id)}
              >
                <FolderIcon className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{dest.name}</p>
                  <p className="text-xs text-gray-500">
                    {dest.item_count} mục
                    {dest.depth !== undefined && dest.depth > 0 && (
                      <span> • Cấp {dest.depth}</span>
                    )}
                  </p>
                </div>
                {isCurrentLocation(dest.id) && (
                  <span className="text-xs text-gray-400">Vị trí hiện tại</span>
                )}
              </button>
            ))}

            {availableDestinations.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Không có thư mục nào khả dụng
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleMove} disabled={isLoading || !canMove}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang di chuyển...
              </>
            ) : (
              "Di chuyển"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
