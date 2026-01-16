"use client";
import React, { useRef, useEffect } from "react";
import {
  Heart,
  Target,
  Users,
  Zap,
  Award,
  Globe,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
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

const VALUE_CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 30 },
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

interface ValueCard {
  id: string;
  title: string;
  description: string;
  icon: "heart" | "target" | "users" | "zap" | "award" | "globe";
  color: "primary" | "secondary" | "accent" | "success";
}

interface CoreValuesSectionProps {
  data: {
    sectionLabel: string;
    headingPart1: string;
    headingPart2: string;
    subheading: string;
    values: ValueCard[];
  };
}

const iconMap = {
  heart: Heart,
  target: Target,
  users: Users,
  zap: Zap,
  award: Award,
  globe: Globe,
};

const colorClasses = {
  primary: {
    card: "bg-linear-to-br from-primary-50 to-primary-100/50 border-primary-200/50",
    icon: "bg-linear-to-br from-primary-100 to-primary-50 text-primary-500",
    text: "text-primary-700",
    accent: "from-primary-400 to-primary-300",
  },
  secondary: {
    card: "bg-linear-to-br from-blue-50 to-blue-100/50 border-blue-200/50",
    icon: "bg-linear-to-br from-blue-100 to-blue-50 text-blue-500",
    text: "text-blue-700",
    accent: "from-blue-400 to-blue-300",
  },
  accent: {
    card: "bg-linear-to-br from-amber-50 to-amber-100/50 border-amber-200/50",
    icon: "bg-linear-to-br from-amber-100 to-amber-50 text-amber-500",
    text: "text-amber-700",
    accent: "from-amber-400 to-amber-300",
  },
  success: {
    card: "bg-linear-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/50",
    icon: "bg-linear-to-br from-emerald-100 to-emerald-50 text-emerald-500",
    text: "text-emerald-700",
    accent: "from-emerald-400 to-emerald-300",
  },
};

function CoreValuesSection({ data }: CoreValuesSectionProps) {
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
      className="relative bg-linear-to-b from-white via-gray-50/30 to-white py-15 lg:py-30 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate={controls}
          className="text-center mb-20"
        >
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
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              {data.subheading}
            </p>
          </motion.div>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.values.map((value, index) => {
            const IconComponent = iconMap[value.icon];
            const colors = colorClasses[value.color];
            const delay = 0.3 + index * 0.1;

            return (
              <motion.div
                key={value.id}
                custom={delay}
                variants={VALUE_CARD_VARIANTS}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="group"
              >
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
                  className={`h-full p-8 rounded-2xl border ${colors.card} relative overflow-hidden`}
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{
                      type: "spring",
                      stiffness: SPRING_CONFIG.stiffness,
                      damping: SPRING_CONFIG.damping,
                      mass: SPRING_CONFIG.mass,
                    }}
                    className={`relative w-16 h-16 rounded-2xl ${colors.icon} flex items-center justify-center mb-6 border border-primary-200/50`}
                  >
                    <IconComponent size={32} />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 relative">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6 relative">
                    {value.description}
                  </p>

                  {/* Decorative Line */}
                  <motion.div
                    initial={{ width: 48 }}
                    whileHover={{ width: 96 }}
                    transition={{
                      type: "spring",
                      stiffness: SPRING_CONFIG.stiffness,
                      damping: SPRING_CONFIG.damping,
                      mass: SPRING_CONFIG.mass,
                    }}
                    className={`h-1 rounded-full bg-linear-to-r ${colors.accent} relative overflow-hidden`}
                  >
                    <motion.div
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CoreValuesSection;
