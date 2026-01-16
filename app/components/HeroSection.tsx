"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Link2, ArrowUpRight, Sparkles, ChevronRight } from "lucide-react";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
  type Variants,
  type Transition,
} from "framer-motion";
import ServicesCardsSection from "./ServicesCardsSection.tsx";

// Types
interface StatProps {
  number: number;
  label: string;
  isInView: boolean;
  delay?: number;
}

interface CounterProps {
  from: number;
  to: number;
}

interface AnimationConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

// Animation constants
const SPRING_CONFIG: AnimationConfig = {
  stiffness: 300,
  damping: 25,
  mass: 0.5,
};

const FLOAT_ANIMATION = {
  y: [0, -8, 0] as [number, number, number],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

// Animation variants with proper typing
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

const RATING_BADGE_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.8,
      type: "spring",
      stiffness: SPRING_CONFIG.stiffness,
      damping: SPRING_CONFIG.damping,
      mass: SPRING_CONFIG.mass,
    },
  },
};

const STAT_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

interface HeroSectionProps {
  data: {
    titleLines: string[];
    highlightedIndices: number[];
    subtitle: string;
    description: string[];
    highlightedText: string;
    ctaButton: {
      text: string;
      action: string;
      href: string;
    };
    secondaryButton?: {
      text: string;
      action: string;
      href: string;
    };
    rating: {
      score: number;
      count: number;
      label: string;
    };
    image: {
      url: string;
      alt: string;
    };
    stats: Array<{
      number: number;
      label: string;
    }>;
    services: {
      isImageCard: boolean;
      imageSrc: string;
      imageAlt: string;
      title: string;
      description: string;
    }[];
  };
}

