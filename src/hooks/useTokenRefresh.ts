import { useEffect, useRef } from "react";
import { useUserStore } from "@/store/useUserStore";
import { isTokenExpired, getRemainingTokenTime } from "@/utils/tokenUtils";
import { axiosInstance } from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

/**
 * Hook to automatically refresh token before it expires
 *
 * This hook monitors the token expiry time and proactively refreshes
 * the token before it expires (default: 2 minutes before expiry)
 *
 * @param bufferTime - Time in seconds before expiry to trigger refresh (default: 120 seconds)
 */
export const useTokenRefresh = (bufferTime: number = 120) => {
  const { user, setUser } = useUserStore();
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Only setup refresh if user is logged in
    if (!user || !user.accessToken || !user.refreshToken) {
      return;
    }

    const scheduleRefresh = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tokenExpiryTime, refreshToken } = user;

      // Check if token is already expired or about to expire
      if (isTokenExpired(tokenExpiryTime, bufferTime)) {
        // Token is expired or expiring soon, refresh immediately
        performRefresh();
        return;
      }

      // Calculate when to refresh (bufferTime seconds before expiry)
      const remainingTime = getRemainingTokenTime(tokenExpiryTime);
      const refreshIn = Math.max(0, remainingTime - bufferTime);

      // Schedule refresh
      refreshTimerRef.current = setTimeout(() => {
        performRefresh();
      }, refreshIn * 1000);
    };

    const performRefresh = async () => {
      try {
        const refreshToken = user.refreshToken;
        if (!refreshToken) {
          return;
        }

        const response = await axiosInstance.post(
          API_ENDPOINTS.AUTH.REFRESH_TOKEN,
          { refreshToken }
        );

        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn,
        } = response.data?.data || response.data;

        if (!newAccessToken) {
          return;
        }

        // Calculate new token expiry timestamp
        const tokenExpiryTime = Date.now() + (expiresIn || 900) * 1000;

        // Update user with new tokens
        const updatedUser = {
          ...user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken || refreshToken,
          tokenExpiryTime,
        };

        setUser(updatedUser);

        // Schedule next refresh
        scheduleRefresh();
      } catch (error) {
        console.error("Failed to refresh token:", error);
        // The axios interceptor will handle logout if needed
      }
    };

    // Initial schedule
    scheduleRefresh();

    // Cleanup
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [user, setUser, bufferTime]);
};
