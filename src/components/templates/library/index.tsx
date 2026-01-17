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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuizCard } from "@/components/molecules/quiz-card";
import type { Quiz, QuizQueryParams } from "@/types/quiz";
import { CreateQuizCard } from "@/components/molecules/quiz-card/CreateQuizCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FolderCard } from "@/components/features/library/FolderCard";
import { FileCard } from "@/components/features/library/FileCard";
import { CreateFolderDialog } from "@/components/features/library/CreateFolderDialog";
import { DeleteConfirmDialog } from "@/components/features/library/DeleteConfirmDialog";
import { Trash2 } from "lucide-react";
import {
  mockFolders,
  mockFiles,
  type Folder,
  type File,
  type FolderColor,
} from "@/data/library";
import { toast } from "sonner";
import { useMyQuizzes, useDeleteQuiz } from "@/services/quizService";

export function LibraryTemplate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [folders] = useState<Folder[]>(mockFolders);
  const [files] = useState<File[]>(mockFiles);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingQuizId, setDeletingQuizId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Derive values from URL params (avoid cascading setState in useEffect)
  const currentFolderId = useMemo(() => {
    const folderId = searchParams.get("folder");
    return folderId && folderId !== "null" ? folderId : null;
  }, [searchParams]);

  const activeTab = searchParams.get("tab") || "all";
  const searchQuery = searchParams.get("search") || "";

  // Fetch quizzes from backend API
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quizFilters, setQuizFilters] = useState<QuizQueryParams>({
    page: 1,
    limit: 100, // Get all quizzes for now
  });

  const {
    data: quizzesResponse,
    isLoading: isLoadingQuizzes,
    error: quizzesError,
  } = useMyQuizzes(quizFilters);

  const deleteQuizMutation = useDeleteQuiz();

  // Get quizzes directly from API (no adapter needed)
  const quizzes: Quiz[] = quizzesResponse?.data ?? [];

  // Get current folder content
  const getCurrentFolders = () => {
    return folders.filter((f) => f.parentId === currentFolderId);
  };

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
  const handleRenameFolder = (folderId: string) => {
    // eslint-disable-next-line no-console
    console.log("Rename folder:", folderId);
    // TODO: Implement rename dialog
  };

  const handleDeleteFolder = (folderId: string) => {
    // eslint-disable-next-line no-console
    console.log("Delete folder:", folderId);
    // TODO: Implement delete confirmation
  };

  const handleShareFolder = (folderId: string) => {
    // eslint-disable-next-line no-console
    console.log("Share folder:", folderId);
    // TODO: Implement share dialog
  };

  const handleCreateFolder = (name: string, color: FolderColor) => {
    // eslint-disable-next-line no-console
    console.log("Create folder:", name, color);
    // TODO: Call API to create folder

    // Close dialog and navigate back to root library
    setCreateFolderOpen(false);
    setSelectedItems(new Set());

    const params = new URLSearchParams();
    params.set("tab", "all");
    if (searchQuery) {
      params.set("search", searchQuery);
    }

    router.push(`/dashboard/library?${params.toString()}`);
  };

  const handleBulkDelete = () => {
    // eslint-disable-next-line no-console
    console.log("Delete items:", Array.from(selectedItems));
    // TODO: Call API to delete items
    // Clear selection after delete
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
    // Navigate to new quiz page with duplicateFrom param
    // The new page will load and copy the quiz data
    router.push(`/dashboard/quiz/new?duplicateFrom=${quizId}`);
    toast.info("Đang tải đề thi để sao chép...");
  };

  const handleDeleteQuiz = (quizId: string) => {
    setDeletingQuizId(quizId);
    setDeleteConfirmOpen(true);
  };

  const handleCreateQuiz = () => {
    // eslint-disable-next-line no-console
    console.log("Create new quiz");
    // TODO: Navigate to quiz creation page
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

  const currentFolders = getCurrentFolders();
  const currentFiles = getCurrentFiles();

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm trong thư viện..."
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreateFolderOpen(true)}
            >
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
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
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
                  setSelectedItems(new Set());

                  const params = new URLSearchParams();
                  params.set("tab", "all");
                  if (searchQuery) {
                    params.set("search", searchQuery);
                  }

                  router.push(`/dashboard/library?${params.toString()}`);
                }
              }}
            >
              Thư viện chung
            </TabsTrigger>
            <TabsTrigger value="quizzes">Đề thi của tôi</TabsTrigger>
            {/* <TabsTrigger value="lessons">Giáo án</TabsTrigger> */}
            {/* <TabsTrigger value="documents">Tài liệu</TabsTrigger> */}
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
          {viewMode === "grid" ? (
            <div className="space-y-6">
              {/* Folders */}
              {currentFolders.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Thư mục
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {currentFolders.map((folder) => (
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

              {currentFolders.length === 0 && currentFiles.length === 0 && (
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
              {/* List view - similar structure but different layout */}
              <div className="divide-y">
                {currentFolders.map((folder) => (
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
                      {/* Add small folder icon here */}
                      <span className="text-2xl">📁</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {folder.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {folder.itemCount} mục
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
      />

      {/* Delete Confirmation Dialog */}
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
