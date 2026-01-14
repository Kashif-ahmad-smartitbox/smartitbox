"use client";

import React, { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import {
  getStory,
  getStories,
  StoryItem,
} from "@/app/services/modules/stories";
import {
  Loader2,
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Tag,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function SingleStories() {
  const { slug } = useParams();
  const [story, setStory] = useState<any>(null);
  const [relatedStories, setRelatedStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchStory = async () => {
      try {
        setLoading(true);
        const response = await getStory(slug as string);

        // Check if story exists and is published
        if (!response.story || response.story.status === "draft") {
          notFound(); // This will show the 404 page
          return;
        }

        setStory(response.story);

        // Fetch related stories after main story loads
        await fetchRelatedStories(response.story);
      } catch (err: any) {
        console.error("Failed to fetch story:", err);

        // If it's a 404 error or story not found, show 404 page
        if (
          err?.response?.status === 404 ||
          err?.message?.includes("not found")
        ) {
          notFound();
          return;
        }

        setError("Unable to load this story. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [slug]);

  const fetchRelatedStories = async (currentStory: any) => {
    try {
      setRelatedLoading(true);
      const response = await getStories({
        limit: 4,
        status: "published", // Only fetch published stories for related section
        featured: false,
      });

      const filteredStories = (response.items || [])
        .filter((s: StoryItem) => s._id !== currentStory._id)
        .slice(0, 2);

      setRelatedStories(filteredStories);
    } catch (err) {
      console.error("Failed to fetch related stories:", err);
    } finally {
      setRelatedLoading(false);
    }
  };

  const handleShare = async () => {
    if (!story) return;

    const shareData = {
      title: story.title,
      text: story.excerpt,
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
        // You can add a toast notification here for better UX
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

  const formatStoryExcerpt = (excerpt: string, maxLength: number = 100) => {
    if (!excerpt) return "Discover this captivating story...";
    return excerpt.length > maxLength
      ? excerpt.substring(0, maxLength) + "..."
      : excerpt;
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      "from-primary-100 to-cyan-100 hover:border-primary-300 group-hover:text-primary-600",
      "from-purple-100 to-pink-100 hover:border-purple-300 group-hover:text-purple-600",
      "from-green-100 to-emerald-100 hover:border-green-300 group-hover:text-green-600",
      "from-orange-100 to-red-100 hover:border-orange-300 group-hover:text-orange-600",
      "from-indigo-100 to-primary-100 hover:border-indigo-300 group-hover:text-indigo-600",
      "from-teal-100 to-cyan-100 hover:border-teal-300 group-hover:text-teal-600",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          </div>
          <p className="text-gray-600 font-medium">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    notFound();
  }

  const readingTime = calculateReadingTime(story.body);
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              All Stories
            </Link>

            {/* Centered Logo */}
            <Link
              href="/"
              className="absolute left-1/2 transform -translate-x-1/2"
            >
              <Image
                src="/logo.svg"
                alt="Smart ITBox"
                width={100}
                height={25}
                className="h-6 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-primary-900 to-slate-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/40"></div>

        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-28">
          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            {story.featured ? "Featured Story" : "Story"}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight tracking-tight">
            {story.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8 font-light max-w-3xl">
            {story.subtitle}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-gray-300 text-sm flex-wrap">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Calendar className="w-4 h-4" />
              <time>
                {new Date(story.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
            {story.featured && (
              <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-yellow-200">
                <span>⭐ Featured</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <article className="max-w-3xl mx-auto py-8 md:py-12 px-4 sm:px-6">
          {/* Featured Image */}
          {story.image && (
            <div className="relative w-full mb-8 md:mb-12 rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              <div className="aspect-video w-full relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    imageLoaded
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Excerpt */}
          {story.excerpt && (
            <div className="bg-gradient-to-r from-primary-50 to-indigo-50 border-l-4 border-primary-400 p-6 rounded-r-xl mb-8 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-full bg-primary-400 rounded-full flex-shrink-0 mt-1"></div>
                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                  {story.excerpt}
                </p>
              </div>
            </div>
          )}

          {/* Story Content */}
          <div
            className="story-content prose prose-lg max-w-none 
                        prose-headings:font-normal prose-headings:text-gray-900 prose-headings:tracking-tight
                        prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mt-12 sm:prose-h1:mt-16 prose-h1:mb-6 sm:prose-h1:mb-8 prose-h1:pt-6 sm:prose-h1:pt-8 prose-h1:border-t prose-h1:border-gray-200
                        prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-10 sm:prose-h2:mt-14 prose-h2:mb-4 sm:prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100
                        prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-8 sm:prose-h3:mt-12 prose-h3:mb-3 sm:prose-h3:mb-4
                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-6 sm:prose-p:my-8 prose-p:text-[17px] sm:prose-p:text-[18px] prose-p:font-light
                        prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                        prose-blockquote:border-l-4 prose-blockquote:border-primary-400 prose-blockquote:bg-primary-50 
                        prose-blockquote:px-6 sm:prose-blockquote:px-8 prose-blockquote:py-4 sm:prose-blockquote:py-6 prose-blockquote:my-8 sm:prose-blockquote:my-12 prose-blockquote:italic prose-blockquote:rounded-r-lg prose-blockquote:text-gray-700
                        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:my-8 sm:prose-pre:my-12 prose-pre:p-6 prose-pre:border prose-pre:border-gray-800
                        prose-img:rounded-xl prose-img:my-8 sm:prose-img:my-12 prose-img:shadow-lg prose-img:border prose-img:border-gray-200
                        prose-ul:my-6 sm:prose-ul:my-8 prose-ol:my-6 sm:prose-ol:my-8
                        prose-li:text-gray-700 prose-li:leading-relaxed prose-li:my-3
                        prose-strong:text-gray-900 prose-strong:font-semibold
                        prose-em:text-gray-600 prose-em:italic
                        prose-hr:border-gray-200 prose-hr:my-12 sm:prose-hr:my-16
                        prose-table:border prose-table:border-gray-300 prose-table:my-8 sm:prose-table:my-12 prose-table:rounded-lg prose-table:overflow-hidden prose-table:shadow-sm"
            dangerouslySetInnerHTML={{ __html: story.body || "" }}
          />

          {/* Story Tags */}
          {story.tags?.length > 0 && (
            <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Tag className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Story Tags
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {story.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-50 to-indigo-50 text-primary-700 rounded-full text-sm font-medium border border-primary-200 hover:border-primary-300 transition-colors duration-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-6 text-lg font-light">
                Enjoyed this story? Share it with others
              </p>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl hover:from-primary-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Share2 className="w-5 h-5" />
                Share This Story
              </button>
            </div>
          </div>
        </article>
      </main>

      {/* Related Stories Section */}
      {relatedStories.length > 0 && (
        <div className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-gray-900 mb-4">
                More Stories You Might Like
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover other captivating stories from our collection
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {relatedStories.map((relatedStory, index) => (
                <Link
                  key={relatedStory._id}
                  href={`/case-studies/${
                    relatedStory.slug || relatedStory._id
                  }`}
                  className="group block bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Story Image */}
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    {relatedStory.image ? (
                      <img
                        src={relatedStory.image}
                        alt={relatedStory.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${getCategoryColor(
                          index
                        )} flex items-center justify-center`}
                      >
                        <BookOpen className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Featured Badge */}
                    {relatedStory.featured && (
                      <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {relatedStory.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                      {formatStoryExcerpt(relatedStory.excerpt)}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        {calculateReadingTime(relatedStory.body)} min read
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(relatedStory.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                View All Stories
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Simplified Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Logo */}
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Smart ITBox"
                width={120}
                height={30}
                className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            </Link>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                © {currentYear} Smart ITBox. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SingleStories;
