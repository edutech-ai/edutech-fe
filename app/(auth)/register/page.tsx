"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useRegisterService,
  useVerifyRegisterService,
} from "@/services/authService";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";
import { GoogleLoginButton } from "@/components/atoms/GoogleLoginButton";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { getProfile } from "@/services/profileService";
import { Eye, EyeOff } from "lucide-react";

type Subject = "TOAN" | "VAN" | "ANH" | string;

const REGISTER_EMAIL_KEY = "edutech_register_email";
const REGISTER_STEP_KEY = "edutech_register_step";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [step, setStep] = useState<"register" | "verify">("register");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "TEACHER" as "TEACHER" | "STUDENT",
    subject: "" as Subject,
  });

  const registerMutation = useRegisterService();
  const verifyMutation = useVerifyRegisterService();

  const handleGoogleSignup = () => {
    try {
      setIsGoogleLoading(true);
      // Redirect to backend Google OAuth endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      window.location.href = `${apiUrl}${API_ENDPOINTS.AUTH.GOOGLE}`;
    } catch {
      setIsGoogleLoading(false);
      toast.error("Không thể kết nối đến Google");
    }
  };

  // Restore state from sessionStorage on mount (prevent loss on reload)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = sessionStorage.getItem(REGISTER_EMAIL_KEY);
      const savedStep = sessionStorage.getItem(REGISTER_STEP_KEY);

      if (savedEmail && savedStep === "verify") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRegisteredEmail(savedEmail);
        setStep("verify");
        toast.info("Tiếp tục xác thực tài khoản");
      }
    }
  }, []);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    registerMutation.mutate(
      {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        subject: formData.subject || undefined,
      },
      {
        onSuccess: (response) => {
          const email = response.data?.email || formData.email;

          // Persist to sessionStorage để survive reload
          sessionStorage.setItem(REGISTER_EMAIL_KEY, email);
          sessionStorage.setItem(REGISTER_STEP_KEY, "verify");

          setRegisteredEmail(email);
          setStep("verify");

          toast.success("OTP đã được gửi đến email của bạn!");
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Đăng ký thất bại";
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpCode || otpCode.length !== 6) {
      toast.error("Vui lòng nhập mã OTP 6 chữ số");
      return;
    }

    verifyMutation.mutate(
      {
        email: registeredEmail, // Auto-filled, không cần user nhập
        otpCode,
      },
      {
        onSuccess: async (response) => {
          const responseData = response.data?.data || response.data;
          const { token, userId } = responseData;

          // Clear sessionStorage after successful verification
          sessionStorage.removeItem(REGISTER_EMAIL_KEY);
          sessionStorage.removeItem(REGISTER_STEP_KEY);

          // Save user with token (matching login pattern)
          const userWithToken = {
            id: userId,
            email: registeredEmail,
            accessToken: token,
          };

          // CRITICAL: Force sync to localStorage (prevent redirect loop)
          const storageData = {
            state: { user: userWithToken },
            version: 0,
          };
          localStorage.setItem("edutech-storage", JSON.stringify(storageData));

          try {
            const profile = await getProfile();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (userWithToken as any).name = profile.name || registeredEmail;

            storageData.state.user = userWithToken;
            localStorage.setItem(
              "edutech-storage",
              JSON.stringify(storageData)
            );
          } catch {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (userWithToken as any).name = registeredEmail;
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setUser(userWithToken as any);

          toast.success("Xác thực thành công! Chào mừng bạn đến với EduTech!");

          // Redirect after successful verification
          router.push("/dashboard");
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Xác thực OTP thất bại";
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleBackToRegister = () => {
    // Clear sessionStorage when going back
    sessionStorage.removeItem(REGISTER_EMAIL_KEY);
    sessionStorage.removeItem(REGISTER_STEP_KEY);
    setStep("register");
    setOtpCode("");
  };

  // Render register form
  if (step === "register") {
    return (
      <div className="w-full max-w-md space-y-6 px-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Tạo tài khoản <span className="font-bold">mới</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Điền thông tin để tạo tài khoản EduTech AI
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="your@email.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận *
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò *
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as "TEACHER" | "STUDENT",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="TEACHER">Giáo viên</option>
              <option value="STUDENT">Học sinh</option>
            </select>
          </div>

          {formData.role === "TEACHER" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Môn giảng dạy
              </label>
              <select
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Chọn môn</option>
                <option value="TOAN">Toán</option>
                <option value="VAN">Ngữ Văn</option>
                <option value="ANH">Tiếng Anh</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition mt-6"
          >
            {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
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
            onLogin={handleGoogleSignup}
            isLoading={isGoogleLoading}
            text="Đăng ký với Google"
          />

          <div className="text-center text-sm">
            <span className="text-gray-600">Đã có tài khoản? </span>
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    );
  }

  // Render OTP verification form
  return (
    <div className="w-full max-w-md space-y-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Xác thực <span className="font-bold">tài khoản</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Nhập mã OTP đã được gửi đến email{" "}
          <span className="font-semibold">{registeredEmail}</span>
        </p>
      </div>

      <form onSubmit={handleVerifySubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mã OTP (6 chữ số) *
          </label>
          <input
            type="text"
            required
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center tracking-widest"
            placeholder="000000"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={verifyMutation.isPending}
          className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {verifyMutation.isPending ? "Đang xác thực..." : "Xác thực"}
        </button>

        <button
          type="button"
          onClick={handleBackToRegister}
          className="w-full text-sm text-gray-600 hover:text-gray-800"
        >
          ← Quay lại đăng ký
        </button>
      </form>
    </div>
  );
}
