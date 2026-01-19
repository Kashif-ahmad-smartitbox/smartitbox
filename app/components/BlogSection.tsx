"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getBlogs, BlogItem } from "@/services/modules/blog";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Search,
  Star,
  Eye,
  Tag,
  X,
  Sparkles,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const BLOGS_PER_PAGE = 9;
const FEATURED_BLOGS_PER_PAGE = 3;

// Types
interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface BlogsProps {
  data: {
    title: string;
    subtitle: string;
  };
}

// Utility Functions
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Main Component
function Blogs({ data }: BlogsProps) {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchPageData = useCallback(
    async (page: number = 1, search: string = "") => {
      try {
        setLoading(true);
        setError(null);

        const blogsResponse = await getBlogs({
          status: "published",
          sortBy: "publishedAt",
          sortOrder: "desc",
          page,
          limit: BLOGS_PER_PAGE,
          search: search.trim() || undefined,
        });

        setBlogs(blogsResponse.items || []);

        // Update pagination state
        const totalPages = Math.ceil(
          (blogsResponse.total || 0) / BLOGS_PER_PAGE,
        );
        setPagination({
          currentPage: page,
          totalPages,
          totalItems: blogsResponse.total || 0,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        });
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError(err instanceof Error ? err.message : "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchPageData(1, searchQuery);
  }, [fetchPageData, searchQuery]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= pagination.totalPages) {
        fetchPageData(newPage, searchQuery);
        // Scroll to top of blog section
        const blogSection = document.getElementById("blog-content-section");
        blogSection?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [pagination.totalPages, searchQuery, fetchPageData],
  );

  const clearSearch = () => setSearchQuery("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Derived state
  const featuredBlogs = blogs
    .filter((blog) => blog.featured)
    .slice(0, FEATURED_BLOGS_PER_PAGE);

  const displayBlogs = blogs;

  // Loading state
  if (loading && blogs.length === 0) {
    return <LoadingState />;
  }

  // Error state
  if (error && blogs.length === 0) {
    return (
      <ErrorState error={error} onRetry={() => fetchPageData(1, searchQuery)} />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section - Light background with black text */}
        <HeroSection
          data={data}
          searchQuery={searchQuery}
          isSearchFocused={isSearchFocused}
          totalItems={pagination.totalItems}
          onSearchChange={handleSearchChange}
          onSearchFocusChange={setIsSearchFocused}
          onClearSearch={clearSearch}
        />

        {/* Blog Content Section */}
        <BlogContentSection
          featuredBlogs={featuredBlogs}
          displayBlogs={displayBlogs}
          loading={loading}
          pagination={pagination}
          searchQuery={searchQuery}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}

// Sub-Components
const LoadingState: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-700 font-medium">Loading Insights...</p>
    </div>
  </div>
);

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-white">
    <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl border border-gray-200 shadow-lg">
      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Eye className="w-8 h-8 text-primary-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Failed to load blogs
      </h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-linear-to-r from-primary-500 to-primary-600 text-white hover:opacity-90 transition-all duration-300 rounded-xl font-medium shadow-lg hover:shadow-xl"
      >
        Try Again
      </button>
    </div>
  </div>
);

interface HeroSectionProps {
  data: BlogsProps["data"];
  searchQuery: string;
  isSearchFocused: boolean;
  totalItems: number;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchFocusChange: (focused: boolean) => void;
  onClearSearch: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  data,
  searchQuery,
  isSearchFocused,
  totalItems,
  onSearchChange,
  onSearchFocusChange,
  onClearSearch,
}) => (
  <section className="bg-linear-to-br from-gray-50 via-white to-gray-100 pt-32 pb-20 -mt-20 relative overflow-hidden">
    {/* Light background decorative elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/10 rounded-full blur-3xl" />
    </div>

    <div className="container mx-auto px-6 pt-24 relative z-10">
      <div className="text-center max-w-3xl mx-auto">
        <div className="mb-8">
          {/* Badge with primary color */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-700">
              Insights & Articles
            </span>
          </div>

          {/* Black text for visibility */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {data.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          isSearchFocused={isSearchFocused}
          totalItems={totalItems}
          onSearchChange={onSearchChange}
          onSearchFocusChange={onSearchFocusChange}
          onClearSearch={onClearSearch}
        />

        <BlogStats totalItems={totalItems} />
      </div>
    </div>
  </section>
);

interface SearchBarProps {
  searchQuery: string;
  isSearchFocused: boolean;
  totalItems: number;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchFocusChange: (focused: boolean) => void;
  onClearSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  isSearchFocused,
  totalItems,
  onSearchChange,
  onSearchFocusChange,
  onClearSearch,
}) => (
  <div className="max-w-2xl mx-auto mb-12">
    <div className="relative group">
      <div
        className={`relative transition-all duration-500 ${
          isSearchFocused ? "scale-105" : "scale-100"
        }`}
      >
        <div className="absolute -inset-4 bg-linear-to-r from-primary-100 to-primary-200 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>

        <div
          className={`relative bg-white border transition-all duration-300 rounded-2xl overflow-hidden shadow-lg ${
            isSearchFocused
              ? "border-primary-400 shadow-primary-500/20 ring-2 ring-primary-100"
              : "border-gray-200 group-hover:border-gray-300 group-hover:shadow-xl"
          }`}
        >
          <div className="flex items-center">
            <div className="pl-6 pr-4 py-5">
              <div
                className={`transition-all duration-300 ${
                  isSearchFocused
                    ? "scale-110 text-primary-500"
                    : "text-gray-400"
                }`}
              >
                <Search className="w-6 h-6" />
              </div>
            </div>

            <input
              type="text"
              placeholder="Search articles, topics, or insights..."
              value={searchQuery}
              onChange={onSearchChange}
              onFocus={() => onSearchFocusChange(true)}
              onBlur={() => onSearchFocusChange(false)}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-lg py-5 pr-4 w-full"
            />

            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group/clear mr-4"
              >
                <X className="w-4 h-4 text-gray-400 group-hover/clear:text-gray-600 transition-colors" />
              </button>
            )}
          </div>

          {isSearchFocused && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary-500 to-primary-600"></div>
          )}
        </div>
      </div>

      <SearchInfo
        searchQuery={searchQuery}
        isSearchFocused={isSearchFocused}
        totalItems={totalItems}
      />
    </div>
  </div>
);

