"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  getStories,
  StoryItem,
  StoryQueryParams,
} from "@/app/services/modules/stories";
import {
  Loader2,
  Calendar,
  Clock,
  Search,
  BookOpen,
  ArrowRight,
  Tag,
  RefreshCw,
  Grid3X3,
  List,
  X,
} from "lucide-react";
import Link from "next/link";

// Constants
const PAGE_LIMIT = 6;
const DEBOUNCE_DELAY = 300;

// Types
interface PaginationState {
  page: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Utility Functions
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

const calculateReadingTime = (content: string) => {
  const words = content?.split(/\s+/).length || 0;
  return Math.ceil(words / 200);
};

const formatDate = (iso?: string): string =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

function StoriesShow({ data }: any) {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchStories = useCallback(
    async (page: number = 1, search: string = searchTerm) => {
      setLoading(true);
      setError(null);

      try {
        const params: StoryQueryParams = {
          page,
          limit: PAGE_LIMIT,
          search: search.trim() || undefined,
          status: "published",
        };

        if (featuredFilter !== "all") {
          params.featured = featuredFilter === "featured";
        }

        const res = await getStories(params);

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
    [searchTerm, featuredFilter]
  );

  // Debounced search
  const debouncedFetch = useMemo(
    () =>
      debounce((page: number, search: string) => {
        fetchStories(page, search);
      }, DEBOUNCE_DELAY),
    [fetchStories]
  );

  // Initial load and filter changes
  useEffect(() => {
    fetchStories(1);
  }, [featuredFilter]);

  // Search term changes with debouncing
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

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleFeaturedFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFeaturedFilter(e.target.value);
    },
    []
  );

  const handleRefresh = useCallback(() => {
    fetchStories(pagination.page);
  }, [fetchStories, pagination.page]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setFeaturedFilter("all");
  }, []);

  const hasActiveFilters = searchTerm || featuredFilter !== "all";

  const getGradientColor = (index: number) => {
    const gradients = [
      "from-primary-500/20 to-primary-600/20",
      "from-primary-400/20 to-primary-500/20",
      "from-primary-300/20 to-primary-400/20",
    ];
    return gradients[index % gradients.length];
  };

  const formatStoryExcerpt = (excerpt: string, maxLength: number = 120) => {
    if (!excerpt)
      return "Discover this captivating story and immerse yourself in a world of imagination...";
    return excerpt.length > maxLength
      ? excerpt.substring(0, maxLength) + "..."
      : excerpt;
  };

