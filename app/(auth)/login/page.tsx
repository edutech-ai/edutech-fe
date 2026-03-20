"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLoginService } from "@/services/authService";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";
import { GoogleLoginButton } from "@/components/atoms/GoogleLoginButton";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { getProfile } from "@/services/profileService";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const loginMutation = useLoginService();

  const handleGoogleLogin = () => {
    try {
      setIsGoogleLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      window.location.href = `${apiUrl}${API_ENDPOINTS.AUTH.GOOGLE}`;
    } catch {
      setIsGoogleLoading(false);
      toast.error("Không thể kết nối đến Google");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    try {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: async (response) => {
            try {
              const responseData = response.data?.data || response.data;
              const { user, accessToken, refreshToken, expiresIn } =
                responseData;

              if (!user || !accessToken) {
                toast.error("Dữ liệu đăng nhập không hợp lệ");
                return;
              }

              // Calculate token expiry timestamp
              const tokenExpiryTime = Date.now() + (expiresIn || 900) * 1000; // expiresIn is in seconds

              const userWithToken = {
                ...user,
                accessToken,
                refreshToken,
                tokenExpiryTime,
              };

              const storageData = {
                state: { user: userWithToken },
                version: 0,
              };
              localStorage.setItem(
                "edutech-storage",
                JSON.stringify(storageData)
              );

              try {
                const profile = await getProfile();
                userWithToken.name = profile.name || user.email;
                userWithToken.avatar_url = profile.avatar_url || undefined;

                storageData.state.user = userWithToken;
                localStorage.setItem(
                  "edutech-storage",
                  JSON.stringify(storageData)
                );
              } catch {
                userWithToken.name = user.email;
              }

              setUser(userWithToken);

              toast.success("Đăng nhập thành công!");

              if (user.role?.toUpperCase() === "ADMIN") {
                router.push("/admin/dashboard");
              } else if (user.role?.toUpperCase() === "TEACHER") {
                router.push("/dashboard");
              } else {
                router.push("/app");
              }
            } catch {
              toast.error("Có lỗi xảy ra khi xử lý đăng nhập");
            }
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.message ||
              error?.response?.data ||
              error?.message ||
              "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.";

            toast.error(
              typeof errorMessage === "string"
                ? errorMessage
                : JSON.stringify(errorMessage)
            );
          },
        }
      );
    } catch {
      toast.error("Có lỗi không mong muốn xảy ra");
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Chào mừng{" "}
          <span className="font-bold text-gray-900">quay trở lại</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Nhập email và mật khẩu để đăng nhập vào tài khoản.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-0">
        {/* {loginMutation.isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {loginMutation.error?.message || "Đăng nhập thất bại"}
          </div>
        )} */}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          {/* add eyes to password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-eye-icon lucide-eye"
                >
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-eye-off-icon lucide-eye-off"
                >
                  <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                  <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                  <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                  <path d="m2 2 20 20" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-700"
            >
              Ghi nhớ đăng nhập
            </label>
          </div>

          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Hoặc</span>
          </div>
        </div>

        <GoogleLoginButton
          onLogin={handleGoogleLogin}
          isLoading={isGoogleLoading}
        />

        <div className="text-center text-sm">
          <span className="text-gray-600">Chưa có tài khoản? </span>
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Đăng ký tại đây
          </Link>
        </div>
      </form>
    </div>
  );
}