interface SearchInfoProps {
  searchQuery: string;
  isSearchFocused: boolean;
  totalItems: number;
}

const SearchInfo: React.FC<SearchInfoProps> = ({
  searchQuery,
  isSearchFocused,
  totalItems,
}) => (
  <div
    className={`mt-4 text-center transition-all duration-300 ${
      searchQuery || isSearchFocused
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-2"
    }`}
  >
    <div className="inline-flex items-center gap-3 text-sm text-gray-600 bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
      <Sparkles className="w-4 h-4 text-primary-500" />
      <span>
        {searchQuery
          ? `Found ${totalItems} ${totalItems === 1 ? "article" : "articles"}`
          : "Type to search our knowledge base"}
      </span>
    </div>
  </div>
);

interface BlogStatsProps {
  totalItems: number;
}

const BlogStats: React.FC<BlogStatsProps> = ({ totalItems }) => (
  <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
    <span className="flex items-center gap-2">
      <BookOpen className="w-5 h-5 text-primary-600" />
      <span className="font-semibold text-gray-900">{totalItems}</span>
      {totalItems === 1 ? " Article" : " Articles"}
    </span>
    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
    <span>Expert Insights</span>
    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
    <span>Regular Updates</span>
  </div>
);

interface BlogContentSectionProps {
  featuredBlogs: BlogItem[];
  displayBlogs: BlogItem[];
  loading: boolean;
  pagination: PaginationState;
  searchQuery: string;
  onPageChange: (page: number) => void;
}

const BlogContentSection: React.FC<BlogContentSectionProps> = ({
  featuredBlogs,
  displayBlogs,
  loading,
  pagination,
  searchQuery,
  onPageChange,
}) => (
  <section
    id="blog-content-section"
    className="py-16 relative bg-linear-to-b from-white to-gray-50"
  >
    <div className="container mx-auto px-6">
      {featuredBlogs.length > 0 && (
        <FeaturedBlogsSection featuredBlogs={featuredBlogs} />
      )}

      <AllBlogsSection
        displayBlogs={displayBlogs}
        loading={loading}
        pagination={pagination}
        searchQuery={searchQuery}
        onPageChange={onPageChange}
        hasFeaturedBlogs={featuredBlogs.length > 0}
      />
    </div>
  </section>
);

