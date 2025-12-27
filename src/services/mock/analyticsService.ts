import type { AnalyticsData } from "@/types";
import { mockAnalytics } from "@/mock";
import { mockApiResponse } from "./mockApi";

export const analyticsMockService = {
  getDashboardData: async (): Promise<AnalyticsData> => {
    return mockApiResponse(mockAnalytics);
  },
};
