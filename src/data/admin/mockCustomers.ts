export interface Customer {
  id: string;
  name: string;
  type: "school" | "district";
  plan: "free" | "teacher" | "school" | "district" | "trial" | "suspended";
  users: number;
  maxUsers: number;
  mrr: number; // Monthly Recurring Revenue
  status: "active" | "trial" | "suspended" | "cancelled";
  contactEmail: string;
  contactPhone: string;
  address: string;
  joinedDate: string;
  trialEndsAt?: string;
  examsCreated: number;
}

export const mockCustomers: Customer[] = [
  {
    id: "cust-001",
    name: "THCS Nguyễn Du",
    type: "school",
    plan: "school",
    users: 18,
    maxUsers: 25,
    mrr: 99,
    status: "active",
    contactEmail: "admin@thcsnguyendu.edu.vn",
    contactPhone: "024 3123 4567",
    address: "123 Nguyễn Du, Quận Hai Bà Trưng, Hà Nội",
    joinedDate: "2024-09-15",
    examsCreated: 145,
  },
  {
    id: "cust-002",
    name: "THPT Lê Lợi",
    type: "school",
    plan: "district",
    users: 87,
    maxUsers: 150,
    mrr: 299,
    status: "active",
    contactEmail: "admin@thptleloi.edu.vn",
    contactPhone: "028 3987 6543",
    address: "456 Lê Lợi, Quận 1, TP.HCM",
    joinedDate: "2024-08-01",
    examsCreated: 423,
  },
  {
    id: "cust-003",
    name: "THCS Trần Hưng Đạo",
    type: "school",
    plan: "school",
    users: 22,
    maxUsers: 25,
    mrr: 99,
    status: "active",
    contactEmail: "admin@thcstranhungdao.edu.vn",
    contactPhone: "0236 3456 789",
    address: "789 Trần Hưng Đạo, Đà Nẵng",
    joinedDate: "2024-10-20",
    examsCreated: 89,
  },
  {
    id: "cust-004",
    name: "Sở GD&ĐT Hà Nội",
    type: "district",
    plan: "district",
    users: 245,
    maxUsers: 500,
    mrr: 999,
    status: "active",
    contactEmail: "admin@sgdhanoi.edu.vn",
    contactPhone: "024 3123 0000",
    address: "Số 1 Phạm Hùng, Cầu Giấy, Hà Nội",
    joinedDate: "2024-07-01",
    examsCreated: 1247,
  },
  {
    id: "cust-005",
    name: "THPT Chuyên Lê Hồng Phong",
    type: "school",
    plan: "trial",
    users: 5,
    maxUsers: 10,
    mrr: 0,
    status: "trial",
    contactEmail: "admin@chuyenlhp.edu.vn",
    contactPhone: "028 3812 3456",
    address: "240 Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
    joinedDate: "2025-01-15",
    trialEndsAt: "2025-01-29",
    examsCreated: 12,
  },
  {
    id: "cust-006",
    name: "THCS Chu Văn An",
    type: "school",
    plan: "school",
    users: 15,
    maxUsers: 25,
    mrr: 99,
    status: "active",
    contactEmail: "admin@thcscva.edu.vn",
    contactPhone: "024 3765 4321",
    address: "15 Chu Văn An, Ba Đình, Hà Nội",
    joinedDate: "2024-11-05",
    examsCreated: 67,
  },
  {
    id: "cust-007",
    name: "THPT Phan Bội Châu",
    type: "school",
    plan: "suspended",
    users: 0,
    maxUsers: 25,
    mrr: 0,
    status: "suspended",
    contactEmail: "admin@thptpbc.edu.vn",
    contactPhone: "0238 3654 789",
    address: "78 Phan Bội Châu, Nghệ An",
    joinedDate: "2024-06-10",
    examsCreated: 34,
  },
];

export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find((customer) => customer.id === id);
};

export const getCustomerStats = () => {
  const total = mockCustomers.length;
  const active = mockCustomers.filter((c) => c.status === "active").length;
  const trial = mockCustomers.filter((c) => c.status === "trial").length;
  const suspended = mockCustomers.filter(
    (c) => c.status === "suspended"
  ).length;
  const totalMRR = mockCustomers.reduce((sum, c) => sum + c.mrr, 0);
  const totalUsers = mockCustomers.reduce((sum, c) => sum + c.users, 0);

  return {
    total,
    active,
    trial,
    suspended,
    totalMRR,
    totalUsers,
  };
};