function HeroSection({ data }: HeroSectionProps) {
  const mainContentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const isMainInView = useInView(mainContentRef, { once: true, amount: 0.2 });
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.2 });

  const mainControls = useAnimation();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isMainInView) {
      mainControls.start("visible");
    }
  }, [isMainInView, mainControls]);

  const handleCtaClick = () => {
    if (data.ctaButton.action === "openTrialModal") {
      // Add your modal opening logic here
      console.log("Opening free trial modal");
    }
    // Add other action handlers as needed
  };

  const handleSecondaryClick = () => {
    if (data.secondaryButton?.action === "scrollToCaseStudies") {
      // Add scroll logic here
      console.log("Scrolling to case studies");
    }
  };

  return (
    <section className="relative bg-linear-to-b from-white via-gray-50/30 to-white pt-20 md:pt-28 pb-12 md:pb-15 overflow-hidden">
      {/* Background decorative elements for mobile */}
      <motion.div
        className="absolute -left-4 -top-4 w-24 h-24 rounded-full bg-linear-to-br from-primary-100/20 to-primary-200/10 blur-xl -z-10 md:hidden"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
        {/* LEFT CONTENT - Mobile order first */}
        <div ref={mainContentRef} className="relative z-10 order-1 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key="main-content"
              variants={CONTAINER_VARIANTS}
              initial="hidden"
              animate={mainControls}
              exit="hidden"
            >
              {/* Top Label */}
              <motion.div
                variants={CHILD_VARIANTS}
                className="inline-flex items-center gap-2 mb-4 px-3 py-2 md:px-4 md:py-2.5 bg-linear-to-l from-rose-200 via-primary-50 to-rose-200 text-secondary-900 text-xs sm:text-sm font-semibold rounded-lg border border-primary-200/50"
              >
                <span>{data.subtitle}</span>
              </motion.div>

              {/* Main Heading */}
              <motion.div variants={CHILD_VARIANTS}>
                <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold leading-[1.1] sm:leading-[1.15] md:leading-[1.1] tracking-tight text-gray-900 relative">
                  {/* Background decorative elements for desktop */}
                  <motion.div
                    className="absolute -left-8 -top-6 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:-left-12 lg:-top-8 lg:w-32 lg:h-32 rounded-full bg-linear-to-br from-primary-100/30 to-primary-200/20 blur-xl md:blur-2xl -z-10"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  <motion.div
                    className="absolute -right-4 -bottom-4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:-right-8 lg:-bottom-6 lg:w-24 lg:h-24 rounded-full bg-linear-to-tr from-primary-50/20 to-blue-50/10 blur-lg md:blur-xl -z-10"
                    animate={{
                      y: [0, -20, 0],
                      x: [0, 15, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {data.titleLines.map((line, index) => {
                    const isHighlighted =
                      data.highlightedIndices?.includes(index);

                    return (
                      <React.Fragment key={index}>
                        {/* Line container */}
                        <motion.span
                          className="relative inline-block overflow-visible"
                          initial={{ opacity: 0, y: 20 }}
                          animate={isMainInView ? { opacity: 1, y: 0 } : {}}
                          transition={{
                            duration: 0.7,
                            delay: index * 0.15,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          {isHighlighted ? (
                            <>
                              {/* Continuous floating effect for highlighted text */}
                              <motion.div
                                className="relative z-10 inline-block"
                                animate={
                                  isMainInView
                                    ? {
                                        y: [0, -3, 0],
                                      }
                                    : {}
                                }
                                transition={{
                                  duration: 4,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: index * 0.3,
                                }}
                              >
                                {/* Main highlighted text with continuous glow */}
                                <motion.span
                                  className="relative z-20 inline-block"
                                  initial={{ opacity: 0 }}
                                  animate={isMainInView ? { opacity: 1 } : {}}
                                  transition={{ delay: index * 0.15 + 0.3 }}
                                >
                                  <span className="relative z-30 bg-linear-to-r from-primary-500 via-primary-500 to-primary-500 bg-clip-text text-transparent bg-size-[200%_100%]">
                                    {line}
                                  </span>

                                  {/* Continuous gradient animation */}
                                  <motion.div
                                    className="absolute inset-0 bg-linear-to-r from-primary-500 via-primary-500 to-primary-500 bg-clip-text text-transparent bg-size-[200%_100%] opacity-0"
                                    animate={
                                      isMainInView
                                        ? {
                                            opacity: [0, 0.5, 0],
                                            backgroundPosition: [
                                              "0% 0%",
                                              "100% 0%",
                                              "0% 0%",
                                            ],
                                          }
                                        : {}
                                    }
                                    transition={{
                                      duration: 3,
                                      repeat: Infinity,
                                      delay: index * 0.5,
                                    }}
                                  >
                                    {line}
                                  </motion.div>
                                </motion.span>

                                {/* Continuous gradient underline */}
                                <motion.div
                                  className="absolute -bottom-1 left-0 right-0 h-2 sm:h-3 rounded-lg z-10 overflow-hidden"
                                  initial={{ scaleX: 0, opacity: 0 }}
                                  animate={
                                    isMainInView
                                      ? {
                                          scaleX: 1,
                                          opacity: 1,
                                        }
                                      : {}
                                  }
                                  transition={{
                                    delay: index * 0.15 + 0.5,
                                    duration: 0.8,
                                    ease: "easeOut",
                                  }}
                                >
                                  <motion.div
                                    className="absolute inset-0 bg-linear-to-r from-primary-100 via-primary-50 to-primary-100"
                                    animate={
                                      isMainInView
                                        ? {
                                            x: ["-100%", "100%"],
                                          }
                                        : {}
                                    }
                                    transition={{
                                      duration: 3,
                                      repeat: Infinity,
                                      ease: "linear",
                                      delay: index * 0.2,
                                    }}
                                  />
                                </motion.div>
                              </motion.div>
                            </>
                          ) : (
                            // Regular text with subtle continuous animation
                            <motion.span
                              className="inline-block relative text-accent"
                              initial={{ opacity: 0, filter: "blur(4px)" }}
                              animate={
                                isMainInView
                                  ? {
                                      opacity: 1,
                                      filter: "blur(0px)",
                                      y: [0, -1, 0],
                                    }
                                  : {}
                              }
                              transition={{
                                delay: index * 0.15 + 0.2,
                                duration: 0.6,
                                y: {
                                  duration: 8,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: index * 0.2,
                                },
                              }}
                            >
                              {line}
                            </motion.span>
                          )}
                        </motion.span>

                        {/* Line break with animated separator - Hide on smallest screens */}
                        {index < data.titleLines.length - 1 && (
                          <>
                            <br className="hidden sm:block" />
                            {/* Animated separator dots */}
                            <motion.div
                              className="hidden sm:inline-flex items-center gap-1 mx-2 sm:mx-3 md:mx-4"
                              initial={{ opacity: 0 }}
                              animate={isMainInView ? { opacity: 1 } : {}}
                              transition={{ delay: index * 0.15 + 0.8 }}
                            >
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary-300"
                                  animate={
                                    isMainInView
                                      ? {
                                          scale: [1, 1.5, 1],
                                          opacity: [0.5, 1, 0.5],
                                        }
                                      : {}
                                  }
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.3 + index * 0.2,
                                  }}
                                />
                              ))}
                            </motion.div>
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </h1>
              </motion.div>

              {/* Description */}
              {data.description.map((paragraph, index) => (
                <motion.div key={index} variants={CHILD_VARIANTS}>
                  <p
                    className={`mt-${
                      index === 0 ? "6" : "4"
                    } text-base sm:text-lg leading-relaxed text-accent max-w-xl`}
                  >
                    {paragraph}
                  </p>
                </motion.div>
              ))}

              {/* CTA ROW */}
              <motion.div
                variants={CHILD_VARIANTS}
                className="mt-8 sm:mt-10 md:mt-12 flex flex-wrap items-center gap-4 sm:gap-6"
              >
                <motion.a
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
                  href={data.ctaButton.href}
                  onClick={handleCtaClick}
                  className="group relative bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full font-semibold text-sm sm:text-base shadow-lg shadow-primary-500/25 flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center"
                >
                  <span>{data.ctaButton.text}</span>
                  <ChevronRight
                    size={16}
                    className="sm:size-[18px] group-hover:translate-x-1 transition-transform duration-200"
                  />
                </motion.a>

                {data.secondaryButton && (
                  <motion.a
                    href={data.secondaryButton.href}
                    onClick={handleSecondaryClick}
                    className="group text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-center md:justify-start"
                  >
                    <span>{data.secondaryButton.text}</span>
                    <ArrowUpRight
                      size={16}
                      className="sm:size-[18px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
                    />
                  </motion.a>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT IMAGE + STATS - Mobile order second */}
        <div className="relative group order-2 lg:order-2">
          {/* YouTube Video Container with Enhanced Styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl sm:shadow-2xl shadow-gray-900/10 border border-gray-100 bg-gray-900"
          >
            {/* Video Container with Hover Effects */}
            <div className="relative aspect-video overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl">
              <iframe
                className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl lg:rounded-3xl"
                src="https://www.youtube.com/embed/B4z8t1AEqTg?si=dmmidu-G4kjcOG5j&rel=0&modestbranding=1"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* STATS SECTION - Enhanced */}
          <div ref={statsRef} className="mt-8 sm:mt-12 md:mt-16 lg:mt-20">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2 md:gap-2 lg:gap-2">
              {data.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <AnimatedStat
                    {...stat}
                    isInView={isStatsInView}
                    delay={index * 0.1}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <ServicesCardsSection data={data} />
    </section>
  );
}

// Helper Components

interface IconButtonProps {
  icon: React.ComponentType<{ size: number; className?: string }>;
  animation: "rotate" | "scale";
  label: string;
}

function IconButton({ icon: Icon, animation, label }: IconButtonProps) {
  const animationProps = {
    rotate: { whileHover: { rotate: 90 } },
    scale: { whileHover: { scale: 1.2 } },
  }[animation];

  return (
    <motion.div
      {...animationProps}
      whileHover={{
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        ...animationProps.whileHover,
      }}
      transition={{
        type: "spring",
        stiffness: SPRING_CONFIG.stiffness,
        damping: SPRING_CONFIG.damping,
        mass: SPRING_CONFIG.mass,
      }}
      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100 shadow-sm cursor-pointer group"
      aria-label={label}
    >
      <Icon
        size={18}
        className="sm:size-[20px] text-primary-500 group-hover:text-primary-600 transition-colors duration-200"
      />
    </motion.div>
  );
}

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <motion.svg
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 + i * 0.1 }}
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </motion.svg>
      ))}
    </div>
  );
}

