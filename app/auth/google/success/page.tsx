"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useUserStore((state) => state.setUser);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing in development mode (React StrictMode)
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleGoogleCallback = async () => {
      try {
        // Get token and user data from URL params
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");
        const expiresIn = searchParams.get("expiresIn");
        const error = searchParams.get("error");

        // Check if there's an error from the backend
        if (error) {
          toast.error(`Đăng nhập Google thất bại: ${error}`);
          router.push("/login");
          return;
        }

        // Validate required tokens
        if (!accessToken) {
          toast.error("Không nhận được token từ Google");
          router.push("/login");
          return;
        }

        // Fetch user profile using the access token
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể lấy thông tin người dùng");
        }

        const userData = await response.json();
        const user = userData.data || userData;

        if (!user) {
          toast.error("Dữ liệu người dùng không hợp lệ");
          router.push("/login");
          return;
        }

        // Calculate token expiry timestamp
        const tokenExpiryTime =
          Date.now() + (expiresIn ? parseInt(expiresIn) : 900) * 1000;

        const userWithToken = {
          ...user,
          accessToken,
          refreshToken,
          tokenExpiryTime,
        };

        setUser(userWithToken);

        // Save to localStorage
        const storageData = {
          state: { user: userWithToken },
          version: 0,
        };
        localStorage.setItem("edutech-storage", JSON.stringify(storageData));

        toast.success("Đăng nhập Google thành công!");

        // Redirect based on user role
        if (user.role?.toUpperCase() === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (user.role?.toUpperCase() === "TEACHER") {
          router.push("/dashboard");
        } else {
          router.push("/app");
        }
      } catch (error) {
        console.error("Google callback error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi đăng nhập với Google"
        );
        router.push("/login");
      }
    };

    handleGoogleCallback();
  }, [router, searchParams, setUser]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
        <p className="mt-4 text-gray-600">Đang xử lý đăng nhập Google...</p>
      </div>
    </div>
  );
}

export default function GoogleSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
