"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLoginService } from "@/services/authService";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginService();

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
          onSuccess: (response) => {
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
              setUser(userWithToken);

              const storageData = {
                state: { user: userWithToken },
                version: 0,
              };
              localStorage.setItem(
                "edutech-storage",
                JSON.stringify(storageData)
              );

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

  const handleLoginGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
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

        <div className="text-center text-sm">
          <span className="text-gray-600">Chưa có tài khoản? </span>
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Đăng ký ngay
          </Link>
        </div>
      </form>
      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative bg-white px-4 text-sm text-gray-500">
          Hoặc đăng nhập với
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            handleLoginGoogle();
          }}
          className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.5h147.1c-6.4 34.7-25.4 64.1-54.4 83.8v69.5h87.9c51.4-47.3 81.9-117.1 81.9-198.4z"
              fill="#4285F4"
            />
            <path
              d="M272 544.3c73.7 0 135.6-24.4 180.8-66.1l-87.9-69.5c-24.4 16.4-55.5 26-92.9 26-71.4 0-131.9-48.2-153.5-112.8H29.6v70.7C74.3 486.1 167.1 544.3 272 544.3z"
              fill="#34A853"
            />
            <path
              d="M118.5 324.9c-11.4-34-1-11.4-70.7 0-105.8V148.4H29.6c-38.3 76.6-38.3 167.1 0 243.7l88.9-67.2z"
              fill="#FBBC05"
            />
            <path
              d="M272 107.7c39.9-.6 78.3 14.1 107.4 40.4l80.6-80.6C407.4 24.3 341.1-1.3 272 0 167.1 0 74.3 58.2 29.6 148.4l88.9 70.7C140.1 156 200.6 107.7 272 107.7z"
              fill="#EA4335"
            />
          </svg>
          Đăng nhập với Google
        </button>
      </div>
    </div>
  );
}
