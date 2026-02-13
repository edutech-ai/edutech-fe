import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  Profile,
  UpdateProfileRequest,
  ProfileResponse,
  TeacherStats,
  RecentActivity,
} from "@/types/profile";

export const getProfile = async (): Promise<Profile> => {
  const response = await axiosInstance.get<ProfileResponse>(
    API_ENDPOINTS.PROFILE.PROFILE
  );
  return response.data.data;
};

export const createProfile = async (
  data: UpdateProfileRequest
): Promise<Profile> => {
  const response = await axiosInstance.post<ProfileResponse>(
    API_ENDPOINTS.PROFILE.PROFILE,
    data
  );
  return response.data.data;
};

export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<Profile> => {
  const response = await axiosInstance.put<ProfileResponse>(
    API_ENDPOINTS.PROFILE.PROFILE,
    data
  );
  return response.data.data;
};

export const deleteProfile = async (): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.PROFILE.PROFILE);
};

// ==================== TEACHER STATS & ACTIVITIES ====================

const PROFILE_KEYS = {
  stats: ["profile", "stats"] as const,
  recentActivities: ["profile", "recent-activities"] as const,
};

export const useTeacherStats = () => {
  return useQuery<TeacherStats>({
    queryKey: PROFILE_KEYS.stats,
    queryFn: async () => {
      const { data } = await axiosInstance.get<{
        success: boolean;
        data: TeacherStats;
      }>(API_ENDPOINTS.PROFILE.STATS);
      return data.data;
    },
  });
};

export const useRecentActivities = () => {
  return useQuery<RecentActivity[]>({
    queryKey: PROFILE_KEYS.recentActivities,
    queryFn: async () => {
      const { data } = await axiosInstance.get<{
        success: boolean;
        data: RecentActivity[];
      }>(API_ENDPOINTS.PROFILE.RECENT_ACTIVITIES);
      return data.data;
    },
  });
};
