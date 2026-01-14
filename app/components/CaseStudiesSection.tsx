"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  Briefcase,
  ArrowRight,
  X,
  Calendar,
  Clock,
  Tag,
  Loader,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getStories, StoryItem } from "@/app/services/modules/stories";
import {
  motion,
  useAnimation,
  AnimatePresence,
  type Variants,
} from "framer-motion";

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

const CHILD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
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

interface CaseStudiesProps {
  data: {
    title?: string;
    subtitle?: string;
    description?: string;
  };
}

export default function CaseStudies({ data }: CaseStudiesProps) {
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
      "from-primary-500/20 to-blue-500/20",
      "from-purple-500/20 to-pink-500/20",
      "from-emerald-500/20 to-teal-500/20",
      "from-amber-500/20 to-orange-500/20",
      "from-violet-500/20 to-purple-500/20",
      "from-rose-500/20 to-pink-500/20",
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <div className="py-32 bg-linear-to-b from-gray-50/30 via-white to-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Loader className="w-8 h-8 text-primary-600 animate-spin" />
            <span className="ml-3 text-gray-600">Loading case studies...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-32 bg-linear-to-b from-gray-50/30 via-white to-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-red-900 mb-2">
              Unable to load case studies
            </h3>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
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
    <section className="relative py-5 lg:py-30 bg-linear-to-b from-white via-primary-50/30 to-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          {data?.subtitle && (
            <motion.p
              variants={CHILD_VARIANTS}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-linear-to-r from-primary-50 to-primary-100 text-secondary-900 text-sm font-semibold rounded-lg border border-primary-200/50"
            >
              {data.subtitle}
            </motion.p>
          )}

          {data?.title && (
            <motion.h2
              variants={CHILD_VARIANTS}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 mb-6"
            >
              {data.title}
            </motion.h2>
          )}

          {data?.description && (
            <motion.p
              variants={CHILD_VARIANTS}
              className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              {data.description}
            </motion.p>
          )}
        </motion.header>

        {/* Featured Case Studies */}
        {featured.length > 0 && (
          <motion.div
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {featured.map((f, index) => (
              <motion.article
                key={f._id}
                custom={index}
                variants={CARD_VARIANTS}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  {f.image ? (
                    <motion.img
                      src={f.image}
                      alt={f.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-linear-to-br ${getGradientColor(
                        index
                      )} flex items-center justify-center`}
                    >
                      <Briefcase className="w-12 h-12 text-white" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {f.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col grow">
                  {/* Title & Category */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                        {f.vertical}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                      {f.title}
                    </h3>
                  </div>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed grow">
                    {f.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{calculateReadingTime(f.body || "")} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(f.publishedAt)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {f.tags && f.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {f.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-600 border border-primary-100"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA Button */}
                  <motion.button
                    onClick={() => setOpen(f)}
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
                    className="group/btn relative mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-linear-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-linear-to-r from-primary-600 to-primary-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />

                    {/* Button content */}
                    <span className="relative">Read Case Study</span>
                    <ArrowRight className="relative w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Other Case Studies */}
        {others.length > 0 && (
          <motion.div
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {others.map((study, index) => (
              <motion.article
                key={study._id}
                custom={index}
                variants={CARD_VARIANTS}
                whileHover={{ y: -4 }}
                className="group relative bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative h-40 overflow-hidden">
                  {study.image ? (
                    <motion.img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-linear-to-br ${getGradientColor(
                        index
                      )} flex items-center justify-center`}
                    >
                      <Briefcase className="w-10 h-10 text-white" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col grow">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                      <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                        {study.vertical}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                      {study.title}
                    </h3>
                  </div>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed grow">
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
                  <motion.button
                    onClick={() => setOpen(study)}
                    whileHover={{ x: 2 }}
                    className="mt-auto w-full inline-flex items-center justify-center gap-2 py-2.5 bg-primary-50 text-primary-600 rounded-xl font-semibold text-sm hover:bg-primary-100 transition-all duration-200 border border-primary-100 group/btn"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {caseStudies.length === 0 && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No case studies published yet
            </h3>
            <p className="text-gray-600">Check back later for new content</p>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="relative h-72 bg-linear-to-br from-primary-900 to-primary-700">
                {open.image && (
                  <img
                    src={open.image}
                    alt={open.title}
                    className="w-full h-full object-cover opacity-50"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    {open.featured && (
                      <div className="bg-linear-to-r from-primary-500 to-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold">
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

                <motion.button
                  onClick={() => setOpen(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {open.excerpt}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.a
                    href={`/case-studies/${open.slug || open._id}`}
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
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Read Full Case Study
                    <ArrowRight className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    href="/contact"
                    whileHover={{ x: 4 }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    Talk to Our Team
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
