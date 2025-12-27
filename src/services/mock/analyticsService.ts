import { AnalyticsData } from "@/types";
import { mockAnalytics } from "@/mock-data";
import { mockApiResponse } from "./mockApi";

export const analyticsMockService = {
  getDashboardData: async (): Promise<AnalyticsData> => {
    return mockApiResponse(mockAnalytics);
  },
};
