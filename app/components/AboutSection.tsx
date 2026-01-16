"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Check, ArrowUpRight, Sparkles } from "lucide-react";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
  type Variants,
} from "framer-motion";

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

const FEATURE_VARIANTS: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.3 + i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const IMAGE_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

interface AboutSectionProps {
  data: {
    sectionLabel: string;
    headingPart1: string;
    headingPart2: string;
    subheading: string;
    description1: string;
    brandName: string;
    features: string[];
    description2: string;
    buttonLabel: string;
    buttonLink: string;
    images: {
      tallImage: string;
      smallImage: string;
    };
    stats: {
      percentage: string;
      label: string;
    };
  };
}

function AboutSection({ data }: AboutSectionProps) {
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
      className="relative bg-white py-4 lg:py-24 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* LEFT CONTENT */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key="about-content"
              variants={CONTAINER_VARIANTS}
              initial="hidden"
              animate={controls}
              exit="hidden"
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
                  {data.headingPart1}
                  <br />
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
                <p className="mt-4 text-lg text-gray-600">{data.subheading}</p>
              </motion.div>

              {/* Description */}
              <motion.div variants={CHILD_VARIANTS}>
                <p className="mt-8 text-lg leading-relaxed text-gray-600 max-w-xl">
                  {data.description1.split(data.brandName)[0]}
                  <span className="font-semibold text-gray-900 bg-primary-50 px-1.5 py-0.5 rounded">
                    {data.brandName}
                  </span>
                  {data.description1.split(data.brandName)[1]}
                </p>
              </motion.div>

              {/* Features List */}
              <motion.div
                variants={CHILD_VARIANTS}
                className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <AnimatePresence>
                  {data.features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      custom={index}
                      variants={FEATURE_VARIANTS}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      className="flex items-center gap-3 group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{
                          type: "spring",
                          stiffness: SPRING_CONFIG.stiffness,
                          damping: SPRING_CONFIG.damping,
                          mass: SPRING_CONFIG.mass,
                        }}
                        className="shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center border border-primary-200/50"
                      >
                        <Check size={16} className="text-primary-500" />
                      </motion.div>
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Additional Text */}
              <motion.div variants={CHILD_VARIANTS}>
                <p className="mt-8 text-lg leading-relaxed text-gray-600 max-w-xl">
                  {data.description2}
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.div variants={CHILD_VARIANTS} className="mt-12">
                <motion.a
                  href={data.buttonLink}
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
                  <span>{data.buttonLabel}</span>
                  <ArrowUpRight
                    size={18}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
                  />
                </motion.a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT VISUAL GRID */}
        <div className="relative">
          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tall Image */}
            <motion.div
              variants={IMAGE_VARIANTS}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.5 }}
              className="row-span-2 relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/10 border border-gray-100"
            >
              <Image
                src={data.images.tallImage}
                alt="Automation work"
                width={500}
                height={650}
                className="object-cover w-full h-full rounded-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
              />
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-primary-200/20 pointer-events-none"
                animate={{
                  borderWidth: [2, 3, 2],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  delay: 1,
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Small Image */}
            <motion.div
              variants={IMAGE_VARIANTS}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.7 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/10 border border-gray-100"
            >
              <Image
                src={data.images.smallImage}
                alt="Team collaboration"
                width={500}
                height={350}
                className="object-cover w-full h-full rounded-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
              />
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-primary-200/20 pointer-events-none"
                animate={{
                  borderWidth: [2, 3, 2],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  delay: 1.2,
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.9 }}
              className="relative p-8 rounded-2xl bg-linear-to-br from-primary-50/50 to-primary-100/30 border border-primary-100/50 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500 mb-2">
                  {data.stats.percentage}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {data.stats.label}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
