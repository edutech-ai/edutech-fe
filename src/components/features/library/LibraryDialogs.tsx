"use client";

import type { Folder } from "@/types";
import type { FolderColorBackend } from "@/components/atoms/FolderIcon";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { RenameFolderDialog } from "./RenameFolderDialog";
import { MoveFolderDialog } from "./MoveFolderDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface LibraryDialogsProps {
  // Current folder context
  currentFolderId: string | null;
  allFolders: Folder[];

  // Create folder dialog
  createFolderOpen: boolean;
  setCreateFolderOpen: (open: boolean) => void;
  onCreateFolder: (
    name: string,
    color: FolderColorBackend,
    parentId: string | null
  ) => void;
  isCreatingFolder: boolean;

  // Rename folder dialog
  renameFolderOpen: boolean;
  setRenameFolderOpen: (open: boolean) => void;
  selectedFolderForRename: Folder | null;
  onUpdateFolder: (
    folderId: string,
    name: string,
    color: FolderColorBackend
  ) => void;
  isUpdatingFolder: boolean;

  // Move folder dialog
  moveFolderDialogOpen: boolean;
  setMoveFolderDialogOpen: (open: boolean) => void;
  folderToMove: Folder | null;
  onMoveFolder: (folderId: string, newParentId: string | null) => void;
  isMovingFolder: boolean;

  // Delete folder dialog
  deleteFolderDialogOpen: boolean;
  setDeleteFolderDialogOpen: (open: boolean) => void;
  onConfirmDeleteFolder: () => void;

  // Bulk delete dialog
  bulkDeleteDialogOpen: boolean;
  setBulkDeleteDialogOpen: (open: boolean) => void;
  selectedItemsCount: number;
  onBulkDelete: () => void;

  // Delete quiz dialog
  deleteQuizConfirmOpen: boolean;
  setDeleteQuizConfirmOpen: (open: boolean) => void;
  onConfirmDeleteQuiz: () => void;
}

export function LibraryDialogs({
  currentFolderId,
  allFolders,
  createFolderOpen,
  setCreateFolderOpen,
  onCreateFolder,
  isCreatingFolder,
  renameFolderOpen,
  setRenameFolderOpen,
  selectedFolderForRename,
  onUpdateFolder,
  isUpdatingFolder,
  moveFolderDialogOpen,
  setMoveFolderDialogOpen,
  folderToMove,
  onMoveFolder,
  isMovingFolder,
  deleteFolderDialogOpen,
  setDeleteFolderDialogOpen,
  onConfirmDeleteFolder,
  bulkDeleteDialogOpen,
  setBulkDeleteDialogOpen,
  selectedItemsCount,
  onBulkDelete,
  deleteQuizConfirmOpen,
  setDeleteQuizConfirmOpen,
  onConfirmDeleteQuiz,
}: LibraryDialogsProps) {
  return (
    <>
      {/* Create Folder Dialog */}
      <CreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        onCreateFolder={onCreateFolder}
        parentId={currentFolderId}
        isLoading={isCreatingFolder}
      />

      {/* Rename Folder Dialog */}
      <RenameFolderDialog
        open={renameFolderOpen}
        onOpenChange={setRenameFolderOpen}
        onUpdateFolder={onUpdateFolder}
        folder={selectedFolderForRename}
        isLoading={isUpdatingFolder}
      />

      {/* Move Folder Dialog */}
      <MoveFolderDialog
        open={moveFolderDialogOpen}
        onOpenChange={setMoveFolderDialogOpen}
        onMoveFolder={onMoveFolder}
        folder={folderToMove}
        folders={allFolders}
        currentFolderId={currentFolderId}
        isLoading={isMovingFolder}
      />

      {/* Delete Folder Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteFolderDialogOpen}
        onOpenChange={setDeleteFolderDialogOpen}
        onConfirm={onConfirmDeleteFolder}
        itemCount={1}
        itemType="folder"
      />

      {/* Delete Confirmation Dialog (bulk) */}
      <DeleteConfirmDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={onBulkDelete}
        itemCount={selectedItemsCount}
        itemType="folder"
      />

      {/* Delete Quiz Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteQuizConfirmOpen}
        onOpenChange={setDeleteQuizConfirmOpen}
        onConfirm={onConfirmDeleteQuiz}
        itemCount={1}
        itemType="quiz"
      />
    </>
  );
}
