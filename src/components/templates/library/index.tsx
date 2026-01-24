"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Library, Loader2, Trash2, FileMinusCorner } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizCard } from "@/components/molecules/quiz-card";
import type { Quiz, QuizQueryParams, Folder } from "@/types";
import { CreateQuizCard } from "@/components/molecules/quiz-card/CreateQuizCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockFiles, type File } from "@/data/library";
import { toast } from "sonner";
import { useMyQuizzes } from "@/services/quizService";
import {
  useFolders,
  useFolderPath,
  useFolderTree,
} from "@/services/folderService";
import { MAX_FOLDER_DEPTH } from "@/constants/folders";
import { useLibraryActions } from "@/hooks/useLibraryActions";
import { LibraryBreadcrumb } from "@/components/features/library/LibraryBreadcrumb";
import { LibraryToolbar } from "@/components/features/library/LibraryToolbar";
import { FolderGridView } from "@/components/features/library/FolderGridView";
import { FolderListView } from "@/components/features/library/FolderListView";
import { LibraryDialogs } from "@/components/features/library/LibraryDialogs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LibraryTemplate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [files] = useState<File[]>(mockFiles);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Custom hook for all library actions
  const actions = useLibraryActions();

  // Derive values from URL params
  const currentFolderId = useMemo(() => {
    const folderId = searchParams.get("folder");
    return folderId && folderId !== "null" ? folderId : null;
  }, [searchParams]);

  const activeTab = searchParams.get("tab") || "all";
  const searchQuery = searchParams.get("search") || "";

  // Fetch data
  const {
    data: foldersResponse,
    isLoading: isLoadingFolders,
    error: foldersError,
  } = useFolders(currentFolderId);

  const { data: folderPathResponse } = useFolderPath(
    currentFolderId ?? undefined
  );
  const { data: folderTreeResponse } = useFolderTree();

  const [quizFilters] = useState<QuizQueryParams>({ page: 1, limit: 100 });
  const {
    data: quizzesResponse,
    isLoading: isLoadingQuizzes,
    error: quizzesError,
  } = useMyQuizzes(quizFilters);

  // Derived data
  const folders: Folder[] = foldersResponse?.data ?? [];
  const folderPath = useMemo(
    () => folderPathResponse?.data ?? [],
    [folderPathResponse?.data]
  );
  const allFolders: Folder[] = folderTreeResponse?.data ?? [];
  const quizzes: Quiz[] = quizzesResponse?.data ?? [];

  const currentFolderDepth = useMemo(() => {
    if (!currentFolderId) return 0;
    return folderPath.length;
  }, [currentFolderId, folderPath]);

  const canCreateSubfolder = currentFolderDepth < MAX_FOLDER_DEPTH;

  const getCurrentFiles = () =>
    files.filter((f) => f.folderId === currentFolderId);
  const currentFiles = getCurrentFiles();

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigation handlers
  const handleFolderClick = (folderId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("folder", folderId);
    params.set("tab", "all");
    router.push(`/dashboard/library?${params.toString()}`);
    setSelectedItems(new Set());
  };

  const handleNavigateToRoot = () => {
    setSelectedItems(new Set());
    const params = new URLSearchParams();
    params.set("tab", "all");
    if (searchQuery) params.set("search", searchQuery);
    router.push(`/dashboard/library?${params.toString()}`);
  };

  const handleNavigateToFolder = (folderId: string) => {
    setSelectedItems(new Set());
    const params = new URLSearchParams();
    params.set("tab", "all");
    params.set("folder", folderId);
    if (searchQuery) params.set("search", searchQuery);
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

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/dashboard/library?${params.toString()}`);
  };

  const handleSearchSubmit = () => {
    setSelectedItems(new Set());
    const params = new URLSearchParams();
    params.set("tab", "quizzes");
    params.set("search", searchQuery);
    router.push(`/dashboard/library?${params.toString()}`);
  };

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams();
    params.set("tab", value);
    setSelectedItems(new Set());
    if (searchQuery) params.set("search", searchQuery);
    router.push(`/dashboard/library?${params.toString()}`);
  };

  const handleBulkDelete = () => {
    // TODO: Implement bulk delete with API
    toast.info("Tính năng xóa hàng loạt đang được phát triển");
    setSelectedItems(new Set());
    setBulkDeleteDialogOpen(false);
  };

  // Error handling
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

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      {currentFolderId && (
        <LibraryBreadcrumb
          folderPath={folderPath}
          onNavigateToRoot={handleNavigateToRoot}
          onNavigateToFolder={handleNavigateToFolder}
        />
      )}

      {/* Toolbar */}
      <LibraryToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateFolder={() => actions.setCreateFolderOpen(true)}
        canCreateSubfolder={canCreateSubfolder}
      />

      {/* Content */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger
              value="all"
              onClick={() => currentFolderId && handleNavigateToRoot()}
            >
              <Tooltip>
                <TooltipTrigger>
                  <span>Thư viện chung</span>
                </TooltipTrigger>
                <TooltipContent>
                  Thư viện chung gồm bài giảng, tài liệu,..
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
            <TabsTrigger value="quizzes">
              <Tooltip>
                <TooltipTrigger>
                  <span>Đề thi của tôi</span>
                </TooltipTrigger>
                <TooltipContent>Quản lý các đề thi của bạn</TooltipContent>
              </Tooltip>
            </TabsTrigger>
          </TabsList>

          {selectedItems.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteDialogOpen(true)}
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
            <FolderGridView
              folders={folders}
              files={currentFiles}
              selectedItems={selectedItems}
              onFolderClick={handleFolderClick}
              onSelectItem={handleSelectItem}
              onRenameFolder={actions.handleRenameFolder}
              onDeleteFolder={actions.handleDeleteFolder}
              onShareFolder={actions.handleShareFolder}
              onMoveFolder={actions.handleMoveFolder}
            />
          ) : (
            <FolderListView
              folders={folders}
              files={currentFiles}
              selectedItems={selectedItems}
              onFolderClick={handleFolderClick}
              onSelectItem={handleSelectItem}
            />
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
              <CreateQuizCard onCreate={actions.handleCreateQuiz} />
              {filteredQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onView={actions.handleViewQuiz}
                  onEdit={actions.handleEditQuiz}
                  onDuplicate={actions.handleDuplicateQuiz}
                  onDelete={actions.handleDeleteQuiz}
                  isDeleting={actions.deletingQuizId === quiz.id}
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
                    onClick={() => actions.handleViewQuiz(quiz.id)}
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

      {/* All Dialogs */}
      <LibraryDialogs
        currentFolderId={currentFolderId}
        allFolders={allFolders}
        createFolderOpen={actions.createFolderOpen}
        setCreateFolderOpen={actions.setCreateFolderOpen}
        onCreateFolder={actions.handleCreateFolder}
        isCreatingFolder={actions.isCreatingFolder}
        renameFolderOpen={actions.renameFolderOpen}
        setRenameFolderOpen={actions.setRenameFolderOpen}
        selectedFolderForRename={actions.selectedFolderForRename}
        onUpdateFolder={actions.handleUpdateFolder}
        isUpdatingFolder={actions.isUpdatingFolder}
        moveFolderDialogOpen={actions.moveFolderDialogOpen}
        setMoveFolderDialogOpen={actions.setMoveFolderDialogOpen}
        folderToMove={actions.folderToMove}
        onMoveFolder={actions.handleConfirmMoveFolder}
        isMovingFolder={actions.isMovingFolder}
        deleteFolderDialogOpen={actions.deleteFolderDialogOpen}
        setDeleteFolderDialogOpen={actions.setDeleteFolderDialogOpen}
        onConfirmDeleteFolder={actions.handleConfirmDeleteFolder}
        bulkDeleteDialogOpen={bulkDeleteDialogOpen}
        setBulkDeleteDialogOpen={setBulkDeleteDialogOpen}
        selectedItemsCount={selectedItems.size}
        onBulkDelete={handleBulkDelete}
        deleteQuizConfirmOpen={actions.deleteQuizConfirmOpen}
        setDeleteQuizConfirmOpen={actions.setDeleteQuizConfirmOpen}
        onConfirmDeleteQuiz={actions.handleConfirmDeleteQuiz}
      />
    </div>
  );
}
