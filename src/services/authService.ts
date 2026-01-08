import { createMutationHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type { User } from "@/types";

// ==================== TYPE DEFINITIONS ====================

export interface RegisterRequest {
  email: string;
  password: string;
  role: "TEACHER" | "STUDENT";
  subject?: string;
}

export interface VerifyRegisterRequest {
  email: string;
  otpCode: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
  };
}

export interface VerifyRegisterResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    token: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}

// ==================== AUTH SERVICES ====================

export const useLoginService = createMutationHook(
  "user",
  API_ENDPOINTS.AUTH.LOGIN
);
export const useRegisterService = createMutationHook(
  "user",
  API_ENDPOINTS.AUTH.REGISTER
);
export const useVerifyRegisterService = createMutationHook(
  "user",
  API_ENDPOINTS.AUTH.VERIFY_REGISTER
);
export const useForgotPasswordService = createMutationHook(
  "forgot-password",
  API_ENDPOINTS.AUTH.FORGOT_PASSWORD
);
export const useResetPasswordService = createMutationHook(
  "reset-password",
  API_ENDPOINTS.AUTH.RESET_PASSWORD
);
export const useChangePasswordService = createMutationHook(
  "change-password",
  API_ENDPOINTS.AUTH.CHANGE_PASSWORD
);
export const useVerifyOtpService = createMutationHook(
  "verify-otp",
  API_ENDPOINTS.AUTH.VERIFY_OTP
);
