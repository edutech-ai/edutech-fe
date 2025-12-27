import { User, UserRole } from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "nguyen.van.a@edu.vn",
    name: "Nguyễn Văn A",
    role: UserRole.TEACHER,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenVanA",
    phone: "0912345678",
    school: "THPT Lê Quý Đôn",
    subject: "Toán",
    grade: 10,
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "2",
    email: "tran.thi.b@edu.vn",
    name: "Trần Thị B",
    role: UserRole.TEACHER,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TranThiB",
    phone: "0987654321",
    school: "THCS Trần Hưng Đạo",
    subject: "Ngữ Văn",
    grade: 9,
    createdAt: "2024-02-10T08:00:00Z",
  },
  {
    id: "3",
    email: "le.van.c@edu.vn",
    name: "Lê Văn C",
    role: UserRole.TEACHER,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LeVanC",
    phone: "0909123456",
    school: "THPT Nguyễn Huệ",
    subject: "Tiếng Anh",
    grade: 11,
    createdAt: "2024-03-05T08:00:00Z",
  },
];

export const mockTeacher: User = mockUsers[0];
