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
    SUBSCRIPTION_PLANS: "/settings/subscription-plans",
    SUBSCRIPTION_PLAN_BY_ID: (id: string) =>
      `/settings/subscription-plans/${id}`,
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

  // Classroom endpoints
  CLASSROOM: {
    BASE: "/classrooms",
    BY_ID: (id: string) => `/classrooms/${id}`,
    STUDENTS: (classroomId: string) => `/classrooms/${classroomId}/students`,
    STUDENTS_ADD_EXISTING: (classroomId: string) =>
      `/classrooms/${classroomId}/students/add-existing`,
    STUDENTS_UPLOAD: (classroomId: string) =>
      `/classrooms/${classroomId}/students/upload`,
    STUDENT: (classroomId: string, studentId: string) =>
      `/classrooms/${classroomId}/students/${studentId}`,
    STUDENT_PERFORMANCE: (classroomId: string, studentId: string) =>
      `/classrooms/${classroomId}/students/${studentId}/performance`,
    LEADERBOARD: (classroomId: string) =>
      `/classrooms/${classroomId}/leaderboard`,
    // Scores
    SCORES: (classroomId: string) => `/classrooms/${classroomId}/scores`,
    SCORE_BY_ID: (classroomId: string, scoreId: string) =>
      `/classrooms/${classroomId}/scores/${scoreId}`,
    STUDENT_SCORES: (classroomId: string, studentId: string) =>
      `/classrooms/${classroomId}/students/${studentId}/scores`,
    SCORES_UPLOAD: (classroomId: string) =>
      `/classrooms/${classroomId}/scores/upload`,
    // Performance
    PERFORMANCE: (classroomId: string) =>
      `/classrooms/${classroomId}/performance`,
    STUDENT_PERFORMANCE_NOTES: (classroomId: string, studentId: string) =>
      `/classrooms/${classroomId}/students/${studentId}/performance/notes`,
    STUDENT_PERFORMANCE_RECALCULATE: (classroomId: string, studentId: string) =>
      `/classrooms/${classroomId}/students/${studentId}/performance/recalculate`,
    PERFORMANCE_RECALCULATE: (classroomId: string) =>
      `/classrooms/${classroomId}/performance/recalculate`,
    // Hand Raises
    HAND_RAISES: (classroomId: string) =>
      `/classrooms/${classroomId}/hand-raises`,
    HAND_RAISES_BATCH: (classroomId: string) =>
      `/classrooms/${classroomId}/hand-raises/batch`,
    STUDENT_HAND_RAISES: (classroomId: string, studentId: string) =>
      `/classrooms/${classroomId}/students/${studentId}/hand-raises`,
  },

  // Student endpoints
  STUDENT: {
    BASE: "/students",
    BY_ID: (id: string) => `/students/${id}`,
  },

  // Folder endpoints
  FOLDER: {
    BASE: "/folders",
    TREE: "/folders/tree",
    BY_ID: (id: string) => `/folders/${id}`,
    PATH: (id: string) => `/folders/${id}/path`,
    CHILDREN: (id: string) => `/folders/${id}/children`,
    ITEMS: (id: string) => `/folders/${id}/items`,
    MOVE: (id: string) => `/folders/${id}/move`,
  },

  // AI endpoints
  AI: {
    CREATE_QUIZ_WITH_QUESTIONS: "/ai/create-quiz-with-questions",
    ANALYZE_QUIZ: "/ai/analyze-quiz",
  },

  // Admin Dashboard endpoints
  ADMIN: {
    DASHBOARD: {
      SUMMARY: "/admin/dashboard/summary",
      REVENUE_METRICS: "/admin/dashboard/revenue-metrics",
      ACTIVE_CUSTOMERS: "/admin/dashboard/active-customers",
      TOTAL_USERS: "/admin/dashboard/total-users",
      AVG_REVENUE_PER_CUSTOMER: "/admin/dashboard/avg-revenue-per-customer",
      TRIAL_USERS: "/admin/dashboard/trial-users",
      EXAMS_CREATED: "/admin/dashboard/exams-created",
      REVENUE_CHART: "/admin/dashboard/revenue-chart",
      USER_GROWTH_CHART: "/admin/dashboard/user-growth-chart",
    },
  },
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
