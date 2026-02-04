/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { FOLDER_KEYS } from "./folderService";
import type {
  DocumentResponse,
  DocumentListResponse,
  UpdateDocumentRequest,
  MoveDocumentRequest,
  ShareDocumentRequest,
  DocumentQueryParams,
  Document,
} from "@/types";

// ==================== QUERY KEYS ====================
export const DOCUMENT_KEYS = {
  all: ["documents"] as const,
  lists: () => [...DOCUMENT_KEYS.all, "list"] as const,
  list: (folderId: string | null) =>
    [...DOCUMENT_KEYS.lists(), { folderId }] as const,
  details: () => [...DOCUMENT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...DOCUMENT_KEYS.details(), id] as const,
};

// ==================== QUERY HOOKS ====================

/**
 * Get documents by folder_id (null for root documents)
 */
export const useDocuments = (folderId: string | null = null, options?: any) => {
  return useQuery<DocumentListResponse, AxiosError>({
    queryKey: DOCUMENT_KEYS.list(folderId),
    queryFn: async () => {
      const params: DocumentQueryParams = {};
      if (folderId !== null) {
        params.folder_id = folderId;
      }
      const { data } = await axiosInstance.get<DocumentListResponse>(
        API_ENDPOINTS.DOCUMENT.BASE,
        { params }
      );
      return data;
    },
    ...options,
  });
};

/**
 * Get document by ID
 */
export const useDocumentById = (id?: string, options?: any) => {
  return useQuery<DocumentResponse, AxiosError>({
    queryKey: DOCUMENT_KEYS.detail(id!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<DocumentResponse>(
        API_ENDPOINTS.DOCUMENT.BY_ID(id!)
      );
      return data;
    },
    enabled: !!id,
    ...options,
  });
};

// ==================== MUTATION HOOKS ====================

interface UploadDocumentVariables {
  file: File;
  name?: string;
  description?: string;
  folder_id?: string | null;
}

/**
 * Upload document
 */
export const useUploadDocument = (
  onProgress?: (progress: number) => void
): UseMutationResult<DocumentResponse, AxiosError, UploadDocumentVariables> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      name,
      description,
      folder_id,
    }: UploadDocumentVariables) => {
      const formData = new FormData();
      formData.append("file", file);
      if (name) formData.append("name", name);
      if (description) formData.append("description", description);
      if (folder_id) formData.append("folder_id", folder_id);

      const { data } = await axiosInstance.post<DocumentResponse>(
        API_ENDPOINTS.DOCUMENT.UPLOAD,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(progress);
            }
          },
        }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the folder's document list
      queryClient.invalidateQueries({
        queryKey: DOCUMENT_KEYS.list(variables.folder_id ?? null),
      });
      // Invalidate folder items (if viewing inside a folder)
      if (variables.folder_id) {
        queryClient.invalidateQueries({
          queryKey: FOLDER_KEYS.items(variables.folder_id),
        });
      }
    },
  });
};

/**
 * Update document metadata (name, description)
 */
export const useUpdateDocument = (): UseMutationResult<
  DocumentResponse,
  AxiosError,
  { id: string; data: UpdateDocumentRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data: updateData,
    }: {
      id: string;
      data: UpdateDocumentRequest;
    }) => {
      const { data } = await axiosInstance.put<DocumentResponse>(
        API_ENDPOINTS.DOCUMENT.BY_ID(id),
        updateData
      );
      return data;
    },
    onSuccess: (response, variables) => {
      // Invalidate specific document detail
      queryClient.invalidateQueries({
        queryKey: DOCUMENT_KEYS.detail(variables.id),
      });
      // Invalidate document lists
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.lists() });
      // Update cache directly for faster UI
      queryClient.setQueryData<DocumentResponse>(
        DOCUMENT_KEYS.detail(variables.id),
        response
      );
    },
  });
};

/**
 * Delete document
 */
export const useDeleteDocument = (): UseMutationResult<
  { success: boolean; message?: string },
  AxiosError,
  { id: string; folderId: string | null }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string; folderId: string | null }) => {
      const { data } = await axiosInstance.delete<{ success: boolean }>(
        API_ENDPOINTS.DOCUMENT.BY_ID(id)
      );
      return data;
    },
    onSuccess: (_, variables) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: DOCUMENT_KEYS.detail(variables.id),
      });
      // Invalidate folder's document list
      queryClient.invalidateQueries({
        queryKey: DOCUMENT_KEYS.list(variables.folderId),
      });
      // Invalidate folder items
      if (variables.folderId) {
        queryClient.invalidateQueries({
          queryKey: FOLDER_KEYS.items(variables.folderId),
        });
      }
    },
  });
};

/**
 * Move document to new folder
 */
export const useMoveDocument = (): UseMutationResult<
  DocumentResponse,
  AxiosError,
  { id: string; data: MoveDocumentRequest; oldFolderId: string | null }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data: moveData,
    }: {
      id: string;
      data: MoveDocumentRequest;
      oldFolderId: string | null;
    }) => {
      const { data } = await axiosInstance.put<DocumentResponse>(
        API_ENDPOINTS.DOCUMENT.MOVE(id),
        moveData
      );
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate old folder's document list
      queryClient.invalidateQueries({
        queryKey: DOCUMENT_KEYS.list(variables.oldFolderId),
      });
      // Invalidate new folder's document list
      queryClient.invalidateQueries({
        queryKey: DOCUMENT_KEYS.list(variables.data.folder_id ?? null),
      });
      // Invalidate document detail
      queryClient.invalidateQueries({
        queryKey: DOCUMENT_KEYS.detail(variables.id),
      });
      // Invalidate folder items
      if (variables.oldFolderId) {
        queryClient.invalidateQueries({
          queryKey: FOLDER_KEYS.items(variables.oldFolderId),
        });
      }
      if (variables.data.folder_id) {
        queryClient.invalidateQueries({
          queryKey: FOLDER_KEYS.items(variables.data.folder_id),
        });
      }
    },
  });
};

/**
 * Share/unshare document (toggle public/private)
 */
export const useShareDocument = (): UseMutationResult<
  DocumentResponse,
  AxiosError,
  { id: string; data: ShareDocumentRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data: shareData,
    }: {
      id: string;
      data: ShareDocumentRequest;
    }) => {
      const { data } = await axiosInstance.put<DocumentResponse>(
        API_ENDPOINTS.DOCUMENT.SHARE(id),
        shareData
      );
      return data;
    },
    onSuccess: (response, variables) => {
      // Invalidate document detail
      queryClient.invalidateQueries({
        queryKey: DOCUMENT_KEYS.detail(variables.id),
      });
      // Update cache directly
      queryClient.setQueryData<DocumentResponse>(
        DOCUMENT_KEYS.detail(variables.id),
        response
      );
    },
  });
};

/**
 * Download document - returns the download URL
 */
export const getDocumentDownloadUrl = (id: string): string => {
  return `${axiosInstance.defaults.baseURL}${API_ENDPOINTS.DOCUMENT.DOWNLOAD(id)}`;
};

/**
 * Trigger document download
 */
export const downloadDocument = async (document: Document): Promise<void> => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.DOCUMENT.DOWNLOAD(document.id),
      {
        responseType: "blob",
      }
    );

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = window.document.createElement("a");
    link.href = url;
    link.setAttribute("download", document.original_name || document.name);
    window.document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw error;
  }
};
