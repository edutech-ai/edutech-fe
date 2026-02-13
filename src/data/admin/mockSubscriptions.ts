export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: "free" | "teacher" | "school" | "district";
  price: number;
  billingPeriod: "monthly" | "yearly";
  maxUsers: number;
  maxExamsPerMonth: number | "unlimited";
  features: string[];
  isPopular?: boolean;
}

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan-free",
    name: "Free",
    slug: "free",
    price: 0,
    billingPeriod: "monthly",
    maxUsers: 1,
    maxExamsPerMonth: 5,
    features: [
      "5 đề thi/tháng",
      "Tạo đề thủ công",
      "Export PDF cơ bản",
      "Lưu trữ trong 30 ngày",
    ],
  },
  {
    id: "plan-teacher",
    name: "Teacher Pro",
    slug: "teacher",
    price: 9,
    billingPeriod: "monthly",
    maxUsers: 1,
    maxExamsPerMonth: "unlimited",
    features: [
      "Đề thi không giới hạn",
      "AI tạo đề tự động",
      "Export PDF nâng cao",
      "Ngân hàng câu hỏi",
      "Tạo nhiều đề song song",
      "Hỗ trợ email",
    ],
  },
  {
    id: "plan-school",
    name: "School",
    slug: "school",
    price: 99,
    billingPeriod: "monthly",
    maxUsers: 25,
    maxExamsPerMonth: "unlimited",
    features: [
      "Tất cả tính năng Teacher Pro",
      "25 tài khoản giáo viên",
      "Ngân hàng câu hỏi chung",
      "Quản lý theo tổ/khoa",
      "Import từ Excel/Word",
      "Thống kê chi tiết",
      "Hỗ trợ ưu tiên",
    ],
    isPopular: true,
  },
  {
    id: "plan-district",
    name: "District",
    slug: "district",
    price: 299,
    billingPeriod: "monthly",
    maxUsers: 999999,
    maxExamsPerMonth: "unlimited",
    features: [
      "Tất cả tính năng School",
      "Không giới hạn người dùng",
      "Quản lý đa trường",
      "API tích hợp",
      "Đào tạo onboarding",
      "Dedicated support",
      "Custom branding",
      "SLA 99.9%",
    ],
  },
];

export const getPlanById = (id: string): SubscriptionPlan | undefined => {
  return mockSubscriptionPlans.find((plan) => plan.id === id);
};

export const getPlanBySlug = (slug: string): SubscriptionPlan | undefined => {
  return mockSubscriptionPlans.find((plan) => plan.slug === slug);
};
