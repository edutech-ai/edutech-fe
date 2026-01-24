"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Folder } from "@/types";
import type { FolderColorBackend } from "@/components/atoms/FolderIcon";
import {
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
  useMoveFolder,
} from "@/services/folderService";
import { useDeleteQuiz } from "@/services/quizService";

export function useLibraryActions() {
  const router = useRouter();

  // Dialog states
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [renameFolderOpen, setRenameFolderOpen] = useState(false);
  const [selectedFolderForRename, setSelectedFolderForRename] =
    useState<Folder | null>(null);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [moveFolderDialogOpen, setMoveFolderDialogOpen] = useState(false);
  const [folderToMove, setFolderToMove] = useState<Folder | null>(null);
  const [deleteQuizConfirmOpen, setDeleteQuizConfirmOpen] = useState(false);
  const [deletingQuizId, setDeletingQuizId] = useState<string | null>(null);

  // Mutations
  const createFolderMutation = useCreateFolder();
  const updateFolderMutation = useUpdateFolder();
  const deleteFolderMutation = useDeleteFolder();
  const moveFolderMutation = useMoveFolder();
  const deleteQuizMutation = useDeleteQuiz();

  // Folder handlers
  const handleRenameFolder = (folder: Folder) => {
    setSelectedFolderForRename(folder);
    setRenameFolderOpen(true);
  };

  const handleDeleteFolder = (folder: Folder) => {
    setFolderToDelete(folder);
    setDeleteFolderDialogOpen(true);
  };

  const handleMoveFolder = (folder: Folder) => {
    setFolderToMove(folder);
    setMoveFolderDialogOpen(true);
  };

  const handleShareFolder = (folder: Folder) => {
    toast.info(
      `Tính năng chia sẻ thư mục "${folder.name}" đang được phát triển`
    );
  };

  const handleCreateFolder = async (
    name: string,
    color: FolderColorBackend,
    parentId: string | null
  ) => {
    try {
      await createFolderMutation.mutateAsync({
        name,
        color,
        parent_id: parentId,
      });
      toast.success(`Tạo thư mục "${name}" thành công!`);
      setCreateFolderOpen(false);
    } catch (error) {
      console.error("Failed to create folder:", error);
      toast.error("Không thể tạo thư mục. Vui lòng thử lại!");
    }
  };

  const handleUpdateFolder = async (
    folderId: string,
    name: string,
    color: FolderColorBackend
  ) => {
    try {
      await updateFolderMutation.mutateAsync({
        id: folderId,
        data: { name, color },
      });
      toast.success(`Cập nhật thư mục "${name}" thành công!`);
      setRenameFolderOpen(false);
      setSelectedFolderForRename(null);
    } catch (error) {
      console.error("Failed to update folder:", error);
      toast.error("Không thể cập nhật thư mục. Vui lòng thử lại!");
    }
  };

  const handleConfirmDeleteFolder = async () => {
    if (!folderToDelete) return;

    try {
      await deleteFolderMutation.mutateAsync({
        id: folderToDelete.id,
        parentId: folderToDelete.parent_id,
      });
      toast.success(`Xóa thư mục "${folderToDelete.name}" thành công!`);
      setDeleteFolderDialogOpen(false);
      setFolderToDelete(null);
    } catch (error: unknown) {
      console.error("Failed to delete folder:", error);
      const axiosError = error as {
        response?: {
          status?: number;
          data?: {
            error?: { code?: string };
            message?: string;
          };
        };
      };

      const status = axiosError?.response?.status;
      const errorCode = axiosError?.response?.data?.error?.code;
      const message = axiosError?.response?.data?.message;

      if (
        status === 400 ||
        errorCode === "FOLDER_NOT_EMPTY" ||
        message?.toLowerCase().includes("items")
      ) {
        toast.error(
          "Không thể xóa thư mục vì còn chứa nội dung bên trong. Vui lòng xóa nội dung trước!"
        );
      } else {
        toast.error("Không thể xóa thư mục. Vui lòng thử lại!");
      }
      setDeleteFolderDialogOpen(false);
      setFolderToDelete(null);
    }
  };

  const handleConfirmMoveFolder = async (
    folderId: string,
    newParentId: string | null
  ) => {
    const folder = folderToMove;
    if (!folder) return;

    try {
      await moveFolderMutation.mutateAsync({
        id: folderId,
        data: { new_parent_id: newParentId },
        oldParentId: folder.parent_id,
      });
      toast.success(`Di chuyển thư mục "${folder.name}" thành công!`);
      setMoveFolderDialogOpen(false);
      setFolderToMove(null);
    } catch (error: unknown) {
      console.error("Failed to move folder:", error);
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string };
        };
      };
      const message = axiosError?.response?.data?.message;

      if (message?.toLowerCase().includes("depth")) {
        toast.error("Không thể di chuyển vì vượt quá giới hạn độ sâu thư mục!");
      } else if (message?.toLowerCase().includes("circular")) {
        toast.error(
          "Không thể di chuyển thư mục vào chính nó hoặc thư mục con!"
        );
      } else {
        toast.error("Không thể di chuyển thư mục. Vui lòng thử lại!");
      }
    }
  };

  // Quiz handlers
  const handleViewQuiz = (quizId: string) => {
    router.push(`/dashboard/quiz/${quizId}`);
  };

  const handleEditQuiz = (quizId: string) => {
    router.push(`/dashboard/quiz/${quizId}/edit`);
  };

  const handleDuplicateQuiz = (quizId: string) => {
    router.push(`/dashboard/quiz/new?duplicateFrom=${quizId}`);
    toast.info("Đang tải đề thi để sao chép...");
  };

  const handleDeleteQuiz = (quizId: string) => {
    setDeletingQuizId(quizId);
    setDeleteQuizConfirmOpen(true);
  };

  const handleConfirmDeleteQuiz = () => {
    if (deletingQuizId) {
      deleteQuizMutation.mutate(deletingQuizId);
      toast.success("Đã xóa đề thi thành công!");
    } else {
      toast.error("Không thể xóa đề thi. Vui lòng thử lại!");
    }
    setDeleteQuizConfirmOpen(false);
    setDeletingQuizId(null);
  };

  const handleCreateQuiz = () => {
    router.push("/dashboard/quiz");
  };

  return {
    // Dialog states
    createFolderOpen,
    setCreateFolderOpen,
    renameFolderOpen,
    setRenameFolderOpen,
    selectedFolderForRename,
    deleteFolderDialogOpen,
    setDeleteFolderDialogOpen,
    folderToDelete,
    moveFolderDialogOpen,
    setMoveFolderDialogOpen,
    folderToMove,
    deleteQuizConfirmOpen,
    setDeleteQuizConfirmOpen,
    deletingQuizId,

    // Mutations loading states
    isCreatingFolder: createFolderMutation.isPending,
    isUpdatingFolder: updateFolderMutation.isPending,
    isDeletingFolder: deleteFolderMutation.isPending,
    isMovingFolder: moveFolderMutation.isPending,

    // Folder handlers
    handleRenameFolder,
    handleDeleteFolder,
    handleMoveFolder,
    handleShareFolder,
    handleCreateFolder,
    handleUpdateFolder,
    handleConfirmDeleteFolder,
    handleConfirmMoveFolder,

    // Quiz handlers
    handleViewQuiz,
    handleEditQuiz,
    handleDuplicateQuiz,
    handleDeleteQuiz,
    handleConfirmDeleteQuiz,
    handleCreateQuiz,
  };
}
