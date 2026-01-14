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
  Star,
  ArrowRight,
  Tag,
  RefreshCw,
  Grid3X3,
  List,
  X,
  StarIcon,
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

      console.log("data", data);

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
      "from-primary-500/20 to-cyan-500/20",
      "from-purple-500/20 to-pink-500/20",
      "from-emerald-500/20 to-teal-500/20",
      "from-amber-500/20 to-orange-500/20",
      "from-violet-500/20 to-purple-500/20",
      "from-rose-500/20 to-pink-500/20",
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

  // Stats for header
  const stats = useMemo(() => {
    const featuredCount = stories.filter((story) => story.featured).length;
    const totalStories = pagination.total;

    return {
      featuredCount,
      totalStories,
      readingTime: stories.reduce(
        (total, story) => total + calculateReadingTime(story.body),
        0
      ),
    };
  }, [stories, pagination.total]);

  // Loading Skeleton
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden animate-pulse shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonList = () => (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-6 animate-pulse shadow-lg">
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
          <div className="flex gap-4">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/10 to-purple-50/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stories by title, tags, or content..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border border-gray-300/80 rounded-2xl outline-none transition-all duration-300"
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
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* View Toggle */}
              <div className="flex bg-white/80 backdrop-blur-sm border border-gray-300/80 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-primary-500 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-primary-500 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
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
                  className="appearance-none bg-white/80 backdrop-blur-sm pl-4 pr-10 py-3 border border-gray-300/80 rounded-2xl outline-none transition-all duration-200 cursor-pointer text-gray-700 hover:border-gray-400 min-w-[160px]"
                >
                  <option value="all">All Stories</option>
                  <option value="featured">Featured</option>
                  <option value="regular">Regular Stories</option>
                </select>
                <Star className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filters Bar */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold">Active filters:</span>
                {searchTerm && (
                  <span className="bg-primary-100 text-primary-700 px-3 py-2 rounded-full text-sm font-medium">
                    Search: &quot;{searchTerm}&quot;
                  </span>
                )}
                {featuredFilter !== "all" && (
                  <span className="bg-amber-100 text-amber-700 px-3 py-2 rounded-full text-sm font-medium">
                    {featuredFilter === "featured"
                      ? "Featured Stories"
                      : "Regular Stories"}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium px-4 py-2 hover:bg-gray-100 rounded-xl"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center mb-8 shadow-lg">
            <div className="text-red-600 mb-4 text-lg font-medium">{error}</div>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-2xl hover:bg-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
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
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <p className="text-gray-700 text-lg">
                    Showing{" "}
                    <span className="font-bold text-gray-900">
                      {stories.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-gray-900">
                      {pagination.total}
                    </span>{" "}
                    published stories
                  </p>
                  {loading && (
                    <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                  )}
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className={`flex items-center gap-3 px-5 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 text-sm font-semibold rounded-2xl hover:bg-white/80 hover:shadow-md ${
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
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                      : "space-y-6 mb-12"
                  }
                >
                  {stories.map((story, index) => (
                    <Link
                      key={story._id}
                      href={`/case-studies/${story.slug || story._id}`}
                      className={`group block bg-white rounded-3xl border border-gray-200/80 transition-all duration-500 overflow-hidden hover:-translate-y-1`}
                    >
                      {viewMode === "grid" ? (
                        /* Grid View - Enhanced Design */
                        <>
                          <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                            {story.image ? (
                              <>
                                <img
                                  src={story.image}
                                  alt={story.title}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                              </>
                            ) : (
                              <div
                                className={`w-full h-full bg-gradient-to-br ${getGradientColor(
                                  index
                                )} flex items-center justify-center`}
                              >
                                <BookOpen className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                              </div>
                            )}

                            {/* Featured Badge */}
                            {story.featured && (
                              <div className="absolute top-4 left-4 bg-gradient-to-r from-primary-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl backdrop-blur-sm border border-amber-300/30">
                                Featured
                              </div>
                            )}

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3 text-white/90">
                                  <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                      {calculateReadingTime(story.body)} min
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                      {formatDate(story.publishedAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Hover Action */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
                              <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                <ArrowRight className="w-6 h-6 text-gray-800" />
                              </div>
                            </div>
                          </div>

                          <div className="p-7">
                            {/* Title & Subtitle Container */}
                            <div className="mb-4">
                              <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                                {story.title}
                              </h3>
                              {story.subtitle && (
                                <p className="text-gray-600 text-base line-clamp-2 leading-relaxed font-medium">
                                  {story.subtitle}
                                </p>
                              )}
                            </div>

                            {/* Excerpt */}
                            <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                              {formatStoryExcerpt(story.excerpt)}
                            </p>

                            {/* Tags */}
                            {story.tags && story.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {story.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl text-sm font-medium border border-gray-200/60 hover:from-primary-50 hover:to-primary-100 hover:border-primary-200 hover:text-primary-700 transition-all duration-200 group/tag"
                                  >
                                    <Tag className="w-3.5 h-3.5 mr-2" />
                                    {tag}
                                  </span>
                                ))}
                                {story.tags.length > 3 && (
                                  <span className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium border border-gray-200/60">
                                    +{story.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        /* List View - Enhanced Design */
                        <div className="flex gap-6 p-8 hover:bg-gray-50/50 transition-all duration-300">
                          {/* Image Container */}
                          <div className="flex-shrink-0 w-40 h-28 relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:shadow-lg transition-shadow duration-300">
                            {story.image ? (
                              <img
                                src={story.image}
                                alt={story.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div
                                className={`w-full h-full bg-gradient-to-br ${getGradientColor(
                                  index
                                )} flex items-center justify-center`}
                              >
                                <BookOpen className="w-10 h-10 text-white/80" />
                              </div>
                            )}

                            {/* Featured Badge for List */}
                            {story.featured && (
                              <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
                                ⭐
                              </div>
                            )}
                          </div>

                          {/* Content Container */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                                  {story.title}
                                </h3>

                                {story.subtitle && (
                                  <p className="text-gray-600 font-semibold mb-3 line-clamp-1 text-base">
                                    {story.subtitle}
                                  </p>
                                )}
                              </div>
                              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-primary-500 transition-colors duration-300 flex-shrink-0 ml-6 mt-1 transform group-hover:translate-x-1" />
                            </div>

                            <p className="text-gray-500 text-base mb-6 line-clamp-2 leading-relaxed">
                              {formatStoryExcerpt(story.excerpt, 120)}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-5">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Clock className="w-5 h-5" />
                                  <span className="font-semibold text-sm">
                                    {calculateReadingTime(story.body)} min read
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar className="w-5 h-5" />
                                  <span className="font-semibold text-sm">
                                    {formatDate(story.publishedAt)}
                                  </span>
                                </div>
                              </div>

                              {story.tags && story.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {story.tags.slice(0, 2).map((tag) => (
                                    <span
                                      key={tag}
                                      className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200/60"
                                    >
                                      <Tag className="w-3.5 h-3.5 mr-1.5" />
                                      {tag}
                                    </span>
                                  ))}
                                  {story.tags.length > 2 && (
                                    <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium border border-gray-200/60">
                                      +{story.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-200/50 pt-8">
                    <div className="text-sm text-gray-500">
                      Page {pagination.page} of {pagination.totalPages} •{" "}
                      {pagination.total} published stories
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrev || loading}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-200 font-semibold ${
                          !pagination.hasPrev || loading
                            ? "opacity-50 cursor-not-allowed text-gray-400 border-gray-300"
                            : "text-gray-700 border-gray-300 hover:bg-white hover:border-gray-400 hover:shadow-md"
                        }`}
                      >
                        Previous
                      </button>

                      <div className="flex items-center gap-2">
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
                                className={`min-w-[3rem] px-4 py-3 rounded-xl border transition-all duration-200 font-semibold ${
                                  pagination.page === pageNum
                                    ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white border-transparent shadow-lg"
                                    : "text-gray-700 border-gray-300 hover:bg-white hover:border-gray-400 hover:shadow-md"
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
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-200 font-semibold ${
                          !pagination.hasNext || loading
                            ? "opacity-50 cursor-not-allowed text-gray-400 border-gray-300"
                            : "text-gray-700 border-gray-300 hover:bg-white hover:border-gray-400 hover:shadow-md"
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
              <div className="text-center py-20">
                <div className="w-40 h-40 bg-gradient-to-br from-primary-100/50 to-purple-100/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-200/60">
                  <BookOpen className="w-20 h-20 text-gray-400" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-4">
                  No stories found
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto text-xl leading-relaxed">
                  {hasActiveFilters
                    ? "No published stories match your current filters. Try adjusting your search criteria."
                    : "No published stories available yet. Check back soon for amazing content!"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-300 text-white px-10 py-5 rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold shadow-lg hover:scale-105 text-lg"
                  >
                    <X className="w-6 h-6" />
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
