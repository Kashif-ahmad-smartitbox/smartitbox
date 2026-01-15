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

const TIMELINE_ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 50 },
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

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: "calendar" | "target" | "rocket" | "trophy" | "users" | "zap";
}

interface StoryTimelineSectionProps {
  data: {
    sectionLabel: string;
    headingPart1: string;
    headingPart2: string;
    subheading: string;
    timeline: TimelineItem[];
    ctaButton: {
      text: string;
      href: string;
    };
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
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate={controls}
          className="text-center mb-20"
        >
          {/* Top Label */}
          <motion.div
            variants={CHILD_VARIANTS}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-linear-to-r from-primary-50 to-primary-100 text-secondary-900 text-sm font-semibold rounded-lg border border-primary-200/50"
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
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              {data.subheading}
            </p>
          </motion.div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-linear-to-b from-primary-400/30 via-primary-300/30 to-transparent hidden lg:block" />

          {/* Animated Vertical Line Effect */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
            className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-linear-to-b from-primary-400 via-primary-300 to-transparent origin-top hidden lg:block"
            style={{ top: 0 }}
          />

          {/* Timeline Items */}
          <div className="space-y-16 lg:space-y-24">
            {data.timeline.map((item, index) => {
              const IconComponent = iconMap[item.icon];
              const isEven = index % 2 === 0;
              const delay = 0.5 + index * 0.15;

              return (
                <motion.div
                  key={item.year}
                  custom={delay}
                  variants={TIMELINE_ITEM_VARIANTS}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Year */}
                  <div className="lg:w-1/2 flex justify-center lg:justify-end">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative group"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : { scale: 0 }}
                        transition={{ delay: delay + 0.1 }}
                        className="absolute -inset-2 bg-primary-100/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <div className="relative inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-full shadow-lg shadow-gray-900/5">
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
                        <span className="text-lg font-bold text-gray-900">
                          {item.year}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 lg:left-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{
                        delay: delay + 0.1,
                        type: "spring",
                        ...SPRING_CONFIG,
                      }}
                      className="w-6 h-6 rounded-full bg-white border-4 border-primary-500 shadow-lg"
                    />
                  </div>

                  {/* Content Card */}
                  <div className="lg:w-1/2">
                    <motion.div
                      whileHover={{
                        y: -8,
                        boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.15)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: SPRING_CONFIG.stiffness,
                        damping: SPRING_CONFIG.damping,
                        mass: SPRING_CONFIG.mass,
                      }}
                      className="relative group"
                    >
                      {/* Card Background Effect */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={
                          isInView
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0.95 }
                        }
                        transition={{ delay: delay }}
                        className="absolute -inset-2 bg-linear-to-r from-primary-500/5 to-primary-300/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />

                      <div className="relative bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/5">
                        <div className="flex items-start gap-6">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{
                              type: "spring",
                              stiffness: SPRING_CONFIG.stiffness,
                              damping: SPRING_CONFIG.damping,
                              mass: SPRING_CONFIG.mass,
                            }}
                            className="shrink-0 w-14 h-14 rounded-xl bg-linear-to-br from-primary-50 to-primary-100 flex items-center justify-center border border-primary-200/50"
                          >
                            <IconComponent
                              className="text-primary-500"
                              size={24}
                            />
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className="mt-20 text-center"
        >
          <motion.a
            href={data.ctaButton.href}
            initial={false}
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
            className="group relative inline-flex items-center bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-10 py-4 rounded-full font-semibold text-base shadow-lg shadow-primary-500/25 gap-3"
          >
            <span>{data.ctaButton.text}</span>
            <ArrowUpRight
              size={18}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
            />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

export default StoryTimelineSection;
