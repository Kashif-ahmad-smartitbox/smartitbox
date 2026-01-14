"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  Briefcase,
  ArrowRight,
  ChevronDown,
  X,
  Loader2,
  Calendar,
  Clock,
  Star,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { getStories, StoryItem } from "@/app/services/modules/stories";

type CaseStudy = {
  id: string;
  _id: string;
  title: string;
  logo?: string;
  excerpt: string;
  vertical: string;
  outcomes: string[];
  metrics?: { label: string; value: string }[];
  image?: string;
  featured?: boolean;
  status: string;
  slug?: string;
  subtitle?: string;
  publishedAt?: string;
  tags?: string[];
  body?: string;
};

export default function CaseStudies(props: any) {
  const [open, setOpen] = useState<CaseStudy | null>(null);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch case studies from API
  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getStories({
          status: "published",
          featured: true,
          limit: 6,
        });

        const transformedStudies: CaseStudy[] = (response.items || []).map(
          (story: StoryItem) => ({
            id: story._id,
            _id: story._id,
            title: story.title,
            excerpt: story.excerpt || "Discover this compelling case study...",
            vertical: story.tags?.[0] || "Business",
            outcomes: story.tags?.slice(0, 2) || ["Results", "Impact"],
            metrics: [
              { label: "Engagement", value: "+35%" },
              { label: "Satisfaction", value: "95%" },
            ],
            image:
              story.image ||
              "https://images.unsplash.com/photo-1503602642458-232111445657?w=1400&q=80&auto=format&fit=crop",
            featured: story.featured,
            status: story.status,
            slug: story.slug,
            subtitle: story.subtitle,
            publishedAt: story.publishedAt,
            tags: story.tags,
            body: story.body,
          })
        );

        setCaseStudies(transformedStudies);
      } catch (err: any) {
        console.error("Failed to fetch case studies:", err);
        setError("Unable to load case studies. Please try again later.");
        setCaseStudies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  const featured = useMemo(
    () => caseStudies.filter((c) => c.featured).slice(0, 3),
    [caseStudies]
  );

  const others = useMemo(
    () => caseStudies.filter((c) => !c.featured),
    [caseStudies]
  );

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

  const getGradientColor = (index: number) => {
    const gradients = [
      "from-blue-500/20 to-cyan-500/20",
      "from-purple-500/20 to-pink-500/20",
      "from-emerald-500/20 to-teal-500/20",
      "from-amber-500/20 to-orange-500/20",
      "from-violet-500/20 to-purple-500/20",
      "from-rose-500/20 to-pink-500/20",
    ];
    return gradients[index % gradients.length];
  };

  // Rest of the component remains the same for loading, error, and empty states...

  return (
    <section
      className="py-16 lg:py-24 bg-gray-50"
      aria-labelledby="case-studies-title"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <header className="mb-12 sm:mb-16 text-center">
          <p className="text-2xl sm:text-3xl font-semibold text-primary-600">
            {props.data?.subtitle}
          </p>
          <h2
            id="case-studies-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900"
          >
            {props.data?.title}
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {props.data?.description}
          </p>
        </header>

        {/* Featured row — improved card design */}
        {featured.length > 0 && (
          <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((f, index) => (
              <article
                key={f._id}
                className="group relative bg-white rounded-3xl border border-gray-200/80 hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative h-52 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
                  {f.image ? (
                    <>
                      <img
                        src={f.image}
                        alt={f.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div
                      className={`w-full h-full bg-linear-to-br ${getGradientColor(
                        index
                      )} flex items-center justify-center`}
                    >
                      <Briefcase className="w-12 h-12 text-white/80" />
                    </div>
                  )}

                  {/* Featured Badge */}
                  {f.featured && (
                    <div className="absolute top-4 left-4 bg-linear-to-r from-primary-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl backdrop-blur-sm border border-amber-300/30">
                      Featured
                    </div>
                  )}

                  {/* Hover Action */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <ArrowRight className="w-6 h-6 text-gray-800" />
                    </div>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-3 text-white/90 text-xs">
                      <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">
                          {calculateReadingTime(f.body || "")} min
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Calendar className="w-3 h-3" />
                        <span className="font-medium">
                          {formatDate(f.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title & Category */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                        {f.vertical}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                      {f.title}
                    </h3>
                  </div>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {f.excerpt}
                  </p>

                  {/* Tags */}
                  {f.tags && f.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {f.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1.5 bg-linear-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200/60 hover:from-primary-50 hover:to-primary-100 hover:border-primary-200 hover:text-primary-700 transition-all duration-200"
                        >
                          <Tag className="w-3 h-3 mr-1.5" />
                          {tag}
                        </span>
                      ))}
                      {f.tags.length > 2 && (
                        <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium border border-gray-200/60">
                          +{f.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="flex items-center justify-between mt-5">
                    <button
                      onClick={() => setOpen(f)}
                      className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors duration-200 group/btn"
                    >
                      Read Case Study
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Other case studies - improved design */}
        {others.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {others.map((study, index) => (
              <article
                key={study._id}
                className="group relative bg-white rounded-3xl border border-gray-200/80 hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
                  {study.image ? (
                    <>
                      <img
                        src={study.image}
                        alt={study.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div
                      className={`w-full h-full bg-linear-to-br ${getGradientColor(
                        index
                      )} flex items-center justify-center`}
                    >
                      <Briefcase className="w-10 h-10 text-white/80" />
                    </div>
                  )}

                  {/* Hover Action */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <ArrowRight className="w-5 h-5 text-gray-800" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title & Category */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                      <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                        {study.vertical}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                      {study.title}
                    </h3>
                  </div>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {study.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{calculateReadingTime(study.body || "")} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(study.publishedAt)}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => setOpen(study)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-linear-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-200 border border-gray-200/60 hover:border-primary-200 group/btn"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal - Improved Design */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(null);
          }}
        >
          <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative h-[60vh] bg-linear-to-br from-slate-900 via-primary-900 to-slate-800">
              {open.image && (
                <img
                  src={open.image}
                  alt={open.title}
                  className="w-full h-full object-cover opacity-60"
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  {open.featured && (
                    <div className="bg-linear-to-r from-primary-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Featured
                    </div>
                  )}
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    {open.vertical}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{open.title}</h3>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {calculateReadingTime(open.body || "")} min read
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(open.publishedAt)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(null)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {open.excerpt}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/case-studies/${open.slug || open._id}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-primary-600 to-primary-800 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Read Full Case Study
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  Talk to Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
