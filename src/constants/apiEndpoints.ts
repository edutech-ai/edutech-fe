export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    REGISTER: "/auth/register",
    VERIFY_REGISTER: "/auth/verify-register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_OTP: "/auth/verify-otp",
    RESET_PASSWORD: "/auth/reset-password",
    GOOGLE: "/auth/google",
    GOOGLE_CALLBACK: "/auth/google/callback",
  },

  // Profile endpoints
  PROFILE: {
    BASE: "/profile",
    PROFILE: "/profile",
    BY_ID: (id: string) => `/profile/${id}`,
  },

  // Settings endpoints
  SETTINGS: {
    PRICE_PLANS: "/settings/price-plans",
    PRICE_PLAN_BY_ID: (id: string) => `/settings/price-plans/${id}`,
    FAQS: "/settings/faqs",
    FAQ_BY_ID: (id: string) => `/settings/faqs/${id}`,
  },

  // Quiz endpoints
  // QUIZ: {
  //   BASE: "/quizzes",
  //   BY_ID: (id: string) => `/quizzes/${id}`,
  //   GENERATE: "/quizzes/generate",
  // },

  // Exam endpoints
  // EXAM: {
  //   BASE: "/exams",
  //   BY_ID: (id: string) => `/exams/${id}`,
  //   INSTANCES: "/exam-instances",
  //   SUBMIT: (code: string) => `/exam-instances/${code}/submit`,
  // },
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