interface FeaturedBlogsSectionProps {
  featuredBlogs: BlogItem[];
}

const FeaturedBlogsSection: React.FC<FeaturedBlogsSectionProps> = ({
  featuredBlogs,
}) => (
  <div className="mb-16">
    <SectionHeader
      icon={Star}
      title="Featured Insights"
      description="Handpicked articles showcasing our most valuable content and expert analysis"
    />

    <div className="grid grid-cols-1 gap-8">
      {featuredBlogs.map((blog, index) => (
        <FeaturedBlogCard key={blog._id} blog={blog} isFirst={index === 0} />
      ))}
    </div>
  </div>
);

interface AllBlogsSectionProps {
  displayBlogs: BlogItem[];
  loading: boolean;
  pagination: PaginationState;
  searchQuery: string;
  onPageChange: (page: number) => void;
  hasFeaturedBlogs: boolean;
}

const AllBlogsSection: React.FC<AllBlogsSectionProps> = ({
  displayBlogs,
  loading,
  pagination,
  searchQuery,
  onPageChange,
  hasFeaturedBlogs,
}) => (
  <div>
    <SectionHeader
      title={hasFeaturedBlogs ? "All Articles" : "Latest Articles"}
      description="Browse our complete collection of insights and analysis"
    />

    {displayBlogs.length === 0 && !loading ? (
      <EmptyState searchQuery={searchQuery} />
    ) : (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {displayBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>

        {pagination.totalPages > 1 && (
          <Pagination
            pagination={pagination}
            onPageChange={onPageChange}
            loading={loading}
          />
        )}
      </>
    )}
  </div>
);

interface SectionHeaderProps {
  icon?: React.ComponentType<any>;
  title: string;
  description: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="text-center mb-12">
    {Icon && (
      <div className="inline-flex items-center gap-4 mb-4">
        <div className="w-16 h-px bg-gray-300"></div>
        <Icon className="w-5 h-5 text-primary-600" />
        <div className="w-16 h-px bg-gray-300"></div>
      </div>
    )}
    {!Icon && <div className="w-20 h-px bg-gray-300 mx-auto mb-4"></div>}

    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
      {title}
    </h2>
    <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
  </div>
);

interface EmptyStateProps {
  searchQuery: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery }) => (
  <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-lg">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-300">
      <BookOpen className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-3">
      {searchQuery ? "No matching posts found" : "Content Coming Soon"}
    </h3>
    <p className="text-gray-600 max-w-sm mx-auto">
      {searchQuery
        ? "Try adjusting your search terms or browse all articles"
        : "We're crafting valuable insights for you. Stay tuned!"}
    </p>
  </div>
);

