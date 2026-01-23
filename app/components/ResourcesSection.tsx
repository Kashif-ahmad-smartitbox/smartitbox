"use client";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Calendar, BookOpen, ArrowRight, Clock, Loader } from "lucide-react";
import { getBlogs, BlogItem, BlogQueryParams } from "@/services/modules/blog";
import { motion, useAnimation, type Variants } from "framer-motion";

// Animation constants
const SPRING_CONFIG = {
  stiffness: 300,
  damping: 25,
  mass: 0.5,
};

const CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const HEADER_VARIANTS: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

type Post = {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  tags?: string[];
  date?: string;
  readTime?: string;
  slug?: string;
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
});

interface PostCardProps {
  post: Post;
  index: number;
}

const PostCard = ({ post, index }: PostCardProps) => (
  <motion.article
    custom={index}
    variants={CARD_VARIANTS}
    whileHover={{ scale: 1.01 }}
    className="bg-white rounded-2xl overflow-hidden transition-all duration-300 group border border-gray-100 hover:border-primary-200 hover:shadow-xl cursor-pointer h-full flex flex-col"
  >
    {/* Image Container */}
    <div className="relative overflow-hidden h-56 shrink-0">
      {post.image ? (
        <motion.img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-primary-50 to-primary-100 flex items-center justify-center">
          <BookOpen className="w-14 h-14 text-primary-400" />
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {post.readTime && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm text-gray-700 shadow-sm border border-gray-200">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
      )}
    </div>

    {/* Content Container */}
    <div className="p-6 flex flex-col grow">
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-600 border border-primary-100"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3 line-clamp-2">
        {post.title}
      </h3>

      <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3 grow">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          {post.date && (
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 shrink-0" />
              {formatDate(post.date)}
            </span>
          )}
        </div>

        <motion.a
          href={post.slug}
          whileHover={{ x: 4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-primary-600 font-semibold text-sm bg-primary-50 hover:bg-primary-100 transition-all duration-300 border border-primary-100"
        >
          Read
          <ArrowRight className="w-4 h-4" />
        </motion.a>
      </div>
    </div>
  </motion.article>
);

const LoadingState = () => (
  <div className="py-32 bg-linear-to-b from-gray-50/30 via-white to-gray-50/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center">
        <Loader className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="ml-3 text-gray-600">Loading articles...</span>
      </div>
    </div>
  </div>
);

interface ResourcesProps {
  data: {
    sectionLabel: string;
    headingPart1: string;
    headingPart2: string;
    description: string;
    ctaButton: {
      text: string;
      href: string;
    };
    filterLabel: string;
    searchPlaceholder: string;
  };
}

export default function Resources({ data }: ResourcesProps) {
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
        limit: 6, // Only fetch 6 posts
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

  const handleViewAllClick = () => {
    console.log("View all articles clicked");
    // Add navigation logic here
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="py-32 bg-linear-to-b from-gray-50/30 via-white to-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-red-900 mb-2">
              Unable to load articles
            </h3>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={() => fetchBlogs()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative py-5 lg:py-10 bg-linear-to-l from-gray-200 to-gray-200 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <motion.div
          variants={HEADER_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16 lg:mb-20 pt-8"
        >
          {/* Section Label Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-linear-to-l from-rose-200 via-primary-50 to-rose-200 text-secondary-900 text-sm font-semibold rounded-lg border border-primary-200/50"
          >
            <span>{data.sectionLabel}</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6"
          >
            {data.headingPart1}{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
                {data.headingPart2}
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: 0.8,
                  duration: 0.8,
                  ease: "easeOut",
                }}
                className="absolute bottom-1 left-0 right-0 h-3 bg-primary-100/50 z-0 rounded-lg"
              />
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4"
          >
            {data.description}
          </motion.p>
        </motion.div>

        {/* CARDS SECTION */}
        {posts.length > 0 ? (
          <motion.div
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-4"
          >
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 lg:py-20"
          >
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No articles published yet
            </h3>
            <p className="text-gray-600">Check back later for new content</p>
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 lg:mt-16"
        >
          <motion.a
            href={data.ctaButton.href}
            onClick={handleViewAllClick}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px -5px rgba(59, 130, 246, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: SPRING_CONFIG.stiffness,
              damping: SPRING_CONFIG.damping,
              mass: SPRING_CONFIG.mass,
            }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-linear-to-r from-primary-500 to-orange-500 text-white text-base font-semibold hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl"
          >
            <span>{data.ctaButton.text}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
