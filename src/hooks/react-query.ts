/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosError } from "axios";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

/**
 * Factory function to create a simple query hook
 */
export const createQueryHook =
  (queryKey: string, url: string) =>
  (
    options?: any,
    params?: any
  ): UseQueryResult<any, AxiosError<{ message: string }>> =>
    useQuery({
      queryKey: [queryKey],
      queryFn: async () => (await axiosInstance.get(url, { params })).data,
      ...options,
    });

/**
 * Factory function to create a dynamic query hook
 * Automatically refetches when dependencies change
 */
export const createDynamicQueryHook =
  (baseQueryKey: string, url: string) =>
  (
    dependencies?: any[],
    options?: any,
    params?: any
  ): UseQueryResult<any, AxiosError<{ message: string }>> => {
    const queryKey = dependencies
      ? [baseQueryKey, ...dependencies]
      : [baseQueryKey];

    return useQuery({
      queryKey,
      queryFn: async () => (await axiosInstance.get(url, { params })).data,
      ...options,
    });
  };

/**
 * Factory function to create a query hook with path parameter
 */
export const createQueryWithPathParamHook =
  (queryKey: string, url: string) =>
  (
    id?: string,
    options?: any
  ): UseQueryResult<any, AxiosError<{ message: string }>> => {
    return useQuery({
      queryKey: id ? [queryKey, id] : [queryKey],
      queryFn: async () => (await axiosInstance.get(`${url}/${id}`)).data,
      enabled: !!id,
      ...options,
    });
  };

/**
 * Factory function to create a mutation hook (POST)
 */
export const createMutationHook =
  (queryKey: string, url: string) =>
  (
    id?: string
  ): UseMutationResult<any, AxiosError<{ message: string }>, any> => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (data) =>
        axiosInstance.post(`${url}${id ? `/${id}` : ""}`, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: id ? [queryKey, id] : [queryKey],
        });
      },
    });
  };

/**
 * Factory function to create an update mutation hook (PUT)
 */
export const updateMutationHook =
  (queryKey: string, url: string) =>
  (
    id?: string
  ): UseMutationResult<
    any,
    AxiosError<{ message: string }>,
    { id: string; data: any }
  > => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id: idToUpdate, data }: { id: string; data: any }) =>
        axiosInstance.put(`${url}/${idToUpdate}`, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: id ? [queryKey, id] : [queryKey],
        });
      },
    });
  };

/**
 * Factory function to create a delete mutation hook (DELETE)
 */
export const deleteMutationHook =
  (queryKey: string, url: string) =>
  (
    id?: string
  ): UseMutationResult<any, AxiosError<{ message: string }>, string> => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (idToDelete: string) =>
        axiosInstance.delete(`${url}/${idToDelete}`),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: id ? [queryKey, id] : [queryKey],
        });
      },
    });
  };
