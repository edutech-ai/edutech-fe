import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  Profile,
  UpdateProfileRequest,
  ProfileResponse,
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
