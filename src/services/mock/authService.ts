import type { User, AuthResponse, UserRole } from "@/types";
import { mockTeacher, mockAdmin } from "@/mock";
import { mockApiResponse, mockApiError } from "./mockApi";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  school?: string;
  subject?: string;
  grade?: number;
}

export const authMockService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simple mock: any email/password works
    if (!credentials.email || !credentials.password) {
      return mockApiError("Email và mật khẩu không được để trống");
    }

    // Return admin user if email is admin@edu.vn
    const user = credentials.email === "admin@edu.vn" ? mockAdmin : mockTeacher;

    // Simulate successful login
    return mockApiResponse<AuthResponse>({
      user,
      token: `mock-jwt-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
    });
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Simple validation
    if (!data.email || !data.password || !data.name) {
      return mockApiError("Vui lòng điền đầy đủ thông tin");
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: data.role,
      school: data.school,
      subject: data.subject,
      grade: data.grade,
      createdAt: new Date().toISOString(),
    };

    return mockApiResponse<AuthResponse>({
      user: newUser,
      token: `mock-jwt-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
    });
  },

  logout: async (): Promise<void> => {
    return mockApiResponse(undefined, 300);
  },

  getCurrentUser: async (): Promise<User> => {
    return mockApiResponse(mockTeacher, 500);
  },
};