  // Loading Skeleton
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="aspect-4/3 bg-linear-to-br from-gray-100 to-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-100 rounded mb-3"></div>
        <div className="h-4 bg-gray-100 rounded mb-4 w-3/4"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-100 rounded w-16"></div>
          <div className="h-3 bg-gray-100 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonList = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-gray-100 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-100 rounded mb-3 w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded mb-2 w-full"></div>
          <div className="h-4 bg-gray-100 rounded mb-4 w-2/3"></div>
          <div className="flex gap-4">
            <div className="h-3 bg-gray-100 rounded w-16"></div>
            <div className="h-3 bg-gray-100 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-linear-to-b from-white via-gray-50/30 to-white py-8"
      id="content"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-xl outline-none transition-all duration-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              {/* View Toggle */}
              <div className="flex bg-white border border-gray-300 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-primary-100 text-primary-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-primary-100 text-primary-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Featured Filter */}
              <div className="relative">
                <select
                  value={featuredFilter}
                  onChange={handleFeaturedFilterChange}
                  className="appearance-none bg-white pl-4 pr-10 py-3 border border-gray-300 rounded-xl outline-none transition-all duration-200 cursor-pointer text-gray-700 hover:border-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 min-w-35"
                >
                  <option value="all">All Stories</option>
                  <option value="featured">Featured</option>
                  <option value="regular">Regular</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Bar */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between mt-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold">Active filters:</span>
                {searchTerm && (
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    Search: "{searchTerm}"
                  </span>
                )}
                {featuredFilter !== "all" && (
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    {featuredFilter === "featured"
                      ? "Featured Stories"
                      : "Regular Stories"}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium px-3 py-1 hover:bg-primary-100 rounded-lg"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
            <div className="text-red-600 mb-4 text-lg font-medium">{error}</div>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }
          >
            {[...Array(PAGE_LIMIT)].map((_, i) =>
              viewMode === "grid" ? (
                <SkeletonCard key={i} />
              ) : (
                <SkeletonList key={i} />
              )
            )}
          </div>
        ) : (
          <>
            {/* Results Header */}
            {stories.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <p className="text-gray-700">
                    Showing{" "}
                    <span className="font-bold text-gray-900">
                      {stories.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-gray-900">
                      {pagination.total}
                    </span>{" "}
                    stories
                  </p>
                  {loading && (
                    <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                  )}
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 text-sm font-medium rounded-lg hover:bg-gray-100 ${
                    loading ? "animate-spin opacity-60 cursor-wait" : ""
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            )}

            {stories.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
                      : "space-y-3 mb-12"
                  }
                >
                  {stories.map((story, index) => (
                    <Link
                      key={story._id}
                      href={`/case-studies/${story.slug || story._id}`}
                      className="group block bg-white rounded-xl border border-gray-200 transition-all duration-300 overflow-hidden hover:shadow-lg"
                    >
                      {viewMode === "grid" ? (
                        /* Grid View */
                        <>
                          <div className="aspect-4/3 relative overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
                            {story.image ? (
                              <>
                                <img
                                  src={story.image}
                                  alt={story.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
                              </>
                            ) : (
                              <div
                                className={`w-full h-full bg-linear-to-br ${getGradientColor(
                                  index
                                )} flex items-center justify-center`}
                              >
                                <BookOpen className="w-12 h-12 text-white/80" />
                              </div>
                            )}

                            {/* Featured Badge */}
                            {story.featured && (
                              <div className="absolute top-3 left-3 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                Featured
                              </div>
                            )}

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                                  <Clock className="w-3 h-3" />
                                  <span className="text-xs font-medium">
                                    {calculateReadingTime(story.body)} min
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                                  <Calendar className="w-3 h-3" />
                                  <span className="text-xs font-medium">
                                    {formatDate(story.publishedAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-6">
                            {/* Title */}
                            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                              {story.title}
                            </h3>

                            {/* Subtitle */}
                            {story.subtitle && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {story.subtitle}
                              </p>
                            )}

                            {/* Excerpt */}
                            <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                              {formatStoryExcerpt(story.excerpt, 100)}
                            </p>

                            {/* Tags */}
                            {story.tags && story.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {story.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                                  >
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        /* List View */
                        <div className="flex gap-4 p-6 hover:bg-gray-50 transition-all duration-300">
                          {/* Image Container */}
                          <div className="shrink-0 w-32 h-24 relative overflow-hidden rounded-lg bg-linear-to-br from-gray-100 to-gray-200">
                            {story.image ? (
                              <img
                                src={story.image}
                                alt={story.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className={`w-full h-full bg-linear-to-br ${getGradientColor(
                                  index
                                )} flex items-center justify-center`}
                              >
                                <BookOpen className="w-8 h-8 text-white/80" />
                              </div>
                            )}
                          </div>

                          {/* Content Container */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-primary-600 transition-colors duration-300 line-clamp-1">
                                  {story.title}
                                </h3>
                                {story.subtitle && (
                                  <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                                    {story.subtitle}
                                  </p>
                                )}
                              </div>
                              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors duration-300 shrink-0 ml-4" />
                            </div>

                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                              {formatStoryExcerpt(story.excerpt, 120)}
                            </p>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  {calculateReadingTime(story.body)} min read
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  {formatDate(story.publishedAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-200 pt-8">
                    <div className="text-sm text-gray-500">
                      Page {pagination.page} of {pagination.totalPages} •{" "}
                      {pagination.total} stories
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrev || loading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 font-medium ${
                          !pagination.hasPrev || loading
                            ? "opacity-50 cursor-not-allowed text-gray-400 border-gray-300"
                            : "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                        }`}
                      >
                        Previous
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, pagination.totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (pagination.totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.page <= 3) {
                              pageNum = i + 1;
                            } else if (
                              pagination.page >=
                              pagination.totalPages - 2
                            ) {
                              pageNum = pagination.totalPages - 4 + i;
                            } else {
                              pageNum = pagination.page - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                disabled={loading}
                                className={`min-w-10 px-3 py-2 rounded-lg border transition-all duration-200 font-medium ${
                                  pagination.page === pageNum
                                    ? "bg-primary-500 text-white border-transparent"
                                    : "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                } ${
                                  loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasNext || loading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 font-medium ${
                          !pagination.hasNext || loading
                            ? "opacity-50 cursor-not-allowed text-gray-400 border-gray-300"
                            : "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No stories found
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {hasActiveFilters
                    ? "No stories match your current filters. Try adjusting your search criteria."
                    : "No stories available yet."}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600 transition-all duration-300 font-medium"
                  >
                    <X className="w-5 h-5" />
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default StoriesShow;
