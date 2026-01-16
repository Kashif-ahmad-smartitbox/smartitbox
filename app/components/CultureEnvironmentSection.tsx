"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import {
  Coffee,
  Users,
  Trophy,
  Globe,
  Heart,
  Zap,
  ArrowUpRight,
  PlayCircle,
  Calendar,
  TrendingUp,
  Sparkles,
  ChevronRight,
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

const CULTURE_POINT_VARIANTS: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const IMAGE_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const PERK_VARIANTS: Variants = {
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

interface CulturePoint {
  id: string;
  title: string;
  description: string;
  icon: "coffee" | "users" | "trophy" | "globe" | "heart" | "zap";
}

interface CultureImage {
  url: string;
  alt: string;
  title: string;
}

interface CultureEnvironmentSectionProps {
  data: {
    sectionLabel: string;
    headingPart1: string;
    headingPart2: string;
    subheading: string;
    culturePoints: CulturePoint[];
    images: CultureImage[];
    videoThumbnail?: string;
    videoLink?: string;
    perks: Array<{
      title: string;
      description: string;
      icon: "calendar" | "trophy" | "trendingUp" | "globe";
    }>;
    ctaButton: {
      text: string;
      href: string;
    };
  };
}

const iconMap = {
  coffee: Coffee,
  users: Users,
  trophy: Trophy,
  globe: Globe,
  heart: Heart,
  zap: Zap,
};

const perkIconMap = {
  calendar: Calendar,
  trophy: Trophy,
  trendingUp: TrendingUp,
  globe: Globe,
};

function CultureEnvironmentSection({ data }: CultureEnvironmentSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const handleVideoClick = () => {
    if (data.videoLink) {
      window.open(data.videoLink, "_blank");
    }
  };

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
          className="text-center mb-20"
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Culture Points */}
          <div>
            <div className="space-y-8">
              {data.culturePoints.map((point, index) => {
                const IconComponent = iconMap[point.icon];
                const delay = 0.3 + index * 0.15;

                return (
                  <motion.div
                    key={point.id}
                    custom={delay}
                    variants={CULTURE_POINT_VARIANTS}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="group"
                  >
                    <motion.div
                      whileHover={{
                        x: 8,
                        boxShadow: "0 10px 30px -5px rgba(59, 130, 246, 0.1)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: SPRING_CONFIG.stiffness,
                        damping: SPRING_CONFIG.damping,
                        mass: SPRING_CONFIG.mass,
                      }}
                      className="relative flex items-start gap-5 cursor-pointer p-4 rounded-xl"
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
                        className="relative shrink-0 w-14 h-14 rounded-xl bg-linear-to-br from-primary-100 to-primary-50 border border-primary-200/50 flex items-center justify-center"
                      >
                        <IconComponent size={24} className="text-primary-500" />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                          {point.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {point.description}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Perks Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-12"
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
                className="relative p-8 bg-white rounded-2xl border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Employee Perks & Benefits
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {data.perks.map((perk, index) => {
                    const IconComponent = perkIconMap[perk.icon];
                    const delay = 0.9 + index * 0.1;

                    return (
                      <motion.div
                        key={perk.title}
                        custom={delay}
                        variants={PERK_VARIANTS}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{
                              type: "spring",
                              stiffness: SPRING_CONFIG.stiffness,
                              damping: SPRING_CONFIG.damping,
                              mass: SPRING_CONFIG.mass,
                            }}
                            className="w-10 h-10 rounded-lg bg-linear-to-br from-primary-100 to-primary-50 flex items-center justify-center border border-primary-200/50"
                          >
                            <IconComponent
                              size={20}
                              className="text-primary-500"
                            />
                          </motion.div>
                          <span className="font-semibold text-gray-900">
                            {perk.title}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {perk.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Gallery */}
          <div className="space-y-6">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              {data.images.map((image, index) => {
                const delay = 0.3 + index * 0.15;

                return (
                  <motion.div
                    key={image.alt}
                    custom={delay}
                    variants={IMAGE_VARIANTS}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className={`${
                      index === 0 ? "col-span-2" : ""
                    } relative group overflow-hidden rounded-2xl`}
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
                      className="relative aspect-4/3 overflow-hidden rounded-2xl border border-gray-100"
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-gray-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          {image.title}
                        </p>
                      </div>

                      {/* Animated Border */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-primary-200/20 pointer-events-none"
                        animate={{
                          borderWidth: [2, 3, 2],
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                          delay: 1 + index * 0.2,
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Video Section */}
            {data.videoThumbnail && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1 }}
                className="relative rounded-2xl overflow-hidden group cursor-pointer"
                onClick={handleVideoClick}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{
                    type: "spring",
                    stiffness: SPRING_CONFIG.stiffness,
                    damping: SPRING_CONFIG.damping,
                    mass: SPRING_CONFIG.mass,
                  }}
                  className="relative aspect-video rounded-2xl border border-gray-100 overflow-hidden shadow-lg shadow-gray-900/5"
                >
                  <Image
                    src={data.videoThumbnail}
                    alt="Office culture video"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 to-transparent" />

                  {/* Play Button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <PlayCircle size={40} className="text-white" />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Quote Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.1 }}
              className="relative"
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
                className="p-6 bg-linear-to-r from-primary-500 to-primary-600 rounded-2xl text-white border border-primary-400 shadow-lg shadow-primary-500/25"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    transition={{
                      type: "spring",
                      stiffness: SPRING_CONFIG.stiffness,
                      damping: SPRING_CONFIG.damping,
                      mass: SPRING_CONFIG.mass,
                    }}
                  >
                    <Heart size={24} className="shrink-0" />
                  </motion.div>
                  <div>
                    <p className="text-lg font-medium mb-2">
                      "We don't just work together, we grow together. Our
                      culture is built on trust, innovation, and mutual
                      respect."
                    </p>
                    <p className="text-white/80 text-sm">
                      — Employee Testimonial
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CultureEnvironmentSection;
