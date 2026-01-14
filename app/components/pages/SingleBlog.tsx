"use client";

import React, { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { getBlogBySlug } from "@/app/services/modules/blog";
import { Loader2, Calendar, Clock, ArrowLeft, Share2, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function SingleBlog() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await getBlogBySlug(slug as string);
        setBlog(response.blog);
      } catch (err: any) {
        console.error("Failed to fetch blog:", err);
        setError("Unable to load this blog. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleShare = async () => {
    if (!blog) return;

    const shareData = {
      title: blog.title,
      text: blog.excerpt,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.log("Error sharing:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        console.log("URL copied to clipboard");
      } catch (err) {
        console.log("Failed to copy URL:", err);
      }
    }
  };

  const calculateReadingTime = (content: string) => {
    const words = content?.split(/\s+/).length || 0;
    return Math.ceil(words / 200);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
          </div>
          <p className="text-gray-600 font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return notFound();
  }

  const readingTime = blog.readingTime || calculateReadingTime(blog.body);
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Enhanced Header */}
      <header className="border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Back button - hidden on mobile */}
            <Link
              href="/blogs"
              className="hidden md:inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Articles
            </Link>

            {/* Centered Logo */}
            <Link href="/" className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="Smart ITBox"
                  width={100}
                  height={20}
                  className="h-6 w-auto"
                />
              </div>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <article className="max-w-3xl mx-auto py-8 md:py-12 px-4 sm:px-6">
          {/* Enhanced Article Header */}
          <header className="text-center mb-12 md:mb-16">
            {/* Category */}
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm font-medium mb-4 md:mb-6 uppercase tracking-wider">
              <Tag className="w-4 h-4" />
              Article
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4 md:mb-6 leading-tight tracking-tight">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-6 md:mb-8 font-light px-4">
              {blog.excerpt}
            </p>

            {/* Enhanced Meta Information */}
            <div className="flex items-center justify-center gap-4 md:gap-6 text-gray-500 text-sm mb-6 md:mb-8 flex-wrap">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                <Calendar className="w-4 h-4" />
                <time>
                  {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>

            {/* Enhanced Divider */}
            <div className="w-24 md:w-32 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
          </header>

          {/* Enhanced Cover Image */}
          {blog.cover && (
            <div className="relative w-full mb-8 md:mb-12 rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
              <div className="aspect-video w-full relative">
                <img
                  src={blog.cover}
                  alt={blog.title}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    imageLoaded
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Article Content */}
          <div
            className="prose prose-base sm:prose-lg max-w-none 
                        prose-headings:font-normal prose-headings:text-gray-900 prose-headings:tracking-tight
                        prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mt-12 sm:prose-h1:mt-16 prose-h1:mb-6 sm:prose-h1:mb-8 prose-h1:pt-6 sm:prose-h1:pt-8 prose-h1:border-t prose-h1:border-gray-200
                        prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-10 sm:prose-h2:mt-14 prose-h2:mb-4 sm:prose-h2:mb-6 prose-h2:pb-2 
                        prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-8 sm:prose-h3:mt-12 prose-h3:mb-3 sm:prose-h3:mb-4
                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-5 sm:prose-p:my-7 prose-p:text-[16px] sm:prose-p:text-[17px]
                        prose-a:text-gray-900 prose-a:no-underline prose-a:bg-gradient-to-r prose-a:from-gray-200 prose-a:to-gray-200 
                        prose-a:bg-[length:100%_2px] prose-a:bg-[0%_90%] prose-a:bg-no-repeat hover:prose-a:bg-[length:100%_100%] 
                        prose-a:transition-all prose-a:duration-300 prose-a:px-1 prose-a:py-0.5 prose-a:rounded
                        prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:bg-gray-50 
                        prose-blockquote:px-4 sm:prose-blockquote:px-6 prose-blockquote:py-3 sm:prose-blockquote:py-4 prose-blockquote:my-6 sm:prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:rounded-r-lg
                        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-medium
                        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg sm:prose-pre:rounded-xl prose-pre:my-6 sm:prose-pre:my-8 prose-pre:p-4 sm:prose-pre:p-6 prose-pre:border prose-pre:border-gray-800
                        prose-img:rounded-lg sm:prose-img:rounded-xl prose-img:my-6 sm:prose-img:my-8 prose-img:shadow-md
                        prose-ul:my-5 sm:prose-ul:my-7 prose-ol:my-5 sm:prose-ol:my-7
                        prose-li:text-gray-700 prose-li:leading-relaxed prose-li:my-2 sm:prose-li:my-2.5
                        prose-strong:text-gray-900 prose-strong:font-semibold
                        prose-em:text-gray-600
                        prose-hr:border-gray-200 prose-hr:my-8 sm:prose-hr:my-12
                        prose-table:border prose-table:border-gray-300 prose-table:my-6 sm:prose-table:my-8 prose-table:rounded-lg prose-table:overflow-hidden
                        prose-th:bg-gray-50 prose-th:text-gray-900 prose-th:font-semibold prose-th:p-3 sm:prose-th:p-4 prose-th:border-r prose-th:border-gray-300 last:prose-th:border-r-0
                        prose-td:border-t prose-td:border-gray-300 prose-td:p-3 sm:prose-td:p-4 prose-td:border-r prose-td:border-gray-300 last:prose-td:border-r-0"
            dangerouslySetInnerHTML={{ __html: blog.body || "" }}
          />

          {/* Enhanced Tags */}
          {blog.tags?.length > 0 && (
            <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {blog.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Article Footer */}
          <footer className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg font-light">
                Thank you for reading
              </p>
              <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  <Share2 className="w-4 h-4" />
                  Share Article
                </button>
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-300 font-medium hover:border-gray-400 shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4" />
                  More Articles
                </Link>
              </div>
            </div>
          </footer>
        </article>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
            {/* Logo in Footer */}
            <Link href="/" className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="Smart ITBox"
                  width={100}
                  height={26}
                  className="h-5 sm:h-6 w-auto opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </Link>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                © {currentYear} Smart ITBox. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1 sm:mt-2">
                Crafting quality content for thoughtful readers.
              </p>
            </div>

            {/* Enhanced Footer Links */}
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 flex-wrap justify-center">
              <Link
                href="/about"
                className="hover:text-gray-700 transition-colors duration-200 hover:underline px-2"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="hover:text-gray-700 transition-colors duration-200 hover:underline px-2"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-gray-700 transition-colors duration-200 hover:underline px-2"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="hover:text-gray-700 transition-colors duration-200 hover:underline px-2"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SingleBlog;
