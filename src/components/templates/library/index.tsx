"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Library,
  FolderPlus,
  Upload,
  Grid3x3,
  List,
  Search,
  FileMinusCorner,
  Loader2,
  ChevronRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuizCard } from "@/components/molecules/quiz-card";
import type { Quiz, QuizQueryParams, Folder } from "@/types";
import type { FolderColorBackend } from "@/components/atoms/FolderIcon";
import { CreateQuizCard } from "@/components/molecules/quiz-card/CreateQuizCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FolderCard } from "@/components/features/library/FolderCard";
import { FileCard } from "@/components/features/library/FileCard";
import { CreateFolderDialog } from "@/components/features/library/CreateFolderDialog";
import { RenameFolderDialog } from "@/components/features/library/RenameFolderDialog";
import { DeleteConfirmDialog } from "@/components/features/library/DeleteConfirmDialog";
import { Trash2 } from "lucide-react";
import { mockFiles, type File } from "@/data/library";
import { toast } from "sonner";
import { useMyQuizzes, useDeleteQuiz } from "@/services/quizService";
import {
  useFolders,
  useFolderPath,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
} from "@/services/folderService";
import { MAX_FOLDER_DEPTH } from "@/constants/folders";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export function LibraryTemplate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [files] = useState<File[]>(mockFiles);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [renameFolderOpen, setRenameFolderOpen] = useState(false);
  const [selectedFolderForRename, setSelectedFolderForRename] =
    useState<Folder | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingQuizId, setDeletingQuizId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);

  // Derive values from URL params (avoid cascading setState in useEffect)
  const currentFolderId = useMemo(() => {
    const folderId = searchParams.get("folder");
    return folderId && folderId !== "null" ? folderId : null;
  }, [searchParams]);

  const activeTab = searchParams.get("tab") || "all";
  const searchQuery = searchParams.get("search") || "";

  // Fetch folders from backend API
  const {
    data: foldersResponse,
    isLoading: isLoadingFolders,
    error: foldersError,
  } = useFolders(currentFolderId);

  // Fetch folder path for breadcrumb
  const { data: folderPathResponse } = useFolderPath(
    currentFolderId ?? undefined
  );

  // Folder mutations
  const createFolderMutation = useCreateFolder();
  const updateFolderMutation = useUpdateFolder();
  const deleteFolderMutation = useDeleteFolder();

  // Fetch quizzes from backend API
  const [quizFilters] = useState<QuizQueryParams>({
    page: 1,
    limit: 100, // Get all quizzes for now
  });

  const {
    data: quizzesResponse,
    isLoading: isLoadingQuizzes,
    error: quizzesError,
  } = useMyQuizzes(quizFilters);

  const deleteQuizMutation = useDeleteQuiz();

  // Get folders from API response
  const folders: Folder[] = foldersResponse?.data ?? [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const folderPath = folderPathResponse?.data ?? [];

  // Get current folder depth (for disabling create folder at max depth)
  const currentFolderDepth = useMemo(() => {
    if (!currentFolderId) return 0;
    // Depth is the number of items in the path
    return folderPath.length;
  }, [currentFolderId, folderPath]);

  // Get quizzes directly from API
  const quizzes: Quiz[] = quizzesResponse?.data ?? [];

  // Get current folder content
  const getCurrentFiles = () => {
    return files.filter((f) => f.folderId === currentFolderId);
  };

  const handleFolderClick = (folderId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("folder", folderId);
    // Always set tab to "all" when navigating folders
    params.set("tab", "all");

    router.push(`/dashboard/library?${params.toString()}`);
    setSelectedItems(new Set());
  };

  const handleNavigateToRoot = () => {
    setSelectedItems(new Set());
    const params = new URLSearchParams();
    params.set("tab", "all");
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    router.push(`/dashboard/library?${params.toString()}`);
  };

  const handleNavigateToFolder = (folderId: string) => {
    setSelectedItems(new Set());
    const params = new URLSearchParams();
    params.set("tab", "all");
    params.set("folder", folderId);
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    router.push(`/dashboard/library?${params.toString()}`);
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Folder actions
  const handleRenameFolder = (folder: Folder) => {
    setSelectedFolderForRename(folder);
    setRenameFolderOpen(true);
  };

  const handleDeleteFolder = (folder: Folder) => {
    setFolderToDelete(folder);
    setDeleteFolderDialogOpen(true);
  };

  const handleShareFolder = (folder: Folder) => {
    // eslint-disable-next-line no-console
    console.log("Share folder:", folder.id);
    toast.info("Tính năng chia sẻ đang được phát triển");
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
      toast.success(`Tạo thư mục ${name} thành công!`);
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
      toast.success(`Cập nhật thư mục ${name} thành công!`);
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
      toast.success(`Xóa thư mục ${folderToDelete.name} thành công!`);
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
          "Thư mục không thể xoá vì có chứa nội dung bên trong. Vui lòng xóa nội dung trước!"
        );
      } else {
        toast.error("Không thể xóa thư mục. Vui lòng thử lại!");
      }
      setDeleteFolderDialogOpen(false);
      setFolderToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    // eslint-disable-next-line no-console
    console.log("Delete items:", Array.from(selectedItems));
    // TODO: Implement bulk delete with API
    toast.info("Tính năng xóa hàng loạt đang được phát triển");
    setSelectedItems(new Set());
  };

  // Quiz handlers
  const handleViewQuiz = (quizId: string) => {
    router.push(`/dashboard/quiz/${quizId}`);
  };

  const handleEditQuiz = (quizId: string) => {
    router.push(`/dashboard/quiz/${quizId}/edit`);
  };

  const handleDuplicateQuiz = async (quizId: string) => {
    router.push(`/dashboard/quiz/new?duplicateFrom=${quizId}`);
    toast.info("Đang tải đề thi để sao chép...");
  };

  const handleDeleteQuiz = (quizId: string) => {
    setDeletingQuizId(quizId);
    setDeleteConfirmOpen(true);
  };

  const handleCreateQuiz = () => {
    router.push("/dashboard/quiz");
  };

  // Client-side filtering (since we load all quizzes)
  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show error toast if fetch fails
  useEffect(() => {
    if (quizzesError) {
      toast.error("Không thể tải danh sách đề thi. Vui lòng thử lại!");
    }
  }, [quizzesError]);

  useEffect(() => {
    if (foldersError) {
      toast.error("Không thể tải danh sách thư mục. Vui lòng thử lại!");
    }
  }, [foldersError]);

  const currentFiles = getCurrentFiles();

  // Check if we can create subfolder (max depth = 3)
  const canCreateSubfolder = currentFolderDepth < MAX_FOLDER_DEPTH;

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      {currentFolderId && (
        <nav className="flex items-center gap-1 text-sm text-gray-600 bg-white rounded-lg border border-gray-200 px-4 py-2">
          <button
            onClick={handleNavigateToRoot}
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
                  onClick={() => handleNavigateToFolder(item.id)}
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </button>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm đề thi của bạn trong thư viện..."
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;

                // Update URL with search parameter
                const params = new URLSearchParams(searchParams.toString());
                if (value) {
                  params.set("search", value);
                } else {
                  params.delete("search");
                }

                router.push(`/dashboard/library?${params.toString()}`);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery) {
                  // Navigate to quizzes tab when pressing Enter
                  setSelectedItems(new Set());

                  const params = new URLSearchParams();
                  params.set("tab", "quizzes");
                  params.set("search", searchQuery);

                  router.push(`/dashboard/library?${params.toString()}`);
                }
              }}
              className="pl-10"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateFolderOpen(true)}
                  disabled={!canCreateSubfolder}
                  title={
                    !canCreateSubfolder
                      ? "Đã đạt giới hạn độ sâu thư mục (tối đa 3 cấp)"
                      : undefined
                  }
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Thư mục mới
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {!canCreateSubfolder
                  ? "Đã đạt giới hạn độ sâu thư mục (tối đa 3 cấp)"
                  : "Tạo thư mục mới"}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Tải lên
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                Tải lên tệp tin (pdf, docs)
              </TooltipContent>
            </Tooltip>

            {/* View Toggle */}
            <div className="flex items-center gap-1 ml-4 border-l pl-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Xem dưới dạng lưới</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Xem dưới dạng danh sách
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          // Update URL with tab
          const params = new URLSearchParams();
          params.set("tab", value);

          // Clear selection when changing tabs
          setSelectedItems(new Set());

          // Add search parameter if exists
          if (searchQuery) {
            params.set("search", searchQuery);
          }

          router.push(`/dashboard/library?${params.toString()}`);
        }}
        className="w-full"
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger
              value="all"
              onClick={() => {
                // Always navigate to root when clicking "Tất cả"
                if (currentFolderId) {
                  handleNavigateToRoot();
                }
              }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>Thư viện chung</span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Tất cả thư mục và tệp tin trong thư viện
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
            <TabsTrigger value="quizzes">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>Đề thi của tôi</span>
                </TooltipTrigger>
                <TooltipContent side="top">Xem danh sách đề thi</TooltipContent>
              </Tooltip>
            </TabsTrigger>
          </TabsList>

          {/* Delete Button - Show when items selected */}
          {selectedItems.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa ({selectedItems.size})
            </Button>
          )}
        </div>

        {/* All Files Tab */}
        <TabsContent value="all" className="mt-6">
          {isLoadingFolders ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Đang tải thư mục...</span>
            </div>
          ) : viewMode === "grid" ? (
            <div className="space-y-6">
              {/* Folders */}
              {folders.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Thư mục
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {folders.map((folder) => (
                      <FolderCard
                        key={folder.id}
                        folder={folder}
                        isSelected={selectedItems.has(folder.id)}
                        onClick={() => handleFolderClick(folder.id)}
                        onSelect={() => handleSelectItem(folder.id)}
                        onRename={handleRenameFolder}
                        onDelete={handleDeleteFolder}
                        onShare={handleShareFolder}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Files */}
              {currentFiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Tệp tin
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {currentFiles.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        isSelected={selectedItems.has(file.id)}
                        onClick={() => {
                          // eslint-disable-next-line no-console
                          console.log("Open file:", file.id);
                        }}
                        onSelect={() => handleSelectItem(file.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {folders.length === 0 && currentFiles.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Library className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium mb-1">Thư mục trống</p>
                  <p className="text-sm">
                    Tạo thư mục mới hoặc tải lên tài liệu
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              {/* List view */}
              <div className="divide-y">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleFolderClick(folder.id)}
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectItem(folder.id);
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
                      <p className="text-sm text-gray-500">
                        {folder.item_count} mục
                      </p>
                    </div>
                  </div>
                ))}
                {currentFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectItem(file.id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.has(file.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </div>
                    <div className="shrink-0">
                      <span className="text-2xl">📄</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {file.size} • {file.type.toUpperCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="mt-6">
          {isLoadingQuizzes ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Đang tải đề thi...</span>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              <CreateQuizCard onCreate={handleCreateQuiz} />
              {filteredQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onView={handleViewQuiz}
                  onEdit={handleEditQuiz}
                  onDuplicate={handleDuplicateQuiz}
                  onDelete={handleDeleteQuiz}
                  isDeleting={deletingQuizId === quiz.id}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="divide-y">
                {filteredQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewQuiz(quiz.id)}
                  >
                    <div className="shrink-0">
                      <FileMinusCorner className="text-file-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {quiz.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {quiz.subject} • Lớp {quiz.grade} •{" "}
                        {quiz.total_questions} câu • {quiz.duration} phút
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoadingQuizzes && filteredQuizzes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Library className="w-16 h-16 mx-auto mb-3 opacity-20" />
              <p>
                {searchQuery
                  ? "Không tìm thấy đề thi phù hợp"
                  : "Chưa có đề thi nào. Tạo đề thi đầu tiên!"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        onCreateFolder={handleCreateFolder}
        parentId={currentFolderId}
        isLoading={createFolderMutation.isPending}
      />

      {/* Rename Folder Dialog */}
      <RenameFolderDialog
        open={renameFolderOpen}
        onOpenChange={setRenameFolderOpen}
        onUpdateFolder={handleUpdateFolder}
        folder={selectedFolderForRename}
        isLoading={updateFolderMutation.isPending}
      />

      {/* Delete Folder Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteFolderDialogOpen}
        onOpenChange={setDeleteFolderDialogOpen}
        onConfirm={handleConfirmDeleteFolder}
        itemCount={1}
        itemType="folder"
      />

      {/* Delete Confirmation Dialog (bulk) */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleBulkDelete}
        itemCount={selectedItems.size}
        itemType="folder"
      />

      {/* Delete Quiz Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => {
          if (deletingQuizId) {
            deleteQuizMutation.mutate(deletingQuizId);
            toast.success("Đã xóa đề thi thành công!");
          } else {
            toast.error("Không thể xóa đề thi. Vui lòng thử lại!");
          }
          setDeleteConfirmOpen(false);
        }}
        itemCount={1}
        itemType="quiz"
      />
    </div>
  );
}
