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
  QUIZ: {
    BASE: "/quizzes",
    MY_QUIZZES: "/quizzes/my-quizzes",
    PUBLIC: "/quizzes/public",
    BY_ID: (id: string) => `/quizzes/${id}`,
    BY_EXAM_CODE: (examCode: string) => `/quizzes/exam-code/${examCode}`,
    QUESTIONS: (id: string) => `/quizzes/${id}/questions`,
    STATS: (id: string) => `/quizzes/${id}/stats`,
  },

  // Question endpoints
  QUESTION: {
    BASE: "/questions",
    BULK: "/questions/bulk",
    BY_ID: (id: string) => `/questions/${id}`,
    BY_QUIZ_ID: (quizId: string) => `/questions/quiz/${quizId}`,
    DELETE_BY_QUIZ_ID: (quizId: string) => `/questions/quiz/${quizId}`,
    BY_DOCUMENT_ID: (documentId: string) => `/questions/document/${documentId}`,
  },
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
