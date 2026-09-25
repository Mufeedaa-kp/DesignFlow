import { useQuery } from "@tanstack/react-query";
import api from "../../../services/api";

export interface IAnalyticsOverview {
  funnel: {
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    approvalRate: number;
  };
  projectsByStatus: { _id: string; count: number }[];
  usersByRole: { _id: string; count: number }[];
  requestsPerMonth: { _id: { year: number; month: number }; count: number }[];
}

export const useAnalyticsOverview = () => {
  return useQuery<IAnalyticsOverview>({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const res = await api.get("/analytics/overview");
      return res.data.data;
    },
  });
};