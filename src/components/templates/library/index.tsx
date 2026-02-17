"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Library,
  Loader2,
  Trash2,
  FileText,
  Eye,
  Edit,
  Copy,
  MoreVertical,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuizCard } from "@/components/molecules/quiz-card";
import type { Quiz, QuizQueryParams, Folder, Document } from "@/types";
import { CreateQuizCard } from "@/components/molecules/quiz-card/CreateQuizCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useMyQuizzes } from "@/services/quizService";
import {
  useFolders,
  useFolderPath,
  useFolderTree,
  useFolderItems,
} from "@/services/folderService";
import { useDocuments } from "@/services/documentService";
import { MAX_FOLDER_DEPTH } from "@/constants/folders";
import { useLibraryActions } from "@/hooks/useLibraryActions";
import { LibraryBreadcrumb } from "@/components/features/library/LibraryBreadcrumb";
import { LibraryToolbar } from "@/components/features/library/LibraryToolbar";
import { FolderGridView } from "@/components/features/library/FolderGridView";
import { FolderListView } from "@/components/features/library/FolderListView";
import { LibraryDialogs } from "@/components/features/library/LibraryDialogs";
import { ImageModal } from "@/components/molecules/image-modal/ImageModal";

export function LibraryTemplate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
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

  // Fetch data - use useFolderItems when inside a folder, otherwise use separate calls
  const {
    data: foldersResponse,
    isLoading: isLoadingRootFolders,
    error: foldersError,
  } = useFolders(currentFolderId, {
    enabled: !currentFolderId, // Only fetch when at root level
  });

  // Use folder items endpoint when inside a folder (returns both folders and documents)
  const {
    data: folderItemsResponse,
    isLoading: isLoadingFolderItems,
    error: folderItemsError,
  } = useFolderItems(currentFolderId ?? undefined, {
    enabled: !!currentFolderId, // Only fetch when inside a folder
  });

  const { data: folderPathResponse } = useFolderPath(
    currentFolderId ?? undefined
  );
  const { data: folderTreeResponse } = useFolderTree();

  // Fetch documents for root level (when no folder selected)
  const {
    data: documentsResponse,
    isLoading: isLoadingRootDocuments,
    error: documentsError,
  } = useDocuments(currentFolderId, {
    enabled: !currentFolderId, // Only fetch at root level
  });

  // Combined loading state
  const isLoadingFolders = currentFolderId
    ? isLoadingFolderItems
    : isLoadingRootFolders;
  const isLoadingDocuments = currentFolderId
    ? isLoadingFolderItems
    : isLoadingRootDocuments;

  const [quizFilters] = useState<QuizQueryParams>({ page: 1, limit: 500 });
  const [quizPage, setQuizPage] = useState(1);
  const QUIZ_PAGE_SIZE = 10;
  const {
    data: quizzesResponse,
    isLoading: isLoadingQuizzes,
    error: quizzesError,
  } = useMyQuizzes(quizFilters);

  // Derived data - use folder items when inside a folder, otherwise use root data
  const rawFolderItemsFolders = folderItemsResponse?.data?.folders;
  const rawFolderItemsDocs = folderItemsResponse?.data?.documents;
  const rawRootFolders = foldersResponse?.data;
  const rawRootDocs = documentsResponse?.data;
  const rawQuizzes = quizzesResponse?.data;

  const folders: Folder[] = currentFolderId
    ? Array.isArray(rawFolderItemsFolders)
      ? rawFolderItemsFolders
      : []
    : Array.isArray(rawRootFolders)
      ? rawRootFolders
      : [];
  const documents: Document[] = currentFolderId
    ? Array.isArray(rawFolderItemsDocs)
      ? rawFolderItemsDocs
      : []
    : Array.isArray(rawRootDocs)
      ? rawRootDocs
      : [];

  const folderPath = useMemo(
    () => folderPathResponse?.data ?? [],
    [folderPathResponse?.data]
  );
  const allFolders: Folder[] = Array.isArray(folderTreeResponse?.data)
    ? folderTreeResponse.data
    : [];
  const quizzes: Quiz[] = Array.isArray(rawQuizzes) ? rawQuizzes : [];

  const currentFolderDepth = useMemo(() => {
    if (!currentFolderId) return 0;
    return folderPath.length;
  }, [currentFolderId, folderPath]);

  const canCreateSubfolder = currentFolderDepth < MAX_FOLDER_DEPTH;

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const quizTotalPages = Math.max(
    1,
    Math.ceil(filteredQuizzes.length / QUIZ_PAGE_SIZE)
  );
  const paginatedQuizzes = filteredQuizzes.slice(
    (quizPage - 1) * QUIZ_PAGE_SIZE,
    quizPage * QUIZ_PAGE_SIZE
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
    setQuizPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/dashboard/library?${params.toString()}`);
  };

  const handleSearchSubmit = () => {
    setQuizPage(1);
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
    if (foldersError || folderItemsError) {
      toast.error("Không thể tải danh sách thư mục. Vui lòng thử lại!");
    }
  }, [foldersError, folderItemsError]);

  useEffect(() => {
    if (documentsError) {
      toast.error("Không thể tải danh sách tài liệu. Vui lòng thử lại!");
    }
  }, [documentsError]);

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
        onUploadDocument={() => actions.setUploadDocumentOpen(true)}
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
              Thư viện chung
            </TabsTrigger>
            <TabsTrigger value="quizzes">Đề thi của tôi</TabsTrigger>
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
          {isLoadingFolders || isLoadingDocuments ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          ) : viewMode === "grid" ? (
            <FolderGridView
              folders={folders}
              documents={documents}
              selectedItems={selectedItems}
              onFolderClick={handleFolderClick}
              onSelectItem={handleSelectItem}
              onRenameFolder={actions.handleRenameFolder}
              onDeleteFolder={actions.handleDeleteFolder}
              onShareFolder={actions.handleShareFolder}
              onMoveFolder={actions.handleMoveFolder}
              onDownloadDocument={actions.handleDownloadDocument}
              onDeleteDocument={actions.handleDeleteDocument}
              onPreviewDocument={actions.handlePreviewDocument}
            />
          ) : (
            <FolderListView
              folders={folders}
              documents={documents}
              selectedItems={selectedItems}
              onFolderClick={handleFolderClick}
              onSelectItem={handleSelectItem}
              onDownloadDocument={actions.handleDownloadDocument}
              onDeleteDocument={actions.handleDeleteDocument}
              onPreviewDocument={actions.handlePreviewDocument}
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
            <div className="space-y-3">
              {/* Create button — above table */}
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => actions.handleCreateQuiz()}
              >
                <Plus className="w-4 h-4" />
                Tạo đề thi mới
              </Button>

              {/* Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="hidden sm:grid grid-cols-[1fr_120px_80px_140px_80px] bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <div className="px-4 py-2.5">Tên</div>
                  <div className="px-4 py-2.5 text-center border-l border-gray-200">
                    Trạng thái
                  </div>
                  <div className="px-4 py-2.5 text-center border-l border-gray-200">
                    Câu hỏi
                  </div>
                  <div className="px-4 py-2.5 text-right border-l border-gray-200">
                    Ngày tạo
                  </div>
                  <div className="px-4 py-2.5 text-center border-l border-gray-200">
                    Hành động
                  </div>
                </div>

                {paginatedQuizzes.map((quiz) => {
                  const statusMap: Record<
                    string,
                    { label: string; cls: string }
                  > = {
                    draft: {
                      label: "Bản nháp",
                      cls: "bg-amber-400 text-white border-0 rounded-sm",
                    },
                    public: {
                      label: "Công khai",
                      cls: "bg-blue-500 text-white border-0 rounded-sm",
                    },
                    archived: {
                      label: "Lưu trữ",
                      cls: "bg-gray-400 text-white border-0 rounded-sm",
                    },
                  };
                  const statusInfo = statusMap[quiz.status] ?? {
                    label: quiz.status,
                    cls: "bg-gray-400 text-white border-0 rounded-sm",
                  };

                  const createdAt = new Date(quiz.created_at);
                  const formattedDate = `${String(createdAt.getDate()).padStart(2, "0")}.${String(createdAt.getMonth() + 1).padStart(2, "0")}.${String(createdAt.getFullYear()).slice(2)} ${String(createdAt.getHours()).padStart(2, "0")}:${String(createdAt.getMinutes()).padStart(2, "0")}`;

                  return (
                    <div
                      key={quiz.id}
                      className="grid grid-cols-[1fr_44px] sm:grid-cols-[1fr_120px_80px_140px_80px] items-center border-b last:border-0 hover:bg-gray-50 cursor-pointer group transition-colors"
                      onClick={() => actions.handleViewQuiz(quiz.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0 px-4 py-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm">
                            {quiz.title}
                          </p>
                          <p className="text-xs text-gray-500 sm:hidden">
                            {quiz.subject} • Lớp {quiz.grade} •{" "}
                            {quiz.total_questions} câu
                          </p>
                          <p className="text-xs text-gray-400 hidden sm:block">
                            {quiz.subject} • Lớp {quiz.grade} • {quiz.duration}{" "}
                            phút
                          </p>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center justify-center px-4 py-3 border-l border-gray-200 self-stretch">
                        <Badge
                          className={`text-xs font-semibold px-2.5 py-0.5 ${statusInfo.cls}`}
                        >
                          {statusInfo.label}
                        </Badge>
                      </div>

                      <div className="hidden sm:flex items-center justify-center px-4 py-3 border-l border-gray-200 self-stretch text-sm text-gray-700 font-medium">
                        {quiz.total_questions}
                      </div>

                      <div className="hidden sm:flex items-center justify-end px-4 py-3 border-l border-gray-200 self-stretch text-xs text-gray-500">
                        {formattedDate}
                      </div>

                      <div className="flex items-center justify-center px-2 py-3 sm:border-l sm:border-gray-200 self-stretch">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                actions.handleViewQuiz(quiz.id);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                actions.handleEditQuiz(quiz.id);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                actions.handleDuplicateQuiz(quiz.id);
                              }}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Sao chép
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                actions.handleDeleteQuiz(quiz.id);
                              }}
                              disabled={actions.deletingQuizId === quiz.id}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {actions.deletingQuizId === quiz.id
                                ? "Đang xóa..."
                                : "Xóa"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {quizTotalPages > 1 && (
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-gray-500">
                    {(quizPage - 1) * QUIZ_PAGE_SIZE + 1}–
                    {Math.min(
                      quizPage * QUIZ_PAGE_SIZE,
                      filteredQuizzes.length
                    )}{" "}
                    trong {filteredQuizzes.length} đề thi
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setQuizPage((p) => Math.max(1, p - 1))}
                      disabled={quizPage === 1}
                      className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>

                    {Array.from({ length: quizTotalPages }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === quizTotalPages ||
                          Math.abs(p - quizPage) <= 1
                      )
                      .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                          acc.push("...");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === "..." ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-1.5 text-gray-400 text-sm"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={item}
                            onClick={() => setQuizPage(item as number)}
                            className={`min-w-8 h-8 px-2 rounded-md text-sm border transition-colors ${
                              quizPage === item
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {item}
                          </button>
                        )
                      )}

                    <button
                      onClick={() =>
                        setQuizPage((p) => Math.min(quizTotalPages, p + 1))
                      }
                      disabled={quizPage === quizTotalPages}
                      className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
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
        uploadDocumentOpen={actions.uploadDocumentOpen}
        setUploadDocumentOpen={actions.setUploadDocumentOpen}
        onUploadDocument={actions.handleUploadDocument}
        isUploadingDocument={actions.isUploadingDocument}
        uploadProgress={actions.uploadProgress}
        deleteDocumentDialogOpen={actions.deleteDocumentDialogOpen}
        setDeleteDocumentDialogOpen={actions.setDeleteDocumentDialogOpen}
        onConfirmDeleteDocument={actions.handleConfirmDeleteDocument}
      />

      {/* Image Preview Modal */}
      {actions.imagePreviewOpen && actions.previewImages.length > 0 && (
        <ImageModal
          isOpen={actions.imagePreviewOpen}
          onClose={actions.handleCloseImagePreview}
          imageSrc={actions.previewImages[actions.currentImageIndex]?.src || ""}
          imageAlt={actions.previewImages[actions.currentImageIndex]?.alt || ""}
          title={actions.previewImages[actions.currentImageIndex]?.alt}
        />
      )}
    </div>
  );
}