const Pagination: React.FC<{
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  loading: boolean;
}> = ({ pagination, onPageChange, loading }) => {
  const { currentPage, totalPages, totalItems, hasNext, hasPrev } = pagination;

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-gray-200">
      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {(currentPage - 1) * BLOGS_PER_PAGE + 1} to{" "}
        {Math.min(currentPage * BLOGS_PER_PAGE, totalItems)} of {totalItems}{" "}
        articles
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev || loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
            !hasPrev || loading
              ? "opacity-50 cursor-not-allowed text-gray-400 border-gray-300"
              : "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) =>
            page === "..." ? (
              <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                disabled={loading}
                className={`min-w-10 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {page}
              </button>
            ),
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext || loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
            !hasNext || loading
              ? "opacity-50 cursor-not-allowed text-gray-400 border-gray-300"
              : "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const FeaturedBlogCard = ({
  blog,
  isFirst = false,
}: {
  blog: BlogItem;
  isFirst?: boolean;
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/blog/${blog.slug}`} className="block">
      <article className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-700 transform hover:-translate-y-2 border border-gray-200 shadow-lg hover:shadow-xl">
        <div className="flex flex-col lg:flex-row h-full">
          <div className="lg:w-[45%] relative shrink-0">
            <div className="aspect-4/3 lg:aspect-auto lg:h-full relative bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
              {blog.cover && !imageError ? (
                <Image
                  src={blog.cover}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority={isFirst}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen
                    className="w-20 h-20 text-gray-400"
                    strokeWidth={1.5}
                  />
                </div>
              )}

              {/* Featured Badge */}
              <div className="absolute top-6 left-6 z-10">
                <div className="relative">
                  <span className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-linear-to-r from-primary-500 to-primary-600 text-white font-bold text-sm shadow-2xl border-2 border-white/30">
                    <Star className="w-4 h-4 fill-white" strokeWidth={2} />
                    Featured
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-6 right-6 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                <button
                  onClick={(e) => e.preventDefault()}
                  className="p-2.5 rounded-full bg-white/95 backdrop-blur-md hover:bg-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 border border-white/50"
                >
                  <Share2 className="w-5 h-5 text-gray-700" strokeWidth={2} />
                </button>
              </div>

              {/* Reading Time Badge */}
              <div className="absolute bottom-6 right-6 z-10">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md text-white text-sm font-semibold shadow-xl border border-white/20">
                  <Clock className="w-4 h-4" strokeWidth={2.5} />
                  {blog.readingTime} min read
                </div>
              </div>
            </div>
          </div>

          {/* Content Container */}
          <div className="lg:w-[55%] p-8 lg:p-10 flex flex-col relative">
            <div className="flex flex-wrap gap-2 mb-5">
              {blog.tags?.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200 hover:border-primary-300 hover:shadow-md transition-all duration-300"
                >
                  <Tag className="w-3 h-3" strokeWidth={2.5} />
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5 leading-tight group-hover:text-primary-600 transition-colors duration-500">
              {blog.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed line-clamp-3 mb-6 flex-1">
              {blog.excerpt || blog.metaDescription}
            </p>

            {/* Stats Bar */}
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <Calendar
                    className="w-4 h-4 text-primary-600"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">
                    Published
                  </span>
                  <time className="text-sm font-semibold text-gray-700">
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </time>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-gray-500 font-medium">
                  Trending Now
                </span>
              </div>

              <span className="group/btn relative inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 text-white font-bold shadow-lg hover:shadow-xl hover:shadow-primary-500/50 transition-all duration-300 overflow-hidden hover:scale-105">
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></span>
                <span className="relative">Read Full Article</span>
                <ArrowRight
                  className="relative w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300"
                  strokeWidth={2.5}
                />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

const BlogCard = ({ blog }: { blog: BlogItem }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/blog/${blog.slug}`} className="block h-full">
      <article className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-1 h-full flex flex-col border border-gray-200">
        {/* Image Container */}
        <div className="relative aspect-16/10 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 shrink-0">
          {blog.cover && !imageError ? (
            <Image
              src={blog.cover}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
            </div>
          )}

          {/* Reading Time Badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-gray-800 text-xs font-semibold shadow-lg border border-white/50">
              <Clock
                className="w-3.5 h-3.5 text-primary-600"
                strokeWidth={2.5}
              />
              {blog.readingTime} min read
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 left-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
            <button
              onClick={(e) => e.preventDefault()}
              className="p-2 rounded-full bg-white/95 backdrop-blur-md hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 border border-white/50"
            >
              <Share2 className="w-4 h-4 text-gray-700" strokeWidth={2} />
            </button>
          </div>

          {/* Category Badge */}
          {blog.tags && blog.tags[0] && (
            <div className="absolute bottom-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-600 text-white text-xs font-bold shadow-lg backdrop-blur-sm border border-white/30">
                <Tag className="w-3 h-3" strokeWidth={2.5} />
                {blog.tags[0]}
              </span>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Secondary Tags */}
          {blog.tags && blog.tags.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {blog.tags.slice(1, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-100 transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors duration-300 shrink-0">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
            {blog.excerpt || blog.metaDescription}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto shrink-0">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
              <time>
                {blog.publishedAt
                  ? formatDate(blog.publishedAt)
                  : formatDate(blog.createdAt)}
              </time>
            </div>

            <div className="flex items-center gap-1.5 text-primary-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300">
              Read more
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default Blogs;
