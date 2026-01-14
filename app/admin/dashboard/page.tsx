"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Users,
  FileText,
  Image,
  BookOpen,
  PenTool,
  Activity as ActivityIcon,
  ArrowUp,
  ArrowDown,
  Calendar,
  RefreshCw,
} from "lucide-react";
import CommonDashHeader from "@/app/components/common/CommonDashHeader";
import DashboardApi, {
  DashboardResult,
} from "@/app/services/modules/dashboard";

interface StatCard {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ElementType;
  color: string;
}

interface ActivityIconConfig {
  icon: React.ElementType;
  color: string;
}

const Overview: React.FC = () => {
  const [data, setData] = useState<DashboardResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await DashboardApi.get();
      setData(res);
    } catch (err) {
      console.error("Dashboard load failed:", err);
    } finally {
      setLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Stats configuration
  const stats = React.useMemo((): StatCard[] => {
    if (!data) return [];

    return [
      {
        label: "Subscribers",
        value: data.totals.totalUsers.toLocaleString(),
        change: "+12%",
        changeType: "positive",
        icon: Users,
        color: "bg-blue-50 text-blue-600 border-blue-100",
      },
      {
        label: "Pages",
        value: data.totals.publishedPages.toLocaleString(),
        change: "+3%",
        changeType: "positive",
        icon: FileText,
        color: "bg-green-50 text-green-600 border-green-100",
      },
      {
        label: "Media Library",
        value: data.totals.mediaItems.toLocaleString(),
        change: "+8%",
        changeType: "positive",
        icon: Image,
        color: "bg-purple-50 text-purple-600 border-purple-100",
      },
      {
        label: "Case Studies",
        value: data.totals.caseStudies.toLocaleString(),
        change: "+5%",
        changeType: "positive",
        icon: BookOpen,
        color: "bg-amber-50 text-amber-600 border-amber-100",
      },
      {
        label: "Blog Posts",
        value: data.totals.blogs.toLocaleString(),
        change: "+15%",
        changeType: "positive",
        icon: PenTool,
        color: "bg-indigo-50 text-indigo-600 border-indigo-100",
      },
    ];
  }, [data]);

  const getIconForType = useCallback((type: string): ActivityIconConfig => {
    const iconConfigs: Record<string, ActivityIconConfig> = {
      subscriber_joined: {
        icon: Users,
        color: "text-blue-600 bg-blue-50 border-blue-100",
      },
      page_published: {
        icon: FileText,
        color: "text-green-600 bg-green-50 border-green-100",
      },
      page_updated: {
        icon: FileText,
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      },
      media_uploaded: {
        icon: Image,
        color: "text-purple-600 bg-purple-50 border-purple-100",
      },
      story_published: {
        icon: ActivityIcon,
        color: "text-orange-600 bg-orange-50 border-orange-100",
      },
      case_study_published: {
        icon: BookOpen,
        color: "text-amber-600 bg-amber-50 border-amber-100",
      },
      blog_published: {
        icon: PenTool,
        color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      },
    };

    return (
      iconConfigs[type] || {
        icon: ActivityIcon,
        color: "text-gray-600 bg-gray-50 border-gray-100",
      }
    );
  }, []);

  const formatTimeAgo = useCallback((dateStr: string): string => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }, []);

  const getActivityDescription = useCallback((activity: any): string => {
    const descriptions: Record<string, string> = {
      subscriber_joined: `New subscriber: ${activity.title}`,
      page_published: `Published: ${activity.title}`,
      page_updated: `Updated: ${activity.title}`,
      media_uploaded: `Uploaded: ${activity.title}`,
      story_published: `Published story: ${activity.title}`,
      case_study_published: `Published case study: ${activity.title}`,
      blog_published: `Published blog: ${activity.title}`,
    };

    return descriptions[activity.type] || activity.title;
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="text-gray-500 text-lg font-medium">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // Error state
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <ActivityIcon className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Failed to load data
        </h3>
        <p className="text-gray-500 max-w-md">
          We couldn&apos;t load your dashboard data. Please check your
          connection and try again.
        </p>
        <button
          onClick={() => loadData()}
          className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CommonDashHeader
          title="Dashboard Overview"
          description="A comprehensive summary of your site's performance and recent activity."
        />
        <button
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats Grid */}
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group overflow-hidden"
          >
            {/* Gradient accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>

            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 mb-1 truncate">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 truncate">
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg border ${stat.color} flex-shrink-0 ml-3`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>

            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                stat.changeType === "positive"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stat.changeType === "positive" ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              {stat.change} from last month
            </div>
          </div>
        ))}
      </section>

      {/* Activity Section */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Activity
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Latest updates from your site
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              Last 30 days
            </div>
          </div>
        </div>

        <div className="p-6">
          {data.recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ActivityIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No activity yet
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Your recent activity will appear here once you start using the
                platform.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentActivity.map((activity, index) => {
                const { icon: Icon, color } = getIconForType(activity.type);
                return (
                  <div
                    key={`${activity.refId}-${index}`}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <div
                      className={`p-3 rounded-lg border ${color} flex-shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getActivityDescription(activity)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                        {formatTimeAgo(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Overview;
