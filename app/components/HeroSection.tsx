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
    title: string;
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
    <section className="relative bg-linear-to-b from-white via-gray-50/30 to-white pt-28 pb-15 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* LEFT CONTENT */}
        <div ref={mainContentRef} className="relative z-10">
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
                className="inline-flex items-center gap-2 mb-4 px-4 py-2.5 bg-linear-to-r from-primary-50 to-primary-100 text-secondary-900 text-sm font-semibold rounded-lg border border-primary-200/50"
              >
                <span>{data.subtitle}</span>
              </motion.div>

              {/* Main Heading */}
              <motion.div variants={CHILD_VARIANTS}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight text-gray-900">
                  {data.title.split(data.highlightedText)[0]}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-primary-500 bg-clip-text">
                      {data.highlightedText}
                    </span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={isMainInView ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{
                        delay: 0.5,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      className="absolute bottom-1 left-0 right-0 h-3 bg-primary-100/50 z-0 rounded-lg"
                    />
                  </span>
                  {data.title.split(data.highlightedText)[1]}
                </h1>
              </motion.div>

              {/* Description */}
              {data.description.map((paragraph, index) => (
                <motion.div key={index} variants={CHILD_VARIANTS}>
                  <p
                    className={`mt-${
                      index === 0 ? "8" : "4"
                    } text-lg leading-relaxed text-gray-600 max-w-xl`}
                  >
                    {paragraph}
                  </p>
                </motion.div>
              ))}

              {/* CTA ROW */}
              <motion.div
                variants={CHILD_VARIANTS}
                className="mt-12 flex flex-wrap items-center gap-6"
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
                  className="group relative bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-10 py-4 rounded-full font-semibold text-base shadow-lg shadow-primary-500/25 flex items-center gap-3"
                >
                  <span>{data.ctaButton.text}</span>
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </motion.a>

                {data.secondaryButton && (
                  <motion.a
                    href={data.secondaryButton.href}
                    onClick={handleSecondaryClick}
                    className="group text-primary-600 hover:text-primary-700 font-medium text-base flex items-center gap-2"
                  >
                    <span>{data.secondaryButton.text}</span>
                    <ArrowUpRight
                      size={18}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
                    />
                  </motion.a>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT IMAGE + STATS */}
        <div className="relative">
          {/* Rating Badge */}
          <motion.div
            variants={RATING_BADGE_VARIANTS}
            initial="hidden"
            animate="visible"
            className="absolute -top-6 -right-4 lg:top-8 lg:right-8 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 text-sm shadow-xl shadow-gray-900/10 border border-gray-100 z-20"
          >
            <div className="flex items-center gap-2 mb-1">
              <StarRating score={data.rating.score} />
              <span className="text-xs font-semibold text-gray-900">
                {data.rating.count.toLocaleString()}+ {data.rating.label}
              </span>
            </div>
            <motion.p
              whileHover={{ x: 4 }}
              className="text-primary-500 font-medium cursor-pointer inline-flex items-center gap-1"
            >
              See Our Latest Project
              <ArrowUpRight size={14} />
            </motion.p>
          </motion.div>

          {/* Image Container */}
          <ImageWithEffects
            imageUrl={data.image.url}
            imageAlt={data.image.alt}
            imageLoaded={imageLoaded}
            setImageLoaded={setImageLoaded}
          />

          {/* STATS SECTION */}
          <div
            ref={statsRef}
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-2 text-center"
          >
            {data.stats.map((stat, index) => (
              <AnimatedStat
                key={stat.label}
                {...stat}
                isInView={isStatsInView}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </div>

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
      className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100 shadow-sm cursor-pointer group"
      aria-label={label}
    >
      <Icon
        size={20}
        className="text-primary-500 group-hover:text-primary-600 transition-colors duration-200"
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
          className="w-4 h-4 text-yellow-400 fill-current"
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
      <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-900/10 border border-gray-100">
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={640}
          height={480}
          className={`rounded-3xl object-cover w-full h-auto transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 animate-pulse rounded-3xl" />
        )}
      </div>
      <AnimatedBorder />
    </motion.div>
  );
}

function AnimatedBorder() {
  return (
    <motion.div
      className="absolute inset-0 rounded-3xl border-2 border-primary-200/20 pointer-events-none"
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
      className="group relative p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="relative">
        <div className="text-xl font-bold text-gray-900 mb-2 min-h-10 flex items-center justify-center">
          {isInView ? <Counter from={0} to={number} /> : "0+"}
        </div>
        <div className="h-0.5 w-12 bg-linear-to-r from-primary-400 to-primary-300 rounded-full mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-600 text-center line-clamp-2">
          {label}
        </p>
      </div>
      <div className="absolute -inset-1 bg-linear-to-r from-primary-100/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
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
