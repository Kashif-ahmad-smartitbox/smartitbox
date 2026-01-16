"use client";
import React, { useRef, useEffect } from "react";
import {
  Calendar,
  Target,
  Rocket,
  Trophy,
  Users,
  Zap,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { motion, useInView, useAnimation, type Variants } from "framer-motion";

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

const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: "calendar" | "target" | "rocket" | "trophy" | "users" | "zap";
  highlight?: boolean;
}

interface StoryTimelineSectionProps {
  data: {
    sectionLabel: string;
    headingPart1: string;
    headingPart2: string;
    subheading: string;
    timeline: TimelineItem[];
  };
}

const iconMap = {
  calendar: Calendar,
  target: Target,
  rocket: Rocket,
  trophy: Trophy,
  users: Users,
  zap: Zap,
};

function StoryTimelineSection({ data }: StoryTimelineSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-15 lg:py-30 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate={controls}
          className="text-center mb-16 lg:mb-24"
        >
          {/* Top Label */}
          <motion.div
            variants={CHILD_VARIANTS}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-linear-to-r from-primary-50 to-primary-100 text-secondary-900 text-sm font-semibold rounded-lg border border-primary-200/50"
          >
            <span>{data.sectionLabel}</span>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={CHILD_VARIANTS} className="mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-gray-900">
              {data.headingPart1}{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-primary-600">
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
                  className="absolute bottom-2 left-0 right-0 h-3 bg-linear-to-r from-primary-100/50 to-primary-200/30 z-0 rounded-lg"
                />
              </span>
            </h2>
          </motion.div>

          {/* Subheading */}
          <motion.div variants={CHILD_VARIANTS}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {data.subheading}
            </p>
          </motion.div>
        </motion.div>

        {/* Modern Timeline */}
        <div className="relative">
          {/* Main timeline line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-linear-gradient-to-b from-transparent via-primary-300/50 to-transparent transform -translate-x-1/2"
          />

          {/* Timeline Items */}
          <div className="space-y-10 lg:space-y-5">
            {data.timeline.map((item, index) => {
              const IconComponent = iconMap[item.icon];
              const isEven = index % 2 === 0;
              const delay = 0.3 + index * 0.15;

              return (
                <motion.div
                  key={item.year}
                  custom={delay}
                  variants={CARD_VARIANTS}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className={`relative flex flex-col lg:flex-row items-center ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Year Indicator - Desktop */}
                  <div className="hidden lg:flex w-1/2 justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`relative group ${
                        isEven ? "lg:pr-12" : "lg:pl-12"
                      }`}
                    >
                      {/* Connecting line */}
                      <div
                        className={`absolute top-1/2 w-12 h-0.5 bg-linear-to-r ${
                          isEven
                            ? "right-0 from-primary-300 to-transparent"
                            : "left-0 from-transparent to-primary-300"
                        }`}
                      />

                      {/* Year badge */}
                      <div className="relative inline-flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={isInView ? { scale: 1 } : { scale: 0 }}
                          transition={{ delay: delay + 0.1 }}
                          className="absolute -inset-4 bg-primary-100/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        <div className="relative flex items-center gap-3">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={isInView ? { scale: 1 } : { scale: 0 }}
                            transition={{
                              delay: delay + 0.2,
                              type: "spring",
                              ...SPRING_CONFIG,
                            }}
                            className="w-3 h-3 rounded-full bg-primary-500"
                          />
                          <span className="text-2xl font-bold text-gray-900">
                            {item.year}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Timeline Center Dot */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 z-20">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{
                        delay: delay + 0.15,
                        type: "spring",
                        ...SPRING_CONFIG,
                      }}
                      className="relative"
                    >
                      <div className="w-5 h-5 rounded-full bg-white border-4 border-primary-500 shadow-lg shadow-primary-500/30" />
                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-full bg-primary-400/30 border-2 border-primary-400/50"
                      />
                    </motion.div>
                  </div>

                  {/* Content Card */}
                  <div className="w-full lg:w-1/2">
                    <motion.div
                      whileHover={{
                        y: -6,
                        boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.15)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: SPRING_CONFIG.stiffness,
                        damping: SPRING_CONFIG.damping,
                        mass: SPRING_CONFIG.mass,
                      }}
                      className="relative group"
                    >
                      {/* Year Indicator - Mobile */}
                      <div className="lg:hidden mb-6">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary-500" />
                          <span className="text-xl font-bold text-gray-900">
                            {item.year}
                          </span>
                        </div>
                      </div>

                      {/* Card */}
                      <div
                        className={`relative bg-white p-8 rounded-2xl border border-gray-100 transition-all duration-300 overflow-hidden ${
                          item.highlight ? "ring-2 ring-primary-500/20" : ""
                        }`}
                      >
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-linear-gradient-to-br from-white via-white to-primary-50/5" />

                        {/* Icon and Header */}
                        <div className="relative flex items-start gap-6 mb-6">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{
                              type: "spring",
                              stiffness: SPRING_CONFIG.stiffness,
                              damping: SPRING_CONFIG.damping,
                              mass: SPRING_CONFIG.mass,
                            }}
                            className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                              item.highlight
                                ? "bg-linear-to-br from-primary-500 to-primary-600"
                                : "bg-linear-to-br from-primary-50 to-primary-100"
                            } shadow-md`}
                          >
                            <IconComponent
                              className={
                                item.highlight
                                  ? "text-white"
                                  : "text-primary-500"
                              }
                              size={24}
                            />
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-2xl font-bold text-gray-900">
                                {item.title}
                              </h3>
                              {item.highlight && (
                                <span className="px-3 py-1 bg-primary-500/10 text-primary-600 text-sm font-semibold rounded-full">
                                  Milestone
                                </span>
                              )}
                            </div>
                            <div className="h-1 w-16 bg-linear-to-r from-primary-400 to-primary-300 rounded-full mb-4" />
                          </div>
                        </div>

                        {/* Description */}
                        <p className="relative text-lg text-gray-600 leading-relaxed mb-6">
                          {item.description}
                        </p>

                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-primary-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary-400/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Progress line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="hidden lg:block absolute left-1/2 top-0 h-full w-0.5 bg-linear-gradient-to-b from-primary-500 via-primary-400 to-primary-300 transform -translate-x-1/2 origin-top"
          />
        </div>
      </div>
    </section>
  );
}

export default StoryTimelineSection;
