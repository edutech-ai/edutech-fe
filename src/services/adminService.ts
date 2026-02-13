import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

// ==================== TYPES ====================

export interface RevenueMetrics {
  currentMonth: {
    revenue: number;
    period: string;
  };
  lastMonth: {
    revenue: number;
    period: string;
  };
  changePercent: number;
  currency: string;
}

export interface ActiveCustomers {
  activeCount: number;
  lastMonthCount: number;
  changePercent: number;
}

export interface TotalUsers {
  totalUsers: number;
  lastMonthUsers: number;
  changePercent: number;
  breakdown: {
    teachers: number;
    students: number;
  };
}

export interface AvgRevenuePerCustomer {
  avgRevenue: number;
  lastMonthAvg: number;
  changePercent: number;
}

export interface TrialUser {
  id: string;
  email: string;
  trialEndsAt: string;
  potentialRevenue: number;
}

export interface TrialUsers {
  trialCount: number;
  potentialRevenue: number;
  users: TrialUser[];
}

export interface ExamsCreated {
  totalExams: number;
  breakdown: Record<string, number>;
  byMonth: Array<{
    month: string;
    count: number;
  }>;
}

export interface DashboardSummary {
  revenue: RevenueMetrics;
  activeCustomers: ActiveCustomers;
  totalUsers: TotalUsers;
  avgRevenuePerCustomer: AvgRevenuePerCustomer;
  trialUsers: TrialUsers;
  examsCreated: ExamsCreated;
}

export interface RevenueChartData {
  period: string;
  data: Array<{
    date: string;
    revenue: number;
    transactions: number;
  }>;
  total: number;
  average: number;
}

export interface UserGrowthChartData {
  period: string;
  data: Array<{
    date: string;
    newUsers: number;
    totalUsers: number;
  }>;
  summary: {
    totalNewUsers: number;
    avgNewUsersPerDay: number;
    currentTotal: number;
  };
}

// ==================== HOOKS ====================

// Get dashboard summary (all metrics in one call)
export const useGetDashboardSummary = () => {
  return useQuery({
    queryKey: ["admin", "dashboard", "summary"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        API_ENDPOINTS.ADMIN.DASHBOARD.SUMMARY
      );
      return response.data.data as DashboardSummary;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get revenue metrics
export const useGetRevenueMetrics = () => {
  return useQuery({
    queryKey: ["admin", "dashboard", "revenue-metrics"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        API_ENDPOINTS.ADMIN.DASHBOARD.REVENUE_METRICS
      );
      return response.data.data as RevenueMetrics;
    },
  });
};

// Get active customers
export const useGetActiveCustomers = () => {
  return useQuery({
    queryKey: ["admin", "dashboard", "active-customers"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        API_ENDPOINTS.ADMIN.DASHBOARD.ACTIVE_CUSTOMERS
      );
      return response.data.data as ActiveCustomers;
    },
  });
};

// Get total users
export const useGetTotalUsers = () => {
  return useQuery({
    queryKey: ["admin", "dashboard", "total-users"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        API_ENDPOINTS.ADMIN.DASHBOARD.TOTAL_USERS
      );
      return response.data.data as TotalUsers;
    },
  });
};

// Get average revenue per customer
export const useGetAvgRevenuePerCustomer = () => {
  return useQuery({
    queryKey: ["admin", "dashboard", "avg-revenue"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        API_ENDPOINTS.ADMIN.DASHBOARD.AVG_REVENUE_PER_CUSTOMER
      );
      return response.data.data as AvgRevenuePerCustomer;
    },
  });
};

// Get trial users
export const useGetTrialUsers = () => {
  return useQuery({
    queryKey: ["admin", "dashboard", "trial-users"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        API_ENDPOINTS.ADMIN.DASHBOARD.TRIAL_USERS
      );
      return response.data.data as TrialUsers;
    },
  });
};

// Get exams created
export const useGetExamsCreated = () => {
  return useQuery({
    queryKey: ["admin", "dashboard", "exams-created"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        API_ENDPOINTS.ADMIN.DASHBOARD.EXAMS_CREATED
      );
      return response.data.data as ExamsCreated;
    },
  });
};

// Get revenue chart data
export const useGetRevenueChart = (
  period: "7days" | "30days" | "3months" | "1year" = "30days"
) => {
  return useQuery({
    queryKey: ["admin", "dashboard", "revenue-chart", period],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.ADMIN.DASHBOARD.REVENUE_CHART}?period=${period}`
      );
      return response.data.data as RevenueChartData;
    },
  });
};

// Get user growth chart data
export const useGetUserGrowthChart = (
  period: "7days" | "30days" | "3months" | "1year" = "30days"
) => {
  return useQuery({
    queryKey: ["admin", "dashboard", "user-growth-chart", period],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.ADMIN.DASHBOARD.USER_GROWTH_CHART}?period=${period}`
      );
      return response.data.data as UserGrowthChartData;
    },
  });
};
