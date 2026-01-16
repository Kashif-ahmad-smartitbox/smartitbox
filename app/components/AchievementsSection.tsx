"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  Award,
  Trophy,
  Star,
  TrendingUp,
  Users,
  Globe,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Target,
  Sparkles,
  ChevronRight as RightIcon,
} from "lucide-react";
import {
  motion,
  useInView,
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
      staggerChildren: 0.15,
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
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const STAT_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const ACHIEVEMENT_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

interface Achievement {
  id: string;
  title: string;
  year: string;
  category: "award" | "certification" | "milestone" | "recognition";
  description: string;
  image?: string;
  issuer?: string;
  link?: string;
}

interface ClientLogo {
  id: string;
  name: string;
  logo: string;
  industry: string;
}

interface AchievementsSectionProps {
  data: {
    sectionLabel: string;
    headingPart1: string;
    headingPart2: string;
    subheading: string;
    achievements: Achievement[];
    clientLogos: ClientLogo[];
  };
}

const achievementIcons = {
  award: Award,
  certification: Trophy,
  milestone: TrendingUp,
  recognition: Star,
};

const statIcons = {
  award: Award,
  trophy: Trophy,
  trendingUp: TrendingUp,
  users: Users,
  globe: Globe,
};

function AchievementsSection({ data }: AchievementsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const categories = [
    { id: "all", label: "All Achievements" },
    { id: "award", label: "Awards" },
    { id: "certification", label: "Certifications" },
    { id: "milestone", label: "Milestones" },
    { id: "recognition", label: "Recognition" },
  ];

  const filteredAchievements =
    selectedCategory === "all"
      ? data.achievements
      : data.achievements.filter((a) => a.category === selectedCategory);

  return (
    <section
      ref={sectionRef}
      className="relative bg-linear-to-b from-white via-gray-50/30 to-white py-5 lg:py-30 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate={controls}
          className="text-center mb-10"
        >
          {/* Top Label */}
          <motion.div
            variants={CHILD_VARIANTS}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-linear-to-l from-rose-200 via-primary-50 to-rose-200 text-secondary-900 text-sm font-semibold rounded-lg border border-primary-200/50"
          >
            <span>{data.sectionLabel}</span>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={CHILD_VARIANTS}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-gray-900">
              {data.headingPart1}{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary-500 bg-clip-text">
                  {data.headingPart2}
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  className="absolute bottom-1 left-0 right-0 h-3 bg-primary-100/50 z-0 rounded-lg"
                />
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              {data.subheading}
            </p>
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === category.id
                  ? "bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Achievements Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20"
          >
            {filteredAchievements.map((achievement, index) => {
              const IconComponent = achievementIcons[achievement.category];
              const delay = 0.5 + index * 0.1;

              return (
                <motion.div
                  key={achievement.id}
                  custom={delay}
                  variants={ACHIEVEMENT_VARIANTS}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="group"
                >
                  <motion.div
                    whileHover={{
                      y: -4,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: SPRING_CONFIG.stiffness,
                      damping: SPRING_CONFIG.damping,
                      mass: SPRING_CONFIG.mass,
                    }}
                    className="relative bg-white rounded-2xl border-2 border-gray-100 p-6 h-full hover:border-primary-300"
                  >
                    <div className="relative flex items-center justify-between mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: SPRING_CONFIG.stiffness,
                          damping: SPRING_CONFIG.damping,
                          mass: SPRING_CONFIG.mass,
                        }}
                        className="w-12 h-12 rounded-xl bg-linear-to-br from-primary-100 to-primary-50 flex items-center justify-center border border-primary-200/50"
                      >
                        <IconComponent className="text-primary-500" size={24} />
                      </motion.div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{achievement.year}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="relative text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {achievement.title}
                    </h3>

                    {/* Issuer */}
                    {achievement.issuer && (
                      <div className="relative text-sm text-gray-500 mb-3">
                        by {achievement.issuer}
                      </div>
                    )}

                    {/* Description */}
                    <p className="relative text-gray-600 mb-6 leading-relaxed">
                      {achievement.description}
                    </p>

                    {/* Link */}
                    {achievement.link && (
                      <motion.a
                        href={achievement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 4 }}
                        className="relative inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details
                        <ArrowUpRight size={14} />
                      </motion.a>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default AchievementsSection;
