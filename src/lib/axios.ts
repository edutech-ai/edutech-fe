import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

// API base URL - will be replaced with real API later
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from Zustand store
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem("edutech-storage");
      if (storage) {
        try {
          const { state } = JSON.parse(storage);
          const accessToken = state?.user?.accessToken;
          if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        } catch {
          // console.error("Failed to parse auth storage:", error);
        }
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally and refresh token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && originalRequest) {
      // Don't retry if this is already a retry or if it's a login/register request
      const isAuthEndpoint =
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/register") ||
        originalRequest.url?.includes("/auth/refresh-token");

      if (isAuthEndpoint || originalRequest._retry) {
        // If refresh token also failed or this is an auth endpoint, logout
        if (typeof window !== "undefined") {
          const isAuthPage =
            window.location.pathname.startsWith("/login") ||
            window.location.pathname.startsWith("/register");

          if (!isAuthPage) {
            localStorage.removeItem("edutech-storage");
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }

      // Try to refresh token
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get refresh token from storage
        const storage = localStorage.getItem("edutech-storage");
        if (!storage) {
          throw new Error("No refresh token available");
        }

        const { state } = JSON.parse(storage);
        const refreshToken = state?.user?.refreshToken;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn,
        } = response.data?.data || response.data;

        if (!newAccessToken) {
          throw new Error("Invalid refresh response");
        }

        // Calculate new token expiry timestamp
        const tokenExpiryTime = Date.now() + (expiresIn || 900) * 1000; // expiresIn is in seconds

        // Update tokens in storage
        const updatedUser = {
          ...state.user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken || refreshToken, // Use new refresh token if provided
          tokenExpiryTime,
        };

        const storageData = {
          state: { user: updatedUser },
          version: 0,
        };
        localStorage.setItem("edutech-storage", JSON.stringify(storageData));

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError as AxiosError, null);

        if (typeof window !== "undefined") {
          const isAuthPage =
            window.location.pathname.startsWith("/login") ||
            window.location.pathname.startsWith("/register");

          if (!isAuthPage) {
            localStorage.removeItem("edutech-storage");
            window.location.href = "/login";
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access denied");
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Server error occurred");
    }

    return Promise.reject(error);
  }
);

/**
 * Public axios instance — no auth token, no 401 redirect.
 */
export const publicAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
