"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FileText,
  Plus,
  Edit3,
  Eye,
  Search,
  RefreshCw,
  Calendar,
  Link,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import {
  getStories,
  StoryItem,
  StoryQueryParams,
} from "@/app/services/modules/stories";
import CommonDashHeader from "@/app/components/common/CommonDashHeader";
import { useRouter } from "next/navigation";

// Constants
const PAGE_LIMIT = 10;
const DEBOUNCE_DELAY = 300;

// Types
interface FetchResult {
  items: StoryItem[];
  total: number;
  page: number;
  totalPages: number;
}

interface PaginationState {
  page: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Utility Functions
const formatDate = (iso?: string): string =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Components
const StatusBadge: React.FC<{ status: string }> = React.memo(({ status }) => {
  const isPublished = status === "published";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${
        isPublished
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-gray-50 text-gray-600 border-gray-200"
      }`}
      aria-live="polite"
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isPublished ? "bg-green-500" : "bg-gray-400"
        }`}
        aria-hidden
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
});
StatusBadge.displayName = "StatusBadge";

const FeaturedBadge: React.FC<{ featured: boolean }> = React.memo(
  ({ featured }) => {
    if (!featured) return null;

    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border bg-yellow-50 text-yellow-700 border-yellow-200"
        aria-label="Featured story"
      >
        <Star className="w-3 h-3" />
        Featured
      </span>
    );
  }
);
FeaturedBadge.displayName = "FeaturedBadge";

