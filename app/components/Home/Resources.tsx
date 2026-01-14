"use client";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  Search,
  Tag,
  Calendar,
  BookOpen,
  ArrowRight,
  Clock,
  User,
  Loader,
} from "lucide-react";
import { getBlogs, BlogItem, BlogQueryParams } from "@/services/modules/blog";
import Newsletter from "../common/Newsletter";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  tags?: string[];
  date?: string;
  readTime?: string;
  slug?: string;
  featured?: boolean;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatReadingTime = (minutes: number): string => {
  return `${minutes} min`;
};

const blogToPost = (blog: BlogItem): Post => ({
  id: blog._id,
  title: blog.title,
  excerpt: blog.excerpt || "",
  image: blog.cover,
  tags: blog.tags || [],
  date: blog.publishedAt || blog.createdAt,
  readTime: formatReadingTime(blog.readingTime),
  slug: `/blog/${blog.slug}`,
  featured: blog.featured,
});

const FeaturedArticle = ({ post }: { post: Post }) => (
  <article className="lg:col-span-2 group cursor-pointer">
    <div className="relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 ease-out">
      {/* Image Container */}
      <div className="relative h-96 lg:h-120 overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-primary-500/10 to-primary-600/20 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="w-20 h-20 text-primary-400 mx-auto mb-4" />
              <p className="text-primary-600 font-medium">Featured Article</p>
            </div>
          </div>
        )}

        {/* Strong Gradient Overlay - Ensures text is always readable */}
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/20 pointer-events-none z-1" />

        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-6 right-6 z-20">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-lg backdrop-blur-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Featured Story
            </span>
          </div>
        )}

        {/* Content Container - High z-index to stay above gradient */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 z-20">
          <div className="space-y-3 sm:space-y-4 max-w-3xl">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-white text-xs sm:text-sm">
              {post.date && (
                <span className="flex items-center gap-1.5 sm:gap-2 bg-white/25 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-full border border-white/20">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-white" />
                  <span className="text-white">{formatDate(post.date)}</span>
                </span>
              )}
              {post.readTime && (
                <span className="flex items-center gap-1.5 sm:gap-2 bg-white/25 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-full border border-white/20">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-white" />
                  <span className="text-white">{post.readTime}</span>
                </span>
              )}
            </div>

            {/* Title - Force white color */}
            <h3 className="text-white! text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight tracking-tight drop-shadow-lg">
              {post.title}
            </h3>

            {/* Excerpt - Force white color with !important equivalent */}
            <p
              className="text-white! text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl line-clamp-2 sm:line-clamp-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md"
              style={{ color: "#ffffff" }}
            >
              {post.excerpt}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-white/25 backdrop-blur-md text-white! border border-white/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-2 sm:pt-4">
              <a
                href={post.slug}
                className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white text-gray-900 text-sm sm:text-base font-semibold hover:bg-primary-50 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl group/btn"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
);

const PostCard = ({ post }: { post: Post }) => (
  <article className="bg-white rounded-2xl overflow-hidden transition-all duration-300 group border border-gray-100 hover:border-primary-200 hover:shadow-xl cursor-pointer h-full flex flex-col">
    {/* Image Container */}
    <div className="relative overflow-hidden h-56 shrink-0">
      {post.image ? (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-primary-50 to-primary-100 flex items-center justify-center">
          <BookOpen className="w-14 h-14 text-primary-400" />
        </div>
      )}
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Read time badge */}
      {post.readTime && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm text-gray-700 shadow-sm">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
      )}
    </div>

    {/* Content Container - Flex grow to push footer down */}
    <div className="p-5 sm:p-6 flex flex-col grow">
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-block px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-600 border border-primary-100 hover:bg-primary-100 transition-colors duration-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="text-sm text-gray-600 mb-4 sm:mb-6 leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors duration-300 grow">
        {post.excerpt}
      </p>

      {/* Footer with Meta Info and CTA - FIXED: Better alignment and spacing */}
      <div className="flex items-center justify-between pt-4 sm:pt-5 border-t border-gray-100 mt-auto gap-2">
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 min-w-0 flex-1">
          {post.date && (
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{formatDate(post.date)}</span>
              <span className="sm:hidden">
                {formatDate(post.date).split(",")[0]}
              </span>
            </span>
          )}
        </div>

        {/* CTA Button */}
        <a
          href={post.slug}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-primary-600 font-semibold text-sm bg-primary-50 hover:bg-primary-100 hover:gap-3 transition-all duration-300 group/btn shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          Read
          <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform duration-300" />
        </a>
      </div>
    </div>
  </article>
);

