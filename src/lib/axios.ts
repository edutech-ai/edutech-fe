import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

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

// Request interceptor - add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from Zustand store
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem("edutech-storage");
      if (storage) {
        try {
          const { state } = JSON.parse(storage);
          const token = state?.user?.token;
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
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

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const isAuthPage =
          window.location.pathname.startsWith("/login") ||
          window.location.pathname.startsWith("/register");

        // Chỉ relaod nếu không phải trang đăng nhập/đăng ký
        if (!isAuthPage) {
          localStorage.removeItem("edutech-storage");
          window.location.href = "/login";
        }
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

export default axiosInstance;
