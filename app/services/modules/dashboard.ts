import { api } from "../apiClient";
import { getCookie } from "@/app/lib/cookies";

export type ActivityItem = {
  type: string;
  title?: string;
  actor?: { id: string; name?: string; email?: string } | null;
  createdAt: string;
  refId?: string;
  url?: string | null;
};

export type DashboardResult = {
  totals: {
    totalUsers: number;
    publishedPages: number;
    mediaItems: number;
    caseStudies: number;
    blogs: number;
    monthlyTraffic: { visits?: number | null; changePct?: number | null };
  };
  recentActivity: ActivityItem[];
};

export const DashboardApi = {
  async get(): Promise<DashboardResult> {
    const token = await getCookie("token");
    return api.get<DashboardResult>("/admin/dashboard", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  },
};

export default DashboardApi;