const SkeletonList: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-8">
    <div className="animate-pulse space-y-4">
      {[...Array(PAGE_LIMIT)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Pagination: React.FC<{
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  loading: boolean;
}> = ({ pagination, onPageChange, loading }) => {
  const { page, totalPages, hasNext, hasPrev } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="text-sm text-gray-500">
        Showing page {page} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev || loading}
          className={`p-2 rounded-lg border border-gray-300 transition-colors ${
            !hasPrev || loading
              ? "opacity-50 cursor-not-allowed text-gray-400"
              : "text-gray-600 hover:bg-gray-100 hover:border-gray-400"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show pages around current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                disabled={loading}
                className={`min-w-[2rem] px-2 py-1 text-sm rounded-lg transition-colors ${
                  page === pageNum
                    ? "bg-primary-600 text-white border border-primary-600"
                    : "text-gray-600 border border-gray-300 hover:bg-gray-100"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext || loading}
          className={`p-2 rounded-lg border border-gray-300 transition-colors ${
            !hasNext || loading
              ? "opacity-50 cursor-not-allowed text-gray-400"
              : "text-gray-600 hover:bg-gray-100 hover:border-gray-400"
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const StoryRow: React.FC<{
  story: StoryItem;
  onEdit: (id: string) => void;
  onView: (story: StoryItem) => void;
}> = React.memo(({ story, onEdit, onView }) => {
  const handleViewClick = useCallback(() => onView(story), [story, onView]);
  const handleEditClick = useCallback(
    () => onEdit(story._id),
    [story._id, onEdit]
  );

  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900 line-clamp-1">
              {story.title}
            </div>
            {story.subtitle && (
              <div className="text-sm text-gray-500 line-clamp-1">
                {story.subtitle}
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-1 text-gray-600">
          <Link className="w-3 h-3 flex-shrink-0" />
          <span className="line-clamp-1">{story.slug || story._id}</span>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <StatusBadge status={story.status} />
          <FeaturedBadge featured={story.featured} />
        </div>
      </td>

      <td className="px-6 py-4 text-gray-500 w-[200px]">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          {formatDate(story.updatedAt)}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title={`View ${story.title}`}
            aria-label={`View ${story.title}`}
            onClick={handleViewClick}
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={handleEditClick}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title={`Edit ${story.title}`}
            aria-label={`Edit ${story.title}`}
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
});
StoryRow.displayName = "StoryRow";

const EmptyState: React.FC<{
  hasStories: boolean;
  onCreateStory: () => void;
}> = ({ hasStories, onCreateStory }) => (
  <div className="text-center py-12">
    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {hasStories ? "No matching stories" : "No stories"}
    </h3>
    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
      {hasStories
        ? "Try adjusting your search or filter to find what you're looking for."
        : "Create your first story to start sharing content."}
    </p>
    <button
      onClick={onCreateStory}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 transition-colors"
    >
      <Plus className="w-4 h-4" />
      Create New Story
    </button>
  </div>
);

const Stories: React.FC = () => {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const router = useRouter();

  const fetchStories = useCallback(
    async (page: number = 1, search: string = searchTerm) => {
      setLoading(true);
      setError(null);

      try {
        const params: StoryQueryParams = {
          page,
          limit: PAGE_LIMIT,
          search: search.trim() || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
        };

        // Only add featured filter if it's not "all"
        if (featuredFilter !== "all") {
          params.featured = featuredFilter === "featured";
        }

        const res = await getStories(params);

        // Fix pagination calculations
        const currentPage = res.page || page;
        const totalItems = res.total || 0;
        const totalPages = Math.ceil(totalItems / PAGE_LIMIT);

        setStories(res.items || []);
        setPagination({
          page: currentPage,
          total: totalItems,
          totalPages: totalPages,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1,
        });
      } catch (err: any) {
        console.error("Failed to load stories:", err);
        setError(err?.message || "Failed to fetch stories. Please try again.");
        setStories([]);
        setPagination({
          page: 1,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        });
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, statusFilter, featuredFilter]
  );

  // Debounced search
  const debouncedFetch = useMemo(
    () =>
      debounce(
        (page: number, search: string) => fetchStories(page, search),
        DEBOUNCE_DELAY
      ),
    [fetchStories]
  );

  useEffect(() => {
    fetchStories(1);
  }, [statusFilter, featuredFilter, fetchStories]);

  useEffect(() => {
    debouncedFetch(1, searchTerm);
  }, [searchTerm, debouncedFetch]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= pagination.totalPages && !loading) {
        fetchStories(newPage);
      }
    },
    [pagination.totalPages, fetchStories, loading]
  );

  const handleRefresh = useCallback(() => {
    fetchStories(pagination.page);
  }, [fetchStories, pagination.page]);

  const handleEdit = useCallback(
    (id: string) => router.push(`/admin/case-studies/${id}/edit`),
    [router]
  );

  const handleView = useCallback((story: StoryItem) => {
    const publicPath = story.slug
      ? `/case-studies/${story.slug}`
      : `/case-studies/id/${story._id}`;

    window.open(publicPath, "_blank", "noopener,noreferrer");
  }, []);

  const handleCreateStory = useCallback(
    () => router.push("/admin/case-studies/new"),
    [router]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleStatusFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(e.target.value);
    },
    []
  );

  const handleFeaturedFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFeaturedFilter(e.target.value);
    },
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CommonDashHeader
          title="Case Studies Management"
          description="Create, edit and publish stories."
        />
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              loading ? "animate-spin opacity-60 cursor-wait" : ""
            }`}
            title="Refresh"
            aria-label="Refresh stories"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCreateStory}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Story</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search stories by title, subtitle, or slug..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none bg-white transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              aria-label="Search stories"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="appearance-none bg-white pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg outline-none transition-colors cursor-pointer text-sm font-medium text-gray-700 hover:border-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 min-w-[140px]"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <select
                value={featuredFilter}
                onChange={handleFeaturedFilterChange}
                className="appearance-none bg-white pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg outline-none transition-colors cursor-pointer text-sm font-medium text-gray-700 hover:border-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 min-w-[140px]"
                aria-label="Filter by featured"
              >
                <option value="all">All Stories</option>
                <option value="featured">Featured</option>
                <option value="regular">Regular</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 mb-2">{error}</div>
          <button
            onClick={handleRefresh}
            className="text-red-600 hover:text-red-700 text-sm font-medium underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stories Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!loading && stories.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {stories.length} of {pagination.total} stories
            </div>
          </div>
        )}

        {loading ? (
          <SkeletonList />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stories.map((story) => (
                    <StoryRow
                      key={story._id}
                      story={story}
                      onEdit={handleEdit}
                      onView={handleView}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {stories.length === 0 && !loading && (
              <EmptyState
                hasStories={pagination.total > 0}
                onCreateStory={handleCreateStory}
              />
            )}

            {/* Pagination */}
            {stories.length > 0 && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                loading={loading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Stories;
