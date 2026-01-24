/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  FolderListResponse,
  FolderResponse,
  FolderPathResponse,
  FolderItemsResponse,
  CreateFolderRequest,
  UpdateFolderRequest,
  MoveFolderRequest,
  FolderQueryParams,
} from "@/types";

// ==================== QUERY KEYS ====================
export const FOLDER_KEYS = {
  all: ["folders"] as const,
  lists: () => [...FOLDER_KEYS.all, "list"] as const,
  list: (parentId: string | null) =>
    [...FOLDER_KEYS.lists(), { parentId }] as const,
  tree: () => [...FOLDER_KEYS.all, "tree"] as const,
  details: () => [...FOLDER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...FOLDER_KEYS.details(), id] as const,
  path: (id: string) => [...FOLDER_KEYS.all, "path", id] as const,
  children: (id: string) => [...FOLDER_KEYS.all, "children", id] as const,
  items: (id: string) => [...FOLDER_KEYS.all, "items", id] as const,
};

// ==================== QUERY HOOKS ====================

/**
 * Get folders by parent_id (null for root folders)
 */
export const useFolders = (parentId: string | null = null, options?: any) => {
  return useQuery<FolderListResponse, AxiosError>({
    queryKey: FOLDER_KEYS.list(parentId),
    queryFn: async () => {
      const params: FolderQueryParams = {};
      if (parentId !== null) {
        params.parent_id = parentId;
      }
      const { data } = await axiosInstance.get<FolderListResponse>(
        API_ENDPOINTS.FOLDER.BASE,
        { params }
      );
      return data;
    },
    ...options,
  });
};

/**
 * Get full folder tree
 */
export const useFolderTree = (options?: any) => {
  return useQuery<FolderListResponse, AxiosError>({
    queryKey: FOLDER_KEYS.tree(),
    queryFn: async () => {
      const { data } = await axiosInstance.get<FolderListResponse>(
        API_ENDPOINTS.FOLDER.TREE
      );
      return data;
    },
    ...options,
  });
};

/**
 * Get folder by ID
 */
export const useFolderById = (id?: string, options?: any) => {
  return useQuery<FolderResponse, AxiosError>({
    queryKey: FOLDER_KEYS.detail(id!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<FolderResponse>(
        API_ENDPOINTS.FOLDER.BY_ID(id!)
      );
      return data;
    },
    enabled: !!id,
    ...options,
  });
};

/**
 * Get folder path (breadcrumb)
 */
export const useFolderPath = (id?: string, options?: any) => {
  return useQuery<FolderPathResponse, AxiosError>({
    queryKey: FOLDER_KEYS.path(id!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<FolderPathResponse>(
        API_ENDPOINTS.FOLDER.PATH(id!)
      );
      return data;
    },
    enabled: !!id,
    ...options,
  });
};

/**
 * Get folder children (subfolders)
 */
export const useFolderChildren = (id?: string, options?: any) => {
  return useQuery<FolderListResponse, AxiosError>({
    queryKey: FOLDER_KEYS.children(id!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<FolderListResponse>(
        API_ENDPOINTS.FOLDER.CHILDREN(id!)
      );
      return data;
    },
    enabled: !!id,
    ...options,
  });
};

/**
 * Get all items in folder (folders + documents)
 */
export const useFolderItems = (id?: string, options?: any) => {
  return useQuery<FolderItemsResponse, AxiosError>({
    queryKey: FOLDER_KEYS.items(id!),
    queryFn: async () => {
      const { data } = await axiosInstance.get<FolderItemsResponse>(
        API_ENDPOINTS.FOLDER.ITEMS(id!)
      );
      return data;
    },
    enabled: !!id,
    ...options,
  });
};

// ==================== MUTATION HOOKS ====================

/**
 * Create new folder
 */
export const useCreateFolder = (): UseMutationResult<
  FolderResponse,
  AxiosError,
  CreateFolderRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateFolderRequest) => {
      const { data } = await axiosInstance.post<FolderResponse>(
        API_ENDPOINTS.FOLDER.BASE,
        request
      );
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the parent folder list
      queryClient.invalidateQueries({
        queryKey: FOLDER_KEYS.list(variables.parent_id ?? null),
      });
      // Invalidate tree
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.tree() });
      // If has parent, invalidate parent's children and items
      if (variables.parent_id) {
        queryClient.invalidateQueries({
          queryKey: FOLDER_KEYS.children(variables.parent_id),
        });
        queryClient.invalidateQueries({
          queryKey: FOLDER_KEYS.items(variables.parent_id),
        });
      }
    },
  });
};

/**
 * Update folder (name, color)
 */
export const useUpdateFolder = (): UseMutationResult<
  FolderResponse,
  AxiosError,
  { id: string; data: UpdateFolderRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data: updateData,
    }: {
      id: string;
      data: UpdateFolderRequest;
    }) => {
      const { data } = await axiosInstance.put<FolderResponse>(
        API_ENDPOINTS.FOLDER.BY_ID(id),
        updateData
      );
      return data;
    },
    onSuccess: (response, variables) => {
      // Invalidate specific folder detail
      queryClient.invalidateQueries({
        queryKey: FOLDER_KEYS.detail(variables.id),
      });
      // Invalidate folder lists (parent folder might have changed item_count)
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.lists() });
      // Invalidate tree
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.tree() });
      // Update cache directly for faster UI
      queryClient.setQueryData<FolderResponse>(
        FOLDER_KEYS.detail(variables.id),
        response
      );
    },
  });
};

/**
 * Delete folder (only if empty)
 */
export const useDeleteFolder = (): UseMutationResult<
  { success: boolean; message?: string },
  AxiosError<{ message?: string }>,
  { id: string; parentId: string | null }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string; parentId: string | null }) => {
      const { data } = await axiosInstance.delete<{
        success: boolean;
        error?: { code: string };
      }>(API_ENDPOINTS.FOLDER.BY_ID(id));
      return data;
    },
    onSuccess: (_, variables) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: FOLDER_KEYS.detail(variables.id),
      });
      // Invalidate parent folder list
      queryClient.invalidateQueries({
        queryKey: FOLDER_KEYS.list(variables.parentId),
      });
      // Invalidate tree
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.tree() });
      // If has parent, invalidate parent's children and items
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: FOLDER_KEYS.children(variables.parentId),
        });
        queryClient.invalidateQueries({
          queryKey: FOLDER_KEYS.items(variables.parentId),
        });
      }
    },
  });
};

/**
 * Move folder to new parent
 */
export const useMoveFolder = (): UseMutationResult<
  FolderResponse,
  AxiosError,
  { id: string; data: MoveFolderRequest; oldParentId: string | null }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data: moveData,
    }: {
      id: string;
      data: MoveFolderRequest;
      oldParentId: string | null;
    }) => {
      const { data } = await axiosInstance.put<FolderResponse>(
        API_ENDPOINTS.FOLDER.MOVE(id),
        moveData
      );
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate old parent folder list
      queryClient.invalidateQueries({
        queryKey: FOLDER_KEYS.list(variables.oldParentId),
      });
      // Invalidate new parent folder list
      queryClient.invalidateQueries({
        queryKey: FOLDER_KEYS.list(variables.data.parent_id),
      });
      // Invalidate folder detail
      queryClient.invalidateQueries({
        queryKey: FOLDER_KEYS.detail(variables.id),
      });
      // Invalidate tree
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.tree() });
      // Invalidate path (breadcrumb changed)
      queryClient.invalidateQueries({
        queryKey: FOLDER_KEYS.path(variables.id),
      });
    },
  });
};
