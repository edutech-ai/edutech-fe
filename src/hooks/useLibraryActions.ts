"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Folder, Document } from "@/types";
import type { FolderColorBackend } from "@/components/atoms/FolderIcon";
import {
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
  useMoveFolder,
} from "@/services/folderService";
import { useDeleteQuiz } from "@/services/quizService";
import {
  useUploadDocument,
  useDeleteDocument,
  useMoveDocument,
} from "@/services/documentService";

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

  // Document dialog states
  const [uploadDocumentOpen, setUploadDocumentOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteDocumentDialogOpen, setDeleteDocumentDialogOpen] =
    useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );

  // Image preview state
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<
    { src: string; alt: string }[]
  >([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mutations
  const createFolderMutation = useCreateFolder();
  const updateFolderMutation = useUpdateFolder();
  const deleteFolderMutation = useDeleteFolder();
  const moveFolderMutation = useMoveFolder();
  const deleteQuizMutation = useDeleteQuiz();

  // Document mutations
  const uploadDocumentMutation = useUploadDocument((progress) => {
    setUploadProgress(progress);
  });
  const deleteDocumentMutation = useDeleteDocument();
  const moveDocumentMutation = useMoveDocument();

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

  // Document handlers
  const handleUploadDocument = async (
    file: File,
    name: string,
    description: string,
    folderId: string | null
  ) => {
    try {
      setUploadProgress(0);
      await uploadDocumentMutation.mutateAsync({
        file,
        name,
        description,
        folder_id: folderId,
      });
      toast.success(`Tải lên "${name}" thành công!`);
      setUploadDocumentOpen(false);
      setUploadProgress(0);
    } catch (error) {
      console.error("Failed to upload document:", error);
      toast.error("Không thể tải lên tài liệu. Vui lòng thử lại!");
      setUploadProgress(0);
    }
  };

  const handleDeleteDocument = (document: Document) => {
    setDocumentToDelete(document);
    setDeleteDocumentDialogOpen(true);
  };

  const handleConfirmDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      await deleteDocumentMutation.mutateAsync({
        id: documentToDelete.id,
        folderId: documentToDelete.folder_id,
      });
      toast.success(`Xóa "${documentToDelete.name}" thành công!`);
      setDeleteDocumentDialogOpen(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Không thể xóa tài liệu. Vui lòng thử lại!");
      setDeleteDocumentDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  // Download document directly via file_url
  const handleDownloadDocument = (document: Document) => {
    if (!document.file_url) {
      toast.error("Không tìm thấy đường dẫn tải xuống!");
      return;
    }

    // Create a temporary link and trigger download
    const link = window.document.createElement("a");
    link.href = document.file_url;
    link.download = document.original_name || document.name;
    link.target = "_blank";
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    toast.success(`Đang tải xuống "${document.name}"...`);
  };

  // Preview document - images open in modal, PDFs open in new tab
  const handlePreviewDocument = (
    document: Document,
    allDocuments?: Document[]
  ) => {
    const docType = document.type.toLowerCase();

    // Handle image preview
    if (
      docType === "image" ||
      ["jpg", "jpeg", "png", "gif", "webp"].includes(docType)
    ) {
      // Get all images from the documents list for gallery navigation
      const imageDocuments = allDocuments?.filter(
        (doc) =>
          doc.type === "image" ||
          ["jpg", "jpeg", "png", "gif", "webp"].includes(doc.type.toLowerCase())
      ) ?? [document];

      const images = imageDocuments.map((doc) => ({
        src: doc.file_url,
        alt: doc.name,
      }));

      const currentIndex = imageDocuments.findIndex(
        (doc) => doc.id === document.id
      );

      setPreviewImages(images);
      setCurrentImageIndex(currentIndex >= 0 ? currentIndex : 0);
      setImagePreviewOpen(true);
      return;
    }

    // Handle PDF preview - open in new tab
    if (docType === "pdf") {
      if (document.file_url) {
        window.open(document.file_url, "_blank");
      } else {
        toast.error("Không tìm thấy đường dẫn xem trước!");
      }
      return;
    }

    // For other file types, trigger download
    handleDownloadDocument(document);
  };

  // Close image preview
  const handleCloseImagePreview = () => {
    setImagePreviewOpen(false);
    setPreviewImages([]);
    setCurrentImageIndex(0);
  };

  // Navigate to next/previous image
  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < previewImages.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : previewImages.length - 1
    );
  };

  const handleMoveDocument = async (
    document: Document,
    newFolderId: string | null
  ) => {
    try {
      await moveDocumentMutation.mutateAsync({
        id: document.id,
        data: { folder_id: newFolderId },
        oldFolderId: document.folder_id,
      });
      toast.success(`Di chuyển "${document.name}" thành công!`);
    } catch (error) {
      console.error("Failed to move document:", error);
      toast.error("Không thể di chuyển tài liệu. Vui lòng thử lại!");
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

    // Document dialog states
    uploadDocumentOpen,
    setUploadDocumentOpen,
    uploadProgress,
    deleteDocumentDialogOpen,
    setDeleteDocumentDialogOpen,
    documentToDelete,

    // Image preview states
    imagePreviewOpen,
    previewImages,
    currentImageIndex,
    setCurrentImageIndex,

    // Mutations loading states
    isCreatingFolder: createFolderMutation.isPending,
    isUpdatingFolder: updateFolderMutation.isPending,
    isDeletingFolder: deleteFolderMutation.isPending,
    isMovingFolder: moveFolderMutation.isPending,
    isUploadingDocument: uploadDocumentMutation.isPending,
    isDeletingDocument: deleteDocumentMutation.isPending,
    isMovingDocument: moveDocumentMutation.isPending,

    // Folder handlers
    handleRenameFolder,
    handleDeleteFolder,
    handleMoveFolder,
    handleShareFolder,
    handleCreateFolder,
    handleUpdateFolder,
    handleConfirmDeleteFolder,
    handleConfirmMoveFolder,

    // Document handlers
    handleUploadDocument,
    handleDeleteDocument,
    handleConfirmDeleteDocument,
    handleDownloadDocument,
    handlePreviewDocument,
    handleCloseImagePreview,
    handleNextImage,
    handlePrevImage,
    handleMoveDocument,

    // Quiz handlers
    handleViewQuiz,
    handleEditQuiz,
    handleDuplicateQuiz,
    handleDeleteQuiz,
    handleConfirmDeleteQuiz,
    handleCreateQuiz,
  };
}