interface ImageWithEffectsProps {
  imageUrl: string;
  imageAlt: string;
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
}

function ImageWithEffects({
  imageUrl,
  imageAlt,
  imageLoaded,
  setImageLoaded,
}: ImageWithEffectsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl shadow-gray-900/10 border border-gray-100">
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={640}
          height={480}
          className={`rounded-2xl sm:rounded-3xl object-cover w-full h-auto transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl sm:rounded-3xl" />
        )}
      </div>
      <AnimatedBorder />
    </motion.div>
  );
}

function AnimatedBorder() {
  return (
    <motion.div
      className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-primary-200/20 pointer-events-none"
      animate={{
        borderWidth: [2, 3, 2],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function AnimatedStat({ number, label, isInView, delay = 0 }: StatProps) {
  return (
    <motion.div
      variants={STAT_VARIANTS}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={delay}
      className="group relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="relative">
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent mb-1 sm:mb-2 min-h-8 sm:min-h-10 flex items-center justify-center">
          {isInView ? <Counter from={0} to={number} /> : "0+"}
        </div>
        <div className="h-0.5 w-8 sm:w-10 md:w-12 bg-linear-to-r from-primary-400 to-primary-300 rounded-full mx-auto mb-2 sm:mb-3" />
        <p className="text-xs sm:text-sm font-medium text-accent text-center line-clamp-2">
          {label}
        </p>
      </div>
      <div className="absolute -inset-1 bg-linear-to-r from-primary-100/20 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </motion.div>
  );
}

function Counter({ from, to }: CounterProps) {
  const [count, setCount] = useState<number>(from);

  useEffect(() => {
    if (from === to) {
      setCount(to);
      return;
    }

    const duration = 2000;
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Ease-out cubic function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentCount = from + (to - from) * easeOutCubic;

      setCount(Math.floor(currentCount));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [from, to]);

  return <span>{count.toLocaleString()}+</span>;
}

export default HeroSection;