const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-gray-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200 transition-all">
    <label htmlFor="rs-search" className="sr-only">
      Search resources
    </label>
    <div className="flex items-center gap-3">
      <Search className="w-5 h-5 text-gray-400 shrink-0" />
      <input
        id="rs-search"
        placeholder="Search articles..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm outline-none placeholder:text-gray-400"
      />
    </div>
  </div>
);

const TagFilter = ({
  tags,
  activeTag,
  onTagChange,
}: {
  tags: string[];
  activeTag: string;
  onTagChange: (tag: string) => void;
}) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <Tag className="w-4 h-4 text-primary-600" />
        Filter by Topic
      </h3>
    </div>

    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <button
          key={t}
          onClick={() => onTagChange(t)}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
            activeTag === t
              ? "bg-primary-600 text-white shadow-md scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  </div>
);

const LoadingState = () => (
  <div className="py-20 bg-linear-to-b from-gray-50 to-white">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="flex items-center justify-center">
        <Loader className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading articles...</span>
      </div>
    </div>
  </div>
);

const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="py-20 bg-linear-to-b from-gray-50 to-white">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-red-900 mb-2">
          Unable to load articles
        </h3>
        <p className="text-red-700 mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
        >
          Try Again
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

export default function Resources(props: any) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [displayCount, setDisplayCount] = useState(6);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs from API
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: BlogQueryParams = {
        status: "published",
        sortBy: "publishedAt",
        sortOrder: "desc",
        limit: 50,
      };

      const response = await getBlogs(params);
      const blogPosts = response.items.map(blogToPost);
      setPosts(blogPosts);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err instanceof Error ? err.message : "Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const allTags = useMemo(() => {
    const tags = posts.flatMap((p) => p.tags || []);
    const uniqueTags = Array.from(new Set(tags)).filter(Boolean);
    return ["All", ...uniqueTags];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag =
        activeTag === "All" || (post.tags || []).includes(activeTag);
      const matchesSearch =
        !searchTerm ||
        `${post.title} ${post.excerpt} ${(post.tags || []).join(" ")}`
          .toLowerCase()
          .includes(searchTerm);
      return matchesTag && matchesSearch;
    });
  }, [posts, query, activeTag]);

  const featuredPost = useMemo(() => {
    return filteredPosts.find((p) => p.featured) || filteredPosts[0];
  }, [filteredPosts]);

  const regularPosts = useMemo(() => {
    const featuredId = featuredPost?.id;
    const postsWithoutFeatured = filteredPosts.filter(
      (post) => post.id !== featuredId
    );
    return postsWithoutFeatured.slice(0, displayCount - 1);
  }, [filteredPosts, featuredPost, displayCount]);

  const hasMorePosts = regularPosts.length < filteredPosts.length - 1;

  const handleLoadMore = useCallback(() => {
    setDisplayCount((prev) => prev + 3);
  }, []);

  const handleRetry = useCallback(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  return (
    <section
      className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-gray-50 to-white"
      aria-labelledby="resources-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 sm:mb-12 text-center">
          <p className="text-2xl sm:text-3xl font-semibold text-primary-600">
            {props.data?.subtitle || "Resources & Insights"}
          </p>
          <h2
            id="resources-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900"
          >
            {props.data?.title || "Latest from Our Blog"}
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {props.data?.description ||
              "Explore articles, tutorials, and insights to help you build better products"}
          </p>
        </header>

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {featuredPost && <FeaturedArticle post={featuredPost} />}

              <aside className="space-y-4 sm:space-y-6">
                <SearchBar value={query} onChange={setQuery} />
                <TagFilter
                  tags={allTags}
                  activeTag={activeTag}
                  onTagChange={setActiveTag}
                />
                <Newsletter />
              </aside>
            </div>

            {regularPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
                  {regularPosts.slice(0, 3).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {hasMorePosts && (
                  <div className="text-center">
                    <button
                      onClick={handleLoadMore}
                      className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gray-900 text-white text-sm sm:text-base font-semibold hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl"
                    >
                      Load More Articles
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No articles published yet
            </h3>
            <p className="text-gray-600">Check back later for new content</p>
          </div>
        )}
      </div>
    </section>
  );
}
