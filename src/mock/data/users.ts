export const mockUsers = [
  {
    id: "user-1",
    fullName: "Nguyễn Văn An",
    username: "teacher.an",
    email: "teacher.an@edutech.vn",
    role: "TEACHER",
    phone: "0901234567",
    avatar: null,
    gender: "MALE",
    birthday: "1985-05-15",
    status: "ACTIVE",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-08T00:00:00Z",
    token: "mock-jwt-token-teacher-an",
    refreshToken: "mock-refresh-token-teacher-an",
  },
  {
    id: "user-2",
    fullName: "Trần Thị Bình",
    username: "teacher.binh",
    email: "teacher.binh@edutech.vn",
    role: "TEACHER",
    phone: "0907654321",
    avatar: null,
    gender: "FEMALE",
    birthday: "1988-08-20",
    status: "ACTIVE",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-12-08T00:00:00Z",
    token: "mock-jwt-token-teacher-binh",
    refreshToken: "mock-refresh-token-teacher-binh",
  },
  {
    id: "admin-1",
    fullName: "Quản Trị Viên",
    username: "admin",
    email: "admin@edutech.vn",
    role: "ADMIN",
    phone: "0909999999",
    avatar: null,
    gender: "MALE",
    birthday: "1980-01-01",
    status: "ACTIVE",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-12-08T00:00:00Z",
    token: "mock-jwt-token-admin",
    refreshToken: "mock-refresh-token-admin",
  },
];

export const mockCurrentUser = mockUsers[0];

export const findUserByEmail = (email: string) =>
  mockUsers.find((user) => user.email === email);

export const findUserByUsername = (username: string) =>
  mockUsers.find((user) => user.username === username);

export const findUserById = (id: string) =>
  mockUsers.find((user) => user.id === id);
